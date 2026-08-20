import React, { useState } from 'react';
import { BookOpen, Hammer, UserCheck, Award, CheckCircle2, Lock, AlertCircle, Send, Video, FileText, Layers, Clock } from 'lucide-react';
import { STAGE_META, STAGE_STATUS } from '../../modules/abcd/abcdData';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const AbcdStageDetail = ({ stageKey, stageData, workData, onSubmit, abcdRecord }) => {
  const [employeeNotes, setEmployeeNotes] = useState('');
  const meta = STAGE_META[stageKey];
  const status = stageData?.status || STAGE_STATUS.LOCKED;

  if (!meta) return null;

  // LOCKED state
  if (status === STAGE_STATUS.LOCKED) {
    return (
      <div className="abcd-stage-detail">
        <div className="abcd-detail-header">
          <div className="abcd-detail-icon"><Lock size={22} /></div>
          <div>
            <h3 className="abcd-detail-title">{meta.fullLabel}</h3>
            <p className="abcd-detail-desc">{meta.description}</p>
          </div>
        </div>
        <div className="abcd-locked-message">
          <Lock size={24} />
          <span>This stage is locked. Complete the previous stage to unlock.</span>
        </div>
      </div>
    );
  }

  // COMPLETED state
  if (status === STAGE_STATUS.COMPLETED) {
    return (
      <div className="abcd-stage-detail">
        <div className="abcd-detail-header">
          <div className="abcd-detail-icon" style={{ backgroundColor: 'var(--success-text)' }}><CheckCircle2 size={22} /></div>
          <div>
            <h3 className="abcd-detail-title">{meta.fullLabel}</h3>
            <p className="abcd-detail-desc">{meta.description}</p>
          </div>
          <span className="abcd-status-badge badge-completed" style={{ marginLeft: 'auto' }}><CheckCircle2 size={14} /> Completed</span>
        </div>
        <div className="abcd-completed-info">
          <p><strong>Verified:</strong> {formatDate(stageData.verifiedAt)}</p>
          {stageData.remarks && <p><strong>HR Remarks:</strong> {stageData.remarks}</p>}
          {stageData.rating && <p><strong>Rating:</strong> {stageData.rating}/5</p>}
        </div>
      </div>
    );
  }

  // PENDING_HR_VERIFICATION state
  if (status === STAGE_STATUS.PENDING_HR_VERIFICATION) {
    return (
      <div className="abcd-stage-detail">
        <div className="abcd-detail-header">
          <div className="abcd-detail-icon" style={{ backgroundColor: '#F59E0B' }}><Clock size={22} /></div>
          <div>
            <h3 className="abcd-detail-title">{meta.fullLabel}</h3>
            <p className="abcd-detail-desc">{meta.description}</p>
          </div>
          <span className="abcd-status-badge badge-pending" style={{ marginLeft: 'auto' }}><Clock size={14} /> Awaiting HR Review</span>
        </div>
        <div className="abcd-resource-card">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Your submission is being reviewed by HR. You will be notified once the review is complete.
          </p>
          {stageData.submittedAt && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Submitted: {formatDate(stageData.submittedAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // NEEDS_REVISION or CURRENT — show full content
  const showRevision = status === STAGE_STATUS.NEEDS_REVISION;

  const handleSubmit = () => {
    onSubmit(stageKey, employeeNotes);
    setEmployeeNotes('');
  };

  return (
    <div className="abcd-stage-detail">
      <div className="abcd-detail-header">
        <div className="abcd-detail-icon"><Award size={22} /></div>
        <div>
          <h3 className="abcd-detail-title">{meta.fullLabel}</h3>
          <p className="abcd-detail-desc">{meta.description}</p>
        </div>
        {showRevision && (
          <span className="abcd-status-badge badge-revision" style={{ marginLeft: 'auto' }}><AlertCircle size={14} /> Needs Revision</span>
        )}
      </div>

      {/* Revision remarks */}
      {showRevision && stageData.remarks && (
        <div className="abcd-revision-card">
          <h4><AlertCircle size={16} /> HR Feedback</h4>
          <p>{stageData.remarks}</p>
        </div>
      )}

      <div className="abcd-detail-body">
        {/* Stage A — Learning resources */}
        {stageKey === 'A' && workData && (
          <>
            {workData.trainingVideo && (
              <div className="abcd-resource-card">
                <div className="abcd-resource-title"><Video size={16} /> Training Video</div>
                <div style={{ backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <video controls style={{ width: '100%', maxHeight: '300px', display: 'block' }} src={workData.trainingVideo.url}>
                    Your browser does not support video.
                  </video>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {workData.trainingVideo.name} · {workData.trainingVideo.duration}
                </p>
              </div>
            )}

            {workData.documents?.length > 0 && (
              <div className="abcd-resource-card">
                <div className="abcd-resource-title"><FileText size={16} /> SOP & Documents</div>
                {workData.documents.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <FileText size={16} color="var(--jpm-navy)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--jpm-navy)' }}>{doc.name}</span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{doc.type} · {doc.size}</span>
                  </div>
                ))}
              </div>
            )}

            {workData.learningPoints?.length > 0 && (
              <div className="abcd-resource-card">
                <div className="abcd-resource-title"><CheckCircle2 size={16} /> What You Will Learn</div>
                {workData.learningPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0.35rem 0' }}>
                    <CheckCircle2 size={16} color="var(--jpm-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stage B — Practical info */}
        {stageKey === 'B' && workData?.practical && (
          <div className="abcd-resource-card">
            <div className="abcd-resource-title"><Layers size={16} /> Practical Training</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Duration</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jpm-navy)' }}>{workData.practical.durationDays} Days</div>
              </div>
              {workData.practical.accuracyTarget && (
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Accuracy Target</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jpm-navy)' }}>{workData.practical.accuracyTarget}</div>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.5 }}>
              <strong>Instructions:</strong> {workData.practical.instructions}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              <strong>Expected Outcome:</strong> {workData.practical.expectedOutcome}
            </p>
          </div>
        )}

        {/* Stage C — Can Perform confirmation */}
        {stageKey === 'C' && (
          <div className="abcd-resource-card">
            <div className="abcd-resource-title"><UserCheck size={16} /> Capability Confirmation</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Provide any notes or evidence confirming your ability to independently perform this work.
            </p>
            <textarea
              className="hr-review-textarea"
              rows={3}
              placeholder="Optional: Add notes, evidence references, or completion statement..."
              value={employeeNotes}
              onChange={e => setEmployeeNotes(e.target.value)}
            />
          </div>
        )}

        {/* Stage D — Final submission */}
        {stageKey === 'D' && (
          <div className="abcd-resource-card">
            <div className="abcd-resource-title"><Award size={16} /> Final Performance Submission</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Submit for final HR performance evaluation. Your complete ABCD journey will be reviewed.
            </p>
            <textarea
              className="hr-review-textarea"
              rows={3}
              placeholder="Optional: Add notes about your overall learning experience..."
              value={employeeNotes}
              onChange={e => setEmployeeNotes(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Submit action */}
      <div className="abcd-action-bar">
        <button className="abcd-submit-btn" onClick={handleSubmit}>
          <Send size={16} />
          <span>{showRevision ? 'Resubmit for HR Verification' : 'Submit for HR Verification'}</span>
        </button>
      </div>
    </div>
  );
};
