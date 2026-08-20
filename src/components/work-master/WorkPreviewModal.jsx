import React from 'react';
import { X, Video, FileText, CheckCircle2, Clock, Target, Layers, ShieldCheck, Download, Award } from 'lucide-react';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';

export const WorkPreviewModal = ({ work, isOpen, onClose }) => {
  if (!isOpen || !work) return null;

  const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: '#0A2240' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wm-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="work-dept-badge">{work.department} &bull; {work.role}</span>
              <span className="work-level-badge" style={{ backgroundColor: levelInfo.badgeColor }}>{work.level}</span>
              <span className={`status-pill ${work.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                {work.status === 'ACTIVE' ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <h2 className="modal-title" style={{ fontSize: '1.65rem' }}>{work.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {work.description || work.shortDescription}
        </p>

        {/* Training Video Section */}
        {work.trainingVideo && (
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <Video size={20} color="#0A2240" />
              <span>Training Video</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 'auto' }}>
                Duration: {work.trainingVideo.duration}
              </span>
            </h3>

            <div className="video-preview-box">
              <video
                controls
                className="video-player"
                src={work.trainingVideo.url}
                poster="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60"
              >
                Your browser does not support HTML5 video preview.
              </video>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#C5A059" />
              <span>Video File: {work.trainingVideo.name}</span>
            </div>
          </div>
        )}

        {/* SOP & Documents Section */}
        {work.documents && work.documents.length > 0 && (
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <FileText size={20} color="#C5A059" />
              <span>Learning Resources & Documents</span>
            </h3>

            {work.documents.map((doc) => (
              <div key={doc.id || doc.name} className="document-item-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={22} color="#0A2240" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--jpm-navy)' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      Type: {doc.type} &bull; Size: {doc.size || '2.0 MB'} &bull; Uploaded: {doc.uploadDate || '2026-08-20'}
                    </div>
                  </div>
                </div>

                <button
                  className="wm-action-btn"
                  onClick={() => alert(`Simulating download/view for ${doc.name}`)}
                  title="Download Document"
                >
                  <Download size={15} />
                  <span>Preview Document</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Key Learning Points */}
        {work.learningPoints && work.learningPoints.length > 0 && (
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <CheckCircle2 size={20} color="#166534" />
              <span>What You Will Learn</span>
            </h3>

            <div className="checklist-group">
              {work.learningPoints.map((point, idx) => (
                <div key={idx} className="checklist-item is-checked" style={{ cursor: 'default' }}>
                  <CheckCircle2 size={18} color="#C5A059" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span className="checklist-text">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Training Information */}
        {work.practical && (
          <div className="wm-form-section" style={{ borderBottom: 'none', marginBottom: 0 }}>
            <h3 className="wm-form-section-title">
              <Layers size={20} color="#0A2240" />
              <span>Practical Training Requirements</span>
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              backgroundColor: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Practical Duration
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jpm-navy)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={18} color="#C5A059" /> {work.practical.durationDays} Days
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Expected Outcome
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={18} color="#166534" /> {work.practical.expectedOutcome || 'Independent execution mastery'}
                </div>
              </div>

              {work.practical.accuracyTarget && (
                <div>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Accuracy Target
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jpm-navy)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={18} color="#D97706" /> {work.practical.accuracyTarget}
                  </div>
                </div>
              )}
            </div>

            {work.practical.instructions && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                <strong>Instructions:</strong> {work.practical.instructions}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
