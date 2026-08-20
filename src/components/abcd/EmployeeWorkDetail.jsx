import React, { useState } from 'react';
import { ArrowLeft, Video, FileText, CheckCircle2 } from 'lucide-react';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';
import { AbcdJourneyTrack } from './AbcdJourneyTrack';
import { AbcdStageDetail } from './AbcdStageDetail';
import { abcdService } from '../../modules/abcd/abcdService';
import '../../styles/abcd.css';

export const EmployeeWorkDetail = ({ assignment, work, abcdRecord, onBack, onSubmitStage, onRefresh }) => {
  const currentStageKey = abcdService.getCurrentStage(abcdRecord);
  const [selectedStage, setSelectedStage] = useState(currentStageKey || 'A');

  if (!work || !abcdRecord) return null;

  const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: 'var(--jpm-primary)' };
  const docCount = work.documents?.length || 0;
  const pointCount = work.learningPoints?.length || 0;

  const handleSubmit = (stageKey, notes) => {
    onSubmitStage(assignment.id, stageKey, notes);
  };

  return (
    <div className="emp-work-detail">
      {/* Back button */}
      <button className="work-detail-back-btn" onClick={onBack} type="button">
        <ArrowLeft size={16} /> My Works
      </button>

      {/* Work header */}
      <div className="work-detail-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
        <div className="work-detail-badges" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="work-dept-badge">{work.department}</span>
          <span className="work-level-badge" style={{ backgroundColor: levelInfo.badgeColor, color: '#FFFFFF' }}>{levelInfo.label}</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--jpm-text)', margin: 0 }}>{work.name}</h1>
        <p style={{ fontSize: '0.975rem', color: 'var(--jpm-text-secondary)', lineHeight: 1.6, margin: 0 }}>{work.description || work.shortDescription}</p>

        <div className="work-detail-resources" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.25rem' }}>
          {work.trainingVideo && (
            <span className="resource-indicator"><Video size={14} color="var(--jpm-primary)" /> Training Video ({work.trainingVideo.duration})</span>
          )}
          {docCount > 0 && (
            <span className="resource-indicator"><FileText size={14} color="var(--jpm-gold)" /> {docCount} Document{docCount > 1 ? 's' : ''}</span>
          )}
          {pointCount > 0 && (
            <span className="resource-indicator"><CheckCircle2 size={14} color="var(--jpm-primary)" /> {pointCount} Learning Points</span>
          )}
        </div>
      </div>

      {/* ABCD Journey */}
      <div className="work-detail-journey-section">
        <AbcdJourneyTrack
          abcdRecord={abcdRecord}
          onSelectStage={setSelectedStage}
          selectedStage={selectedStage}
        />

        <AbcdStageDetail
          stageKey={selectedStage}
          stageData={abcdRecord.stages[selectedStage]}
          workData={work}
          onSubmit={handleSubmit}
          abcdRecord={abcdRecord}
        />
      </div>
    </div>
  );
};
