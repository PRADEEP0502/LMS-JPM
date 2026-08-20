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

  const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: '#0A2240' };
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
      <div className="work-detail-header">
        <div className="work-detail-badges">
          <span className="work-detail-badge">{work.department}</span>
          <span className="work-detail-badge" style={{ backgroundColor: levelInfo.badgeColor, borderColor: levelInfo.badgeColor, color: '#FFFFFF' }}>{levelInfo.label}</span>
        </div>
        <h1>{work.name}</h1>
        <p>{work.description || work.shortDescription}</p>

        <div className="work-detail-resources">
          {work.trainingVideo && (
            <span className="work-resource-pill"><Video size={14} /> Training Video ({work.trainingVideo.duration})</span>
          )}
          {docCount > 0 && (
            <span className="work-resource-pill"><FileText size={14} /> {docCount} Document{docCount > 1 ? 's' : ''}</span>
          )}
          {pointCount > 0 && (
            <span className="work-resource-pill"><CheckCircle2 size={14} /> {pointCount} Learning Points</span>
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
