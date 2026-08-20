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
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, RotateCcw, Briefcase, Search, Bell } from 'lucide-react';
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

  // ABCD state
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

  const handleSelectWork = (assignmentId) => setSelectedAssignmentId(assignmentId);
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
        <header className="app-header">
          <div className="header-brand">
            <JpmLogo size={32} />
            <div className="header-title">jpm <span>lms</span> &bull; Onboarding Journey</div>
          </div>
          <div className="header-user-section">
            <div className="user-profile-summary">
              <div className="user-avatar">{user?.avatarInitials || 'JD'}</div>
              <div className="user-info-text">
                <span className="user-name">{user?.name || 'Employee'}</span>
                <span className="user-role-badge badge-employee">Employee</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out"><LogOut size={16} /><span>Sign Out</span></button>
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

  // VIEW 4: Sense Employee Home — My Works + ABCD
  const selectedAssignment = selectedAssignmentId ? assignments.find(a => a.id === selectedAssignmentId) : null;
  const selectedWork = selectedAssignment ? works.find(w => w.id === selectedAssignment.workId) : null;
  const selectedAbcd = selectedAssignment ? abcdService.getProgress(selectedAssignment.id, empId, selectedAssignment.workId) : null;

  const firstName = (user?.name || 'Employee').split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sense Header Navbar */}
      <header className="app-header">
        <div className="header-brand">
          <JpmLogo size={32} />
          <div className="header-title">jpm <span>lms</span></div>
        </div>

        <div className="header-user-section">
          <button
            className="logout-btn"
            onClick={handleResetOnboarding}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            title="Re-test Onboarding Flow"
          >
            <RotateCcw size={15} /><span>Re-test Onboarding</span>
          </button>

          <div className="user-profile-summary">
            <div className="user-avatar">{user?.avatarInitials || 'EP'}</div>
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'Employee'}</span>
              <span className="user-role-badge badge-employee">Employee</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign Out"><LogOut size={16} /><span>Sign Out</span></button>
        </div>
      </header>

      <main className="dashboard-container">
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
            {/* Sense Hero Card ("Good Morning Andrew, What's on your mind?" style from reference image) */}
            <div 
              style={{
                background: 'var(--bg-surface)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-xl)',
                padding: '3rem 2.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="sense-orb" style={{ marginBottom: '1.25rem' }} />
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25, maxWidth: '640px' }}>
                Good Day <strong>{firstName}</strong>, what’s on your learning pathway?
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: '520px' }}>
                Track your assigned works, execute practical training, and complete your ABCD stage entitlement verifications.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase size={22} color="var(--text-main)" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Assigned Learning Pathways</h2>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px 16px', borderRadius: '9999px', border: '1px solid var(--border-glass)' }}>
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
          </>
        )}
      </main>
    </div>
  );
};
