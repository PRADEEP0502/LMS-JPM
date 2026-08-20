import React from 'react';
import { BookOpen, Hammer, UserCheck, Award, CheckCircle2, Clock, AlertCircle, Lock, ShieldCheck, Calendar, Activity, ChevronRight } from 'lucide-react';
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
    case STAGE_STATUS.CURRENT: return { label: 'Current', cls: 'status-current' };
    case STAGE_STATUS.PENDING_HR_VERIFICATION: return { label: 'Pending HR', cls: 'status-pending' };
    case STAGE_STATUS.NEEDS_REVISION: return { label: 'Needs Revision', cls: 'status-revision' };
    default: return { label: 'Locked', cls: 'status-locked' };
  }
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';

export const AbcdJourneyTrack = ({ abcdRecord, onSelectStage, selectedStage }) => {
  const stages = abcdRecord?.stages || {};
  const completedCount = STAGE_KEYS.filter(k => stages[k]?.status === STAGE_STATUS.COMPLETED).length;
  const fillPercent = Math.round((completedCount / STAGE_KEYS.length) * 100);

  // Conversion height percentages for Zentra 3D Bar Funnel visual
  const stageFunnelData = {
    A: { val: '100%', height: '85%', label: '100% Learnt' },
    B: { val: '75%', height: '68%', label: '75% Practical' },
    C: { val: '50%', height: '48%', label: '50% Verified' },
    D: { val: '25%', height: '28%', label: '25% Entitled' }
  };

  return (
    <div className="zentra-dashboard-layout">
      {/* Left Column: Funnel & ABCD Stage Nodes */}
      <div className="zentra-main-analytics-card">
        {/* Top Header Row */}
        <div className="zentra-card-top-row">
          <div>
            <div className="zentra-card-subtitle">WORK LEARNING & COMPETENCY FUNNEL</div>
            <h2 className="zentra-card-title">ABCD Stage Progression</h2>
          </div>
          <div className="zentra-date-pill">
            <Calendar size={14} />
            <span>2026 Entitlement Cycle</span>
          </div>
        </div>

        {/* Zentra 3D Slanted Funnel Bar Visualizer */}
        <div className="zentra-funnel-visualizer">
          {STAGE_KEYS.map((key) => {
            const stageData = stages[key] || { status: STAGE_STATUS.LOCKED };
            const meta = STAGE_META[key];
            const isCompleted = stageData.status === STAGE_STATUS.COMPLETED;
            const isCurrent = stageData.status === STAGE_STATUS.CURRENT || stageData.status === STAGE_STATUS.PENDING_HR_VERIFICATION;
            const funnel = stageFunnelData[key];

            return (
              <div key={key} className={`zentra-funnel-col ${isCompleted ? 'is-completed' : isCurrent ? 'is-current' : ''}`}>
                <div className="zentra-funnel-meta">
                  <span className="funnel-stage-name">Stage {key} — {meta.label}</span>
                  <span className="funnel-val">{isCompleted ? '100%' : isCurrent ? 'In Progress' : '0%'}</span>
                </div>
                
                <div className="zentra-funnel-bar-container">
                  <div 
                    className="zentra-funnel-bar" 
                    style={{ 
                      height: isCompleted ? '90%' : isCurrent ? '55%' : '20%',
                      opacity: isCompleted ? 1 : isCurrent ? 0.85 : 0.3
                    }}
                  >
                    <div className="bar-stripe-pattern" />
                  </div>
                </div>

                {/* Floating Tooltip for Active/Selected Stage */}
                {selectedStage === key && (
                  <div className="zentra-floating-tooltip">
                    <span>Stage {key} {meta.label} &bull; {getStatusLabel(stageData.status).label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connected Stage Nodes Selection Bar */}
        <div className="abcd-desktop-track" style={{ marginTop: '1.5rem' }}>
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
                    <span className="abcd-node-letter">Stage {key}</span>
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

        {/* Mobile Vertical Track Fallback */}
        <div className="abcd-mobile-track">
          <div className="abcd-track-title">Your Learning Journey</div>
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

      {/* Right Column: Zentra Gauge Widget + Zentra Dark History Panel */}
      <div className="zentra-right-column">
        {/* Semi-circular Arc Gauge Component (Security status 78% style) */}
        <div className="zentra-gauge-card">
          <div className="gauge-card-header">
            <h3>Entitlement Score</h3>
            <ShieldCheck size={18} color="var(--jpm-gold)" />
          </div>

          <div className="gauge-arc-wrapper">
            <svg viewBox="0 0 100 55" className="gauge-svg">
              {/* Background Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#E4E4E7"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Filled Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#zentraGoldGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="126"
                strokeDashoffset={126 - (126 * (fillPercent / 100))}
              />
              <defs>
                <linearGradient id="zentraGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0A2240" />
                  <stop offset="100%" stopColor="#C5A059" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-value-text">
              <span className="percent-num">{fillPercent}%</span>
              <span className="percent-tag">{fillPercent === 100 ? 'Fully Entitled' : fillPercent >= 50 ? 'In Progress' : 'Initial Stage'}</span>
            </div>
          </div>
        </div>

        {/* Zentra Dark Panel: Session History Style (Dark Navy / Black panel) */}
        <div className="zentra-dark-panel">
          <div className="dark-panel-header">
            <div>
              <h3>Stage Audit Log</h3>
              <p>{completedCount} of 4 verified</p>
            </div>
            <Activity size={18} color="#C5A059" />
          </div>

          <div className="dark-panel-list">
            {STAGE_KEYS.map((key) => {
              const stageData = stages[key] || {};
              const meta = STAGE_META[key];
              const isCompleted = stageData.status === STAGE_STATUS.COMPLETED;
              const isPending = stageData.status === STAGE_STATUS.PENDING_HR_VERIFICATION;
              const isRevision = stageData.status === STAGE_STATUS.NEEDS_REVISION;

              return (
                <div key={key} className={`dark-history-item ${isCompleted ? 'completed' : isPending ? 'pending' : isRevision ? 'revision' : ''}`}>
                  <div className="history-badge-icon">
                    {isCompleted ? '✓' : key}
                  </div>
                  <div className="history-text-content">
                    <span className="history-title">Stage {key} — {meta.label}</span>
                    <span className="history-sub">
                      {isCompleted ? `Verified by HR` : isPending ? `Awaiting HR Audit` : isRevision ? `Revision Requested` : `Locked`}
                    </span>
                  </div>
                  {stageData.verifiedAt && (
                    <span className="history-date">{formatDate(stageData.verifiedAt)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
