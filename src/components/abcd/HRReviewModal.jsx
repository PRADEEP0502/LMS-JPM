import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, AlertCircle, Star, Clock, User, BookOpen } from 'lucide-react';
import { STAGE_META, STAGE_STATUS, STAGE_KEYS } from '../../modules/abcd/abcdData';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';
import '../../styles/abcd.css';

const EMP_NAMES = { 'emp101': 'John Doe', 'emp102': 'Pradeep Kumar' };
const EMP_DEPTS = { 'emp101': 'Corporate Operations', 'emp102': 'Data Entry' };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const HRReviewModal = ({ isOpen, onClose, item, work, onApprove, onReject }) => {
  const [remarks, setRemarks] = useState('');
  const [rating, setRating] = useState(0);
  const [showError, setShowError] = useState(false);

  if (!isOpen || !item) return null;

  const meta = STAGE_META[item.stageKey];
  const empName = EMP_NAMES[item.employeeId] || item.employeeId;
  const empDept = EMP_DEPTS[item.employeeId] || '';
  const levelInfo = work ? WORK_LEVELS.find(l => l.id === work.level) : null;
  const isStageD = item.stageKey === 'D';

  const handleApprove = () => {
    onApprove(item.assignmentId, item.stageKey, remarks, isStageD ? rating : null);
    setRemarks('');
    setRating(0);
    setShowError(false);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      setShowError(true);
      return;
    }
    onReject(item.assignmentId, item.stageKey, remarks);
    setRemarks('');
    setRating(0);
    setShowError(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hr-review-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Stage Verification Review</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Employee Info */}
        <div className="hr-review-section">
          <h3>Employee</h3>
          <div className="hr-review-employee-card">
            <div className="hr-verif-avatar">{empName.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--jpm-text)', fontSize: '1rem' }}>{empName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--jpm-text-secondary)' }}>{empDept} · {item.employeeId}</div>
            </div>
          </div>
        </div>

        {/* Work Info */}
        <div className="hr-review-section">
          <h3>Work</h3>
          <div className="hr-review-work-card">
            <BookOpen size={22} color="var(--jpm-primary)" />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--jpm-text)', fontSize: '1rem' }}>{work?.name || 'Work'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--jpm-text-secondary)' }}>
                {work?.department} {levelInfo ? `· ${levelInfo.label}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Current Stage */}
        <div className="hr-review-section">
          <h3>Current Stage</h3>
          <div className="hr-review-stage-card" style={{ borderLeft: `4px solid ${meta?.color || 'var(--jpm-primary)'}` }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--jpm-text)', fontSize: '1rem' }}>{meta?.fullLabel}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--jpm-text-secondary)', marginTop: '2px' }}>{meta?.description}</div>
              {item.stage?.submittedAt && (
                <div style={{ fontSize: '0.775rem', color: 'var(--jpm-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Submitted: {formatDate(item.stage.submittedAt)}
                </div>
              )}
              {item.stage?.employeeNotes && (
                <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.85rem', backgroundColor: 'var(--jpm-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--jpm-text)', border: '1px solid var(--jpm-border-dark)' }}>
                  <strong>Employee Notes:</strong> {item.stage.employeeNotes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage D: ABCD History */}
        {isStageD && item.abcdRecord && (
          <div className="hr-review-section">
            <h3>ABCD Journey History</h3>
            <div className="hr-review-history">
              {STAGE_KEYS.filter(k => k !== 'D').map(k => {
                const s = item.abcdRecord.stages[k];
                const m = STAGE_META[k];
                return (
                  <div key={k} className="hr-review-history-item">
                    <CheckCircle2 size={16} color={s?.status === STAGE_STATUS.COMPLETED ? '#059669' : 'var(--jpm-muted)'} />
                    <span style={{ fontWeight: 700, color: 'var(--jpm-text)', flex: 1 }}>{m.fullLabel}</span>
                    <span style={{ fontSize: '0.775rem', color: 'var(--jpm-muted)' }}>
                      {s?.verifiedAt ? formatDate(s.verifiedAt) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rating (for Stage D) */}
        {isStageD && (
          <div className="hr-review-section">
            <h3>Performance Rating</h3>
            <div className="hr-rating-group" style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`hr-rating-star ${rating >= n ? 'selected' : ''}`}
                  onClick={() => setRating(n)}
                  type="button"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--jpm-border-dark)',
                    background: rating >= n ? 'var(--jpm-primary)' : 'var(--jpm-bg)',
                    color: rating >= n ? '#FFFFFF' : 'var(--jpm-text)',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ★ {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HR Remarks */}
        <div className="hr-review-section">
          <h3>HR Remarks {showError && <span style={{ color: '#E11D48', fontWeight: 400, fontSize: '0.75rem' }}> — Required for rejection</span>}</h3>
          <textarea
            className={`hr-review-textarea ${showError ? 'has-error' : ''}`}
            rows={3}
            placeholder="Enter remarks, feedback, or instructions for the employee..."
            value={remarks}
            onChange={e => { setRemarks(e.target.value); setShowError(false); }}
          />
        </div>

        {/* Actions */}
        <div className="hr-review-actions">
          <button className="hr-reject-btn" onClick={handleReject} type="button">
            <RotateCcw size={16} /> Send Back
          </button>
          <button className="hr-approve-btn" onClick={handleApprove} type="button">
            <CheckCircle2 size={16} /> Approve{isStageD ? ' & Complete' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
