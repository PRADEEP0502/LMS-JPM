import React from 'react';
import { Eye, Edit3, Video, FileText, CheckCircle2, Power, Layers } from 'lucide-react';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';

export const WorkCard = ({ work, onPreview, onEdit, onToggleStatus }) => {
  const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: '#0A2240' };
  const isActive = work.status === 'ACTIVE';

  return (
    <div className={`work-item-card ${!isActive ? 'is-inactive' : ''}`}>
      <div className="work-info-main">
        <div className="work-badge-row">
          <span className="work-dept-badge">
            {work.department} &bull; {work.role}
          </span>
          <span className="work-level-badge" style={{ backgroundColor: levelInfo.badgeColor }}>
            {work.level}
          </span>
          <span className={`status-pill ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? '● Active' : '○ Inactive'}
          </span>
        </div>

        <h3 className="work-name">{work.name}</h3>
        <p className="work-short-desc">{work.shortDescription}</p>

        <div className="work-resources-row">
          {work.trainingVideo && (
            <span className="resource-indicator">
              <Video size={14} color="#0A2240" />
              <span>Video Available ({work.trainingVideo.duration})</span>
            </span>
          )}

          {work.documents && work.documents.length > 0 && (
            <span className="resource-indicator">
              <FileText size={14} color="#C5A059" />
              <span>{work.documents.length} Learning Document{work.documents.length > 1 ? 's' : ''}</span>
            </span>
          )}

          {work.practical && (
            <span className="resource-indicator">
              <Layers size={14} color="#475569" />
              <span>Practical ({work.practical.durationDays} Days)</span>
            </span>
          )}
        </div>
      </div>

      <div className="work-actions-group">
        <button
          className="wm-action-btn btn-primary"
          onClick={() => onPreview(work)}
          title="Preview Work & Learning Content"
        >
          <Eye size={15} />
          <span>View</span>
        </button>

        <button
          className="wm-action-btn"
          onClick={() => onEdit(work)}
          title="Edit Work Details"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </button>

        <button
          className="wm-action-btn"
          onClick={() => onToggleStatus(work.id)}
          title={isActive ? 'Deactivate Work' : 'Activate Work'}
          style={{ color: isActive ? '#DC2626' : '#166534' }}
        >
          <Power size={15} />
          <span>{isActive ? 'Deactivate' : 'Activate'}</span>
        </button>
      </div>
    </div>
  );
};
