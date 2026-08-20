import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { LogOut, BookOpen, ShieldCheck, Users, Bell } from 'lucide-react';
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
    <div className="app-layout-container">
      {/* Soft Floating Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        role="HR"
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {/* Minimal Floating Top Bar */}
        <header className="jpm-topbar">
          <div className="topbar-left">JPM LMS HR Administration</div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Notifications" onClick={() => alert('HR Notifications up to date.')}>
              <Bell size={16} />
            </button>
            <div className="topbar-user-pill">
              <div className="topbar-avatar" style={{ backgroundColor: '#DB2777' }}>
                {user?.avatarInitials || 'SJ'}
              </div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name || 'Sarah Jenkins'}</span>
                <span className="topbar-user-sub">HR Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs */}
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
