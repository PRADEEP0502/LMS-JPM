import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { onboardingService } from '../modules/onboarding/onboardingService';
import { assignmentService } from '../modules/assignment/assignmentService';
import { workMasterService } from '../modules/work-master/workMasterService';
import { abcdService } from '../modules/abcd/abcdService';
import { notificationService } from '../modules/notification/notificationService';
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';
import { VisualJourneyTrack } from '../components/onboarding/VisualJourneyTrack';
import { StageDetailCard } from '../components/onboarding/StageDetailCard';
import { CompletionScreen } from '../components/onboarding/CompletionScreen';
import { EmployeeMyWorks } from '../components/abcd/EmployeeMyWorks';
import { EmployeeWorkDetail } from '../components/abcd/EmployeeWorkDetail';
import { NotificationBanner } from '../components/common/NotificationBanner';
import { Sidebar } from '../components/common/Sidebar';
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, RotateCcw, Briefcase, Bell, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';
import '../styles/placeholders.css';
import '../styles/onboarding.css';
import '../styles/abcd.css';

export const EmployeeHome = () => {
  const { user, logout } = useAuth();
  const empId = user?.userId || 'emp101';

  // Onboarding state
  const [onboardingState, setOnboardingState] = useState(() =>
    onboardingService.getOnboardingState(empId)
  );
  const [selectedStageIndex, setSelectedStageIndex] = useState(onboardingState.currentStageIndex || 0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Navigation & ABCD state
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notifKey, setNotifKey] = useState(0);

  // Data loaders
  const assignments = assignmentService.getAssignmentsByEmployee(empId);
  const works = workMasterService.getWorks();
  const abcdRecords = assignments.map(a => abcdService.getProgress(a.id, empId, a.workId));

  // Sync onboarding stage index
  useEffect(() => {
    if (onboardingState.started && !onboardingState.isFinished) {
      setSelectedStageIndex(onboardingState.currentStageIndex);
    }
  }, [onboardingState.currentStageIndex, onboardingState.started, onboardingState.isFinished]);

  // Onboarding handlers
  const handleStartJourney = () => {
    const updated = onboardingService.startJourney(empId);
    setOnboardingState(updated);
    setSelectedStageIndex(updated.currentStageIndex || 0);
  };

  const handleCompleteStage = (stageIdx) => {
    const updated = onboardingService.completeStage(empId, stageIdx);
    setOnboardingState(updated);
    if (updated.isFinished) setShowCompletionModal(true);
    else setSelectedStageIndex(updated.currentStageIndex);
  };

  const handleFinishOnboarding = () => {
    onboardingService.markUserSessionCompleted(empId);
    setShowCompletionModal(false);
    setOnboardingState(prev => ({ ...prev, isFinished: true }));
  };

  const handleResetOnboarding = () => {
    const resetState = onboardingService.resetOnboarding(empId);
    setOnboardingState(resetState);
    setSelectedStageIndex(0);
    setShowCompletionModal(false);
  };

  // ABCD handlers
  const handleSubmitStage = (assignmentId, stageKey, notes) => {
    abcdService.submitStage(assignmentId, stageKey, notes);
    notificationService.addNotification(empId,
      `Stage ${stageKey} submitted for HR verification.`, 'info');
    setRefreshKey(k => k + 1);
    setNotifKey(k => k + 1);
  };

  const handleSelectWork = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setActiveSidebarTab('my-works');
  };
  const handleBackToWorks = () => setSelectedAssignmentId(null);

  // VIEW 1: Welcome Screen
  if (!user?.onboardingCompleted && !onboardingState.started && !onboardingState.isFinished) {
    return (
      <div className="onboarding-page">
        <WelcomeScreen userName={user?.name || 'John Doe'} onStartJourney={handleStartJourney} />
      </div>
    );
  }

  // VIEW 2: Completion Modal
  if (showCompletionModal) {
    return (
      <div className="onboarding-page">
        <CompletionScreen userName={user?.name || 'John Doe'} completedAt={onboardingState.completedAt} onFinish={handleFinishOnboarding} />
      </div>
    );
  }

  // VIEW 3: Onboarding Journey
  if (!user?.onboardingCompleted && onboardingState.started && !onboardingState.isFinished) {
    return (
      <div className="onboarding-page">
        <header className="jpm-topbar" style={{ margin: '1.5rem 2.5rem 0 2.5rem' }}>
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <JpmLogo size={32} />
            <span>JPM LMS &bull; Onboarding Journey</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user-pill">
              <div className="topbar-avatar">{user?.avatarInitials || 'JD'}</div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name || 'Employee'}</span>
                <span className="topbar-user-sub">Employee</span>
              </div>
            </div>
            <button className="topbar-icon-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </header>
        <main className="journey-main-layout">
          <VisualJourneyTrack
            currentStageIndex={onboardingState.currentStageIndex}
            completedStageIds={onboardingState.completedStageIds}
            selectedStageIndex={selectedStageIndex}
            onSelectStage={(idx) => setSelectedStageIndex(idx)}
          />
          <StageDetailCard
            stageIndex={selectedStageIndex}
            isCompleted={onboardingState.completedStageIds.includes(
              `step-${selectedStageIndex + 1}-${['profile', 'intro', 'learning', 'work', 'complete'][selectedStageIndex]}`
            )}
            isCurrent={selectedStageIndex === onboardingState.currentStageIndex}
            onCompleteStage={handleCompleteStage}
          />
        </main>
      </div>
    );
  }

  // VIEW 4: Soft Glass Employee Home — Sidebar + Topbar + Composition
  const selectedAssignment = selectedAssignmentId ? assignments.find(a => a.id === selectedAssignmentId) : null;
  const selectedWork = selectedAssignment ? works.find(w => w.id === selectedAssignment.workId) : null;
  const selectedAbcd = selectedAssignment ? abcdService.getProgress(selectedAssignment.id, empId, selectedAssignment.workId) : null;

  // Active work for "Current Work" panel
  const currentAssignment = assignments[0];
  const currentWorkItem = currentAssignment ? works.find(w => w.id === currentAssignment.workId) : null;

  const firstName = (user?.name || 'Pradeep').split(' ')[0];

  return (
    <div className="app-layout-container">
      {/* Soft Floating Sidebar */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={(tabId) => {
          setActiveSidebarTab(tabId);
          if (tabId === 'dashboard') setSelectedAssignmentId(null);
        }}
        role="EMPLOYEE"
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {/* Minimal Floating Top Bar */}
        <header className="jpm-topbar">
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <JpmLogo size={32} showText={true} />
          </div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Re-test Onboarding" onClick={handleResetOnboarding}>
              <RotateCcw size={16} />
            </button>
            <button className="topbar-icon-btn" title="Notifications" onClick={() => alert('All notifications up to date.')}>
              <Bell size={16} />
            </button>
            <div className="topbar-user-pill">
              <div className="topbar-avatar">{user?.avatarInitials || 'JD'}</div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name || 'Pradeep Kumar'}</span>
                <span className="topbar-user-sub">{user?.department || 'Data Entry Specialist'}</span>
              </div>
            </div>
          </div>
        </header>

        <NotificationBanner key={notifKey} userId={empId} onDismiss={() => setNotifKey(k => k + 1)} />

        {selectedAssignment && selectedWork && selectedAbcd ? (
          <EmployeeWorkDetail
            key={refreshKey}
            assignment={selectedAssignment}
            work={selectedWork}
            abcdRecord={selectedAbcd}
            onBack={handleBackToWorks}
            onSubmitStage={handleSubmitStage}
            onRefresh={() => setRefreshKey(k => k + 1)}
          />
        ) : (
          <>
            {/* Greeting Header */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--jpm-text)', letterSpacing: '-0.02em' }}>
                Good Morning, {firstName} 👋
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--jpm-text-secondary)', marginTop: '4px' }}>
                Continue your JPM learning journey
              </p>
            </div>

            {/* Current Work Featured Panel (Requirement #11) */}
            {currentWorkItem && (
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div className="jpm-badge-purple" style={{ marginBottom: '0.65rem', display: 'inline-block' }}>CURRENT WORK</div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jpm-text)', marginBottom: '0.35rem' }}>
                    {currentWorkItem.name}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--jpm-text-secondary)', maxWidth: '520px', lineHeight: 1.5 }}>
                    {currentWorkItem.shortDescription}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                    {currentWorkItem.trainingVideo && (
                      <span className="jpm-badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={14} /> Training Video
                      </span>
                    )}
                    {currentWorkItem.documents?.length > 0 && (
                      <span className="jpm-badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} /> {currentWorkItem.documents.length} SOPs
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  className="submit-btn" 
                  style={{ width: 'auto', padding: '0.85rem 1.85rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => handleSelectWork(currentAssignment.id)}
                >
                  <span>Continue Learning</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* My Works Pathways Composition */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={20} color="var(--jpm-primary)" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--jpm-text)' }}>My Learning Pathways</h2>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-text-secondary)' }}>
                  {assignments.length} Active Works
                </span>
              </div>

              <EmployeeMyWorks
                key={refreshKey}
                assignments={assignments}
                works={works}
                abcdRecords={abcdRecords}
                onSelectWork={handleSelectWork}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
