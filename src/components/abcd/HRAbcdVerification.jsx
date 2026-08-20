import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Eye } from 'lucide-react';
import { STAGE_META } from '../../modules/abcd/abcdData';
import '../../styles/abcd.css';

const EMP_NAMES = { 'emp101': 'John Doe', 'emp102': 'Pradeep Kumar' };
const EMP_DEPTS = { 'emp101': 'Corporate Operations', 'emp102': 'Data Entry' };
const EMP_INITIALS = { 'emp101': 'JD', 'emp102': 'PK' };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const HRAbcdVerification = ({ pendingItems, works, onReview }) => {
  return (
    <div className="hr-verification-page">
      <div className="hr-verif-header">
        <h1><ShieldCheck size={24} color="var(--jpm-gold)" /> ABCD Verification</h1>
        <p>Review and verify employee learning progress</p>
      </div>

      {(!pendingItems || pendingItems.length === 0) ? (
        <div className="hr-verif-empty">
          <CheckCircle2 size={40} color="var(--success-text)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--jpm-navy)', marginBottom: '0.25rem' }}>All Caught Up</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>All verifications are up to date. No pending reviews.</p>
        </div>
      ) : (
        <div className="hr-verif-list">
          {pendingItems.map((item, idx) => {
            const work = works.find(w => w.id === item.workId);
            const meta = STAGE_META[item.stageKey];
            const empName = EMP_NAMES[item.employeeId] || item.employeeId;
            const empDept = EMP_DEPTS[item.employeeId] || '';
            const empInit = EMP_INITIALS[item.employeeId] || empName.charAt(0);

            return (
              <div key={`${item.assignmentId}-${item.stageKey}-${idx}`} className="hr-verif-card">
                <div className="hr-verif-avatar">{empInit}</div>
                <div className="hr-verif-employee">
                  <h4>{empName}</h4>
                  <p>{empDept} · {work?.name || 'Work'}</p>
                </div>
                <span className="hr-verif-stage-badge">
                  <Clock size={14} /> {meta?.fullLabel || `Stage ${item.stageKey}`}
                </span>
                <div className="hr-verif-date">
                  {item.stage?.submittedAt ? formatDate(item.stage.submittedAt) : '—'}
                </div>
                <button className="hr-verif-review-btn" onClick={() => onReview(item)}>
                  <Eye size={15} /> Review
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
