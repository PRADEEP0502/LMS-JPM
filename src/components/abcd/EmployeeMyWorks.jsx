import React from 'react';
import { BookOpen, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { STAGE_KEYS, STAGE_STATUS } from '../../modules/abcd/abcdData';
import { WORK_LEVELS } from '../../modules/work-master/workMasterData';
import '../../styles/abcd.css';

export const EmployeeMyWorks = ({ assignments, works, abcdRecords, onSelectWork }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-md)' }}>
        <BookOpen size={44} color="var(--text-muted)" style={{ marginBottom: '0.85rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>No Works Assigned</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your assigned works will appear here once HR assigns them to you.</p>
      </div>
    );
  }

  const bannerClasses = ['sense-banner-1', 'sense-banner-2', 'sense-banner-3', 'sense-banner-4'];

  return (
    <div className="emp-works-grid">
      {assignments.map((assign, idx) => {
        const work = works.find(w => w.id === assign.workId);
        const abcd = abcdRecords.find(r => r.assignmentId === assign.id);
        if (!work) return null;

        const levelInfo = WORK_LEVELS.find(l => l.id === work.level) || { label: work.level, badgeColor: '#0A2240' };
        const completedCount = abcd ? STAGE_KEYS.filter(k => abcd.stages[k]?.status === STAGE_STATUS.COMPLETED).length : 0;
        const percent = Math.round((completedCount / STAGE_KEYS.length) * 100);
        const isCompleted = abcd?.overallStatus === 'COMPLETED';
        const bannerCls = bannerClasses[idx % bannerClasses.length];

        return (
          <div key={assign.id} className="emp-work-card" onClick={() => onSelectWork(assign.id)}>
            {/* Sense Fluid Gradient Banner Header (Meditate / Music / Move style) */}
            <div className={`sense-card-banner ${bannerCls}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'rgba(255,255,255,0.25)', padding: '3px 12px', borderRadius: '9999px', backdropFilter: 'blur(8px)' }}>
                  {work.department}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={18} color="#FFFFFF" />
                </div>
              </div>
              <h3 className="sense-banner-title">{work.name}</h3>
            </div>

            {/* Sense Glass Card Body */}
            <div className="sense-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="work-level-badge" style={{ backgroundColor: levelInfo.badgeColor }}>{work.level}</span>
                {isCompleted && (
                  <span className="abcd-status-badge badge-completed" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 10px' }}>
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {work.shortDescription}
              </p>

              {/* Mini ABCD Track */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
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
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{percent}%</span>
              </div>

              {/* Progress bar */}
              <div className="emp-progress-bar-track">
                <div className="emp-progress-bar-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
