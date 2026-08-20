import React from 'react';
import { Users, CheckCircle2 } from 'lucide-react';
import { STAGE_KEYS, STAGE_STATUS } from '../../modules/abcd/abcdData';
import { abcdService } from '../../modules/abcd/abcdService';
import '../../styles/abcd.css';

const EMP_NAMES = { 'emp101': 'John Doe', 'emp102': 'Pradeep Kumar' };
const EMP_DEPTS = { 'emp101': 'Corporate Operations', 'emp102': 'Data Entry' };
const EMP_INITIALS = { 'emp101': 'JD', 'emp102': 'PK' };

export const HREmployeeProgress = ({ employeeRecords, works, assignments }) => {
  // Group by employeeId
  const grouped = {};
  (employeeRecords || []).forEach(record => {
    if (!grouped[record.employeeId]) grouped[record.employeeId] = [];
    grouped[record.employeeId].push(record);
  });

  const employeeIds = Object.keys(grouped);

  if (employeeIds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--jpm-bg)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--jpm-border-dark)' }}>
        <Users size={40} color="var(--jpm-muted)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', color: 'var(--jpm-text)', marginBottom: '0.25rem' }}>No Employee Progress</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--jpm-text-secondary)' }}>Employee ABCD progress will appear here once works are assigned.</p>
      </div>
    );
  }

  return (
    <div className="hr-progress-page">
      {employeeIds.map(empId => {
        const records = grouped[empId];
        const empName = EMP_NAMES[empId] || empId;
        const empDept = EMP_DEPTS[empId] || '';
        const empInit = EMP_INITIALS[empId] || empName.charAt(0);

        // Overall progress across all works
        const totalStages = records.length * STAGE_KEYS.length;
        const completedStages = records.reduce((sum, r) => {
          return sum + STAGE_KEYS.filter(k => r.stages[k]?.status === STAGE_STATUS.COMPLETED).length;
        }, 0);
        const overallPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

        return (
          <div key={empId} className="hr-progress-employee-card">
            <div className="hr-progress-employee-header">
              <div className="hr-verif-avatar">{empInit}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--jpm-text)', fontSize: '1.1rem' }}>{empName}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--jpm-text-secondary)' }}>{empDept}</div>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--jpm-primary)' }}>{overallPercent}%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {records.map(record => {
                const work = works.find(w => w.id === record.workId);
                const percent = abcdService.getCompletionPercent(record);

                return (
                  <div key={record.id} className="hr-progress-work-row">
                    <span className="hr-progress-work-name">{work?.name || 'Work'}</span>
                    <div className="hr-progress-mini-track" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: 'row' }}>
                      {STAGE_KEYS.map(k => {
                        const s = record.stages[k]?.status || STAGE_STATUS.LOCKED;
                        let cls = '';
                        if (s === STAGE_STATUS.COMPLETED) cls = 'completed';
                        else if (s === STAGE_STATUS.CURRENT) cls = 'current';
                        else if (s === STAGE_STATUS.PENDING_HR_VERIFICATION) cls = 'pending';
                        else if (s === STAGE_STATUS.NEEDS_REVISION) cls = 'revision';

                        return (
                          <div key={k} className={`mini-abcd-node ${cls}`} style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                            {s === STAGE_STATUS.COMPLETED ? '✓' : k}
                          </div>
                        );
                      })}
                    </div>
                    <span className="hr-progress-percent">{percent}%</span>
                  </div>
                );
              })}
            </div>

            {/* Overall progress bar */}
            <div style={{ marginTop: '0.5rem' }}>
              <div className="emp-progress-bar-track">
                <div className="emp-progress-bar-fill" style={{ width: `${overallPercent}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
