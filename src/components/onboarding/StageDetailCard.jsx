import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, UserCheck, FileCheck, Users, Laptop, CheckCircle } from 'lucide-react';
import { INITIAL_ONBOARDING_STAGES } from '../../modules/onboarding/onboardingData';

const ICON_MAP = {
  UserCheck: UserCheck,
  FileCheck: FileCheck,
  Users: Users,
  Laptop: Laptop,
  CheckCircle: CheckCircle
};

export const StageDetailCard = ({
  stageIndex,
  isCompleted,
  isCurrent,
  onCompleteStage
}) => {
  const stage = INITIAL_ONBOARDING_STAGES[stageIndex];
  const IconComponent = stage ? (ICON_MAP[stage.iconName] || UserCheck) : UserCheck;

  const [checkedItems, setCheckedItems] = useState({});

  if (!stage) return null;

  const handleToggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleComplete = (e) => {
    e.preventDefault();
    onCompleteStage(stageIndex);
  };

  const isLastStage = stageIndex === INITIAL_ONBOARDING_STAGES.length - 1;

  return (
    <div className="stage-detail-card">
      <div className="detail-header-row">
        <div className="detail-title-group">
          <div className="detail-icon-box">
            <IconComponent size={24} />
          </div>
          <div>
            <h3 className="detail-heading">
              Step {stage.stageNumber}: {stage.title}
            </h3>
            <p className="detail-subheading">
              {isCompleted ? '✓ Verified Stage' : isCurrent ? 'Active Onboarding Step' : 'Upcoming Stage'}
            </p>
          </div>
        </div>

        {isCompleted && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-text)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            <CheckCircle2 size={16} /> Verified Stage
          </span>
        )}
      </div>

      <p className="detail-description">
        {stage.description}
      </p>

      {/* Interactive Form Fields (if present) */}
      {stage.fields && (
        <div className="stage-interactive-area">
          <form className="form-grid" onSubmit={handleComplete}>
            {stage.fields.map((field) => (
              <div key={field.id} className="form-group" style={{ gridColumn: field.type === 'select' ? 'span 2' : 'auto' }}>
                <label className="form-label" htmlFor={field.id}>{field.label}</label>
                {field.type === 'select' ? (
                  <select id={field.id} className="form-input" defaultValue={field.defaultValue}>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    className="form-input"
                    defaultValue={field.defaultValue}
                    readOnly={field.readOnly}
                    style={{ backgroundColor: field.readOnly ? 'var(--bg-subtle)' : 'var(--bg-surface)' }}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
      )}

      {/* Interactive Checklist (if present) */}
      {stage.checklist && (
        <div className="stage-interactive-area">
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--jpm-navy)', marginBottom: '0.75rem' }}>
            Action Verification Items
          </h4>
          <div className="checklist-group">
            {stage.checklist.map((item) => {
              const isChecked = isCompleted || !!checkedItems[item.id];
              return (
                <label
                  key={item.id}
                  className={`checklist-item ${isChecked ? 'is-checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCheck(item.id)}
                    disabled={isCompleted}
                  />
                  <span className="checklist-text">{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage Action Bar */}
      <div className="stage-action-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--jpm-text-secondary)' }}>
          <ShieldCheck size={18} color="var(--jpm-gold)" />
          <span>Junior Processing Mill Onboarding Verification</span>
        </div>

        {isCurrent && (
          <button className="complete-step-btn" onClick={handleComplete}>
            <span>{isLastStage ? 'Complete Onboarding & Unlock Portal' : `Save & Continue to Step ${stage.stageNumber + 1}`}</span>
            <ArrowRight size={18} />
          </button>
        )}

        {isCompleted && (
          <button
            className="complete-step-btn"
            style={{ backgroundColor: 'var(--jpm-primary-soft)', color: 'var(--jpm-primary)' }}
            onClick={() => onCompleteStage(stageIndex)}
          >
            <span>Review Next Active Step</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
