import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, BookOpen, ShieldCheck, Users } from 'lucide-react';
import { WorkMasterList } from '../components/work-master/WorkMasterList';
import { HRAbcdVerification } from '../components/abcd/HRAbcdVerification';
import { HRReviewModal } from '../components/abcd/HRReviewModal';
import { HREmployeeProgress } from '../components/abcd/HREmployeeProgress';
import { abcdService } from '../modules/abcd/abcdService';
import { workMasterService } from '../modules/work-master/workMasterService';
import { assignmentService } from '../modules/assignment/assignmentService';
import { notificationService } from '../modules/notification/notificationService';
import '../styles/placeholders.css';
import '../styles/abcd.css';

const NAV_TABS = [
  { id: 'work-master', label: 'Work Master', icon: BookOpen },
  { id: 'abcd-verification', label: 'ABCD Verification', icon: ShieldCheck },
  { id: 'employee-progress', label: 'Employee Progress', icon: Users },
];

export const HRHome = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('work-master');
  const [refreshKey, setRefreshKey] = useState(0);
  const [reviewItem, setReviewItem] = useState(null);

  const works = workMasterService.getWorks();
  const pendingItems = abcdService.getPendingVerifications();
  const allProgress = abcdService.getAllProgress();
  const allAssignments = assignmentService.getAllAssignments();

  const handleReview = (item) => setReviewItem(item);
  const handleCloseReview = () => setReviewItem(null);

  const handleApprove = (assignmentId, stageKey, remarks, rating) => {
    abcdService.approveStage(assignmentId, stageKey, user?.userId || 'hr201', remarks, rating);

    // Find the employee to notify
    const record = abcdService.getAllProgress().find(r => r.assignmentId === assignmentId);
    if (record) {
      const work = works.find(w => w.id === record.workId);
      const isComplete = stageKey === 'D';
      notificationService.addNotification(record.employeeId,
        isComplete
          ? `🎉 Congratulations! Your work "${work?.name}" has been marked as COMPLETED.`
          : `Your ${stageKey} — ${stageKey === 'A' ? 'Learned' : stageKey === 'B' ? 'Practical' : stageKey === 'C' ? 'Can Perform' : 'Performance'} stage has been approved. Next stage is now available.`,
        isComplete ? 'success' : 'info'
      );
    }

    setReviewItem(null);
    setRefreshKey(k => k + 1);
  };

  const handleReject = (assignmentId, stageKey, remarks) => {
    abcdService.rejectStage(assignmentId, stageKey, user?.userId || 'hr201', remarks);

    const record = abcdService.getAllProgress().find(r => r.assignmentId === assignmentId);
    if (record) {
      notificationService.addNotification(record.employeeId,
        `HR has requested a revision for your ${stageKey} stage. Please review the feedback and resubmit.`,
        'warning'
      );
    }

    setReviewItem(null);
    setRefreshKey(k => k + 1);
  };

  // Find work for review item
  const reviewWork = reviewItem ? works.find(w => w.id === reviewItem.workId) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Zentra Floating Header */}
      <header className="app-header">
        <div className="header-brand">
          <JpmLogo size={32} variant="dark" />
          <div className="header-title">jpm <span>lms</span></div>
        </div>

        {/* Zentra Center Pill Navigation Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {NAV_TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            const pendingCount = tab.id === 'abcd-verification' ? pendingItems.length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  backgroundColor: isActive ? '#18181B' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#52525B',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 4px 12px rgba(24, 24, 27, 0.25)' : 'none',
                  transition: 'all 200ms ease',
                  position: 'relative'
                }}
              >
                <TabIcon size={16} color={isActive ? '#C5A059' : '#71717A'} />
                <span>{tab.label}</span>
                {pendingCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: '#DC2626', color: '#FFFFFF',
                    fontSize: '0.6rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{pendingCount}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="header-user-section">
          <div className="user-profile-summary">
            <div className="user-avatar" style={{ backgroundColor: '#18181B', color: '#C5A059' }}>
              {user?.avatarInitials || 'HR'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'HR Manager'}</span>
              <span className="user-role-badge badge-hr">HR Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign Out">
            <LogOut size={16} /><span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-container">
        {activeTab === 'work-master' && <WorkMasterList />}
        {activeTab === 'abcd-verification' && (
          <HRAbcdVerification
            key={refreshKey}
            pendingItems={pendingItems}
            works={works}
            onReview={handleReview}
          />
        )}
        {activeTab === 'employee-progress' && (
          <HREmployeeProgress
            key={refreshKey}
            employeeRecords={allProgress}
            works={works}
            assignments={allAssignments}
          />
        )}
      </main>

      {/* Review Modal */}
      <HRReviewModal
        isOpen={!!reviewItem}
        onClose={handleCloseReview}
        item={reviewItem}
        work={reviewWork}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
