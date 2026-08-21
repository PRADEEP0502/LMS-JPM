import React from 'react';
import { BookOpen, Hammer, UserCheck, Award, CheckCircle2, Clock, AlertCircle, Lock, ShieldCheck, Activity } from 'lucide-react';
import { STAGE_META, STAGE_STATUS, STAGE_KEYS } from '../../modules/abcd/abcdData';
import '../../styles/abcd.css';

const ICON_MAP = { BookOpen, Hammer, UserCheck, Award };

const getNodeClass = (status) => {
  switch (status) {
    case STAGE_STATUS.COMPLETED: return 'is-completed';
    case STAGE_STATUS.CURRENT: return 'is-current';
    case STAGE_STATUS.PENDING_HR_VERIFICATION: return 'is-pending';
    case STAGE_STATUS.NEEDS_REVISION: return 'is-revision';
    default: return 'is-locked';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case STAGE_STATUS.COMPLETED: return { label: 'Completed', cls: 'status-completed' };
    case STAGE_STATUS.CURRENT: return { label: 'Current Stage', cls: 'status-current' };
    case STAGE_STATUS.PENDING_HR_VERIFICATION: return { label: 'Pending HR Review', cls: 'status-pending' };
    case STAGE_STATUS.NEEDS_REVISION: return { label: 'Needs Revision', cls: 'status-revision' };
    default: return { label: 'Locked', cls: 'status-locked' };
  }
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';

export const AbcdJourneyTrack = ({ abcdRecord, onSelectStage, selectedStage }) => {
  const stages = abcdRecord?.stages || {};
  const completedCount = STAGE_KEYS.filter(k => stages[k]?.status === STAGE_STATUS.COMPLETED).length;
  const fillPercent = Math.round((completedCount / STAGE_KEYS.length) * 100);

  return (
    <div className="glass-panel" style={{ padding: '2.25rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--jpm-muted)', marginBottom: '4px' }}>
            ACCOUNTABILITY & COMPETENCY JOURNEY
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--jpm-text)' }}>
            A &rarr; B &rarr; C &rarr; D Progression
          </h2>
        </div>
        <div className="jpm-badge-peach" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
          {fillPercent}% Completed
        </div>
      </div>

      {/* Requirement #15: A -> B -> C -> D Connected Soft Stage Bar */}
      <div className="abcd-desktop-track">
        <div style={{ position: 'relative' }}>
          <div className="abcd-connecting-line">
            <div className="abcd-connecting-fill" style={{ width: `${fillPercent}%` }} />
          </div>
          <div className="abcd-nodes-row">
            {STAGE_KEYS.map((key) => {
              const stageData = stages[key] || { status: STAGE_STATUS.LOCKED };
              const meta = STAGE_META[key];
              const IconComp = ICON_MAP[meta.icon];
              const statusInfo = getStatusLabel(stageData.status);
              const isSelected = selectedStage === key;

              return (
                <button
                  key={key}
                  className={`abcd-node ${getNodeClass(stageData.status)} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectStage(key)}
                  type="button"
                >
                  <div className="abcd-node-circle">
                    {stageData.status === STAGE_STATUS.COMPLETED ? <CheckCircle2 size={24} /> : <IconComp size={22} />}
                  </div>
                  <span className="abcd-node-letter">STAGE {key}</span>
                  <span className="abcd-node-label">{meta.label}</span>
                  <span className={`abcd-node-status ${statusInfo.cls}`}>{statusInfo.label}</span>
                  {stageData.verifiedAt && stageData.status === STAGE_STATUS.COMPLETED && (
                    <span className="abcd-node-date">{formatDate(stageData.verifiedAt)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Fallback */}
      <div className="abcd-mobile-track">
        <div className="abcd-track-title">Your ABCD Learning Journey</div>
        <div className="abcd-mobile-list">
          <div className="abcd-mobile-line" />
          {STAGE_KEYS.map(key => {
            const stageData = stages[key] || { status: STAGE_STATUS.LOCKED };
            const meta = STAGE_META[key];
            const IconComp = ICON_MAP[meta.icon];
            const statusInfo = getStatusLabel(stageData.status);
            const isSelected = selectedStage === key;
            return (
              <button
                key={key}
                className={`abcd-mobile-node ${getNodeClass(stageData.status)} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectStage(key)}
                type="button"
              >
                <div className="abcd-mobile-circle">
                  {stageData.status === STAGE_STATUS.COMPLETED ? <CheckCircle2 size={20} /> : <IconComp size={18} />}
                </div>
                <div className="abcd-mobile-info">
                  <div className="abcd-mobile-step">Stage {key}</div>
                  <div className="abcd-mobile-title">{meta.label}</div>
                  <span className={`abcd-node-status ${statusInfo.cls}`} style={{ marginTop: '4px' }}>{statusInfo.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
