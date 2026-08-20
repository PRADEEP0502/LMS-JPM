import React from 'react';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { STAGE_KEYS, STAGE_STATUS } from '../../modules/abcd/abcdData';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';
import '../../styles/abcd.css';

export const EmployeeMyWorks = ({ assignments, works, abcdRecords, onSelectWork }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--bg-warm)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-light)' }}>
        <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', color: 'var(--jpm-navy)', marginBottom: '0.25rem' }}>No Works Assigned</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Your assigned works will appear here once HR assigns them to you.</p>
      </div>
    );
  }

  return (
    <div className="emp-works-grid">
      {assignments.map(assign => {
        const work = works.find(w => w.id === assign.workId);
        const abcd = abcdRecords.find(r => r.assignmentId === assign.id);
        if (!work) return null;

        const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: '#0A2240' };
        const completedCount = abcd ? STAGE_KEYS.filter(k => abcd.stages[k]?.status === STAGE_STATUS.COMPLETED).length : 0;
        const percent = Math.round((completedCount / STAGE_KEYS.length) * 100);
        const isCompleted = abcd?.overallStatus === 'COMPLETED';

        return (
          <div key={assign.id} className="emp-work-card" onClick={() => onSelectWork(assign.id)}>
            <div className="emp-work-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <span className="work-dept-badge">{work.department}</span>
                <span className="work-level-badge" style={{ backgroundColor: levelInfo.badgeColor }}>{work.level}</span>
                {isCompleted && (
                  <span className="abcd-status-badge badge-completed" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 8px' }}>
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>
              <h3>{work.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{work.shortDescription}</p>
            </div>

            {/* Mini ABCD Track */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="mini-abcd-track">
                {STAGE_KEYS.map((k, i) => {
                  const s = abcd?.stages[k]?.status || STAGE_STATUS.LOCKED;
                  let cls = '';
                  if (s === STAGE_STATUS.COMPLETED) cls = 'completed';
                  else if (s === STAGE_STATUS.CURRENT) cls = 'current';
                  else if (s === STAGE_STATUS.PENDING_HR_VERIFICATION) cls = 'pending';
                  else if (s === STAGE_STATUS.NEEDS_REVISION) cls = 'revision';

                  return (
                    <React.Fragment key={k}>
                      <div className={`mini-abcd-node ${cls}`}>
                        {s === STAGE_STATUS.COMPLETED ? '✓' : k}
                      </div>
                      {i < 3 && <div className={`mini-abcd-connector ${s === STAGE_STATUS.COMPLETED ? 'filled' : ''}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-navy)' }}>{percent}%</span>
            </div>

            {/* Progress bar */}
            <div className="emp-progress-bar-track">
              <div className="emp-progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'var(--jpm-gold-hover)', fontSize: '0.8rem', fontWeight: 600, gap: '4px' }}>
              <span>View Details</span>
              <ChevronRight size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
