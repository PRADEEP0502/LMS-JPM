import React from 'react';
import { CheckCircle2, Lock, UserCheck, FileCheck, Users, Laptop, CheckCircle } from 'lucide-react';
import { INITIAL_ONBOARDING_STAGES } from '../../modules/onboarding/onboardingData';

const ICON_MAP = {
  UserCheck: UserCheck,
  FileCheck: FileCheck,
  Users: Users,
  Laptop: Laptop,
  CheckCircle: CheckCircle
};

export const VisualJourneyTrack = ({
  currentStageIndex,
  completedStageIds = [],
  selectedStageIndex,
  onSelectStage
}) => {
  const totalStages = INITIAL_ONBOARDING_STAGES.length;
  const completedCount = completedStageIds.length;
  const percentage = Math.round((completedCount / totalStages) * 100);

  const currentStage = INITIAL_ONBOARDING_STAGES[currentStageIndex];
  const nextStage = INITIAL_ONBOARDING_STAGES[currentStageIndex + 1];

  const lineFillPercentage = completedCount === 0
    ? 0
    : Math.min(100, Math.round((currentStageIndex / (totalStages - 1)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Overall Progress Header */}
      <div className="progress-header-card">
        <div className="progress-header-top">
          <div className="progress-title-group">
            <h2>Your Onboarding Progress</h2>
            <p>
              <strong>{completedCount} of {totalStages} completed</strong> &bull; Current Step: <strong>{currentStage?.shortName}</strong>
              {nextStage && <span> &bull; Next: <strong>{nextStage.shortName}</strong></span>}
            </p>
          </div>
          <div className="progress-percentage-badge">
            {percentage}% Complete
          </div>
        </div>

        <div className="progress-track-bg">
          <div className="progress-track-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Desktop Horizontal Connected Visual Track */}
      <div className="desktop-journey-track">
        <div className="journey-connecting-line">
          <div className="journey-connecting-line-fill" style={{ width: `${lineFillPercentage}%` }} />
        </div>

        <div className="journey-nodes-row">
          {INITIAL_ONBOARDING_STAGES.map((stage, idx) => {
            const isCompleted = completedStageIds.includes(stage.id);
            const isCurrent = idx === currentStageIndex;
            const isLocked = !isCompleted && idx > currentStageIndex;
            const isSelected = idx === selectedStageIndex;

            const IconComponent = ICON_MAP[stage.iconName] || UserCheck;

            let nodeClass = 'stage-node';
            if (isCompleted) nodeClass += ' is-completed';
            if (isCurrent) nodeClass += ' is-current';
            if (isLocked) nodeClass += ' is-locked';
            if (isSelected) nodeClass += ' is-selected';

            return (
              <button
                key={stage.id}
                className={nodeClass}
                onClick={() => !isLocked && onSelectStage(idx)}
                disabled={isLocked}
                title={isLocked ? 'Complete current stage to unlock' : `View ${stage.title}`}
              >
                <div className="node-icon-circle">
                  {isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : isLocked ? (
                    <Lock size={20} />
                  ) : (
                    <IconComponent size={24} />
                  )}
                </div>

                <span className="node-step-label">
                  STEP {stage.stageNumber}
                </span>

                <span className="node-title">
                  {stage.shortName}
                </span>

                {isCurrent && <span className="node-current-tag">Current Step</span>}
                {isCompleted && <span style={{ fontSize: '0.65rem', color: 'var(--jpm-gold)', fontWeight: '700', marginTop: '2px' }}>✓ Completed</span>}
                {isLocked && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>🔒 Locked</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Dedicated Vertical Timeline (< 960px) */}
      <div className="mobile-journey-track">
        <div className="mobile-timeline-list">
          <div className="mobile-timeline-line" />

          {INITIAL_ONBOARDING_STAGES.map((stage, idx) => {
            const isCompleted = completedStageIds.includes(stage.id);
            const isCurrent = idx === currentStageIndex;
            const isLocked = !isCompleted && idx > currentStageIndex;
            const IconComponent = ICON_MAP[stage.iconName] || UserCheck;

            let rowClass = 'mobile-stage-row';
            if (isCompleted) rowClass += ' is-completed';
            if (isCurrent) rowClass += ' is-current';

            return (
              <div
                key={stage.id}
                className={rowClass}
                onClick={() => !isLocked && onSelectStage(idx)}
                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
              >
                <div className="mobile-node-circle">
                  {isCompleted ? (
                    <CheckCircle2 size={20} />
                  ) : isLocked ? (
                    <Lock size={18} />
                  ) : (
                    <IconComponent size={20} />
                  )}
                </div>
                <div className="mobile-stage-content">
                  <div className="mobile-stage-step">STEP {stage.stageNumber} {isCompleted ? '✓ Completed' : isCurrent ? '● Current' : '🔒 Locked'}</div>
                  <div className="mobile-stage-title">{stage.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
