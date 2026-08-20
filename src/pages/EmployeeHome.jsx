import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { onboardingService } from '../modules/onboarding/onboardingService';
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';
import { VisualJourneyTrack } from '../components/onboarding/VisualJourneyTrack';
import { StageDetailCard } from '../components/onboarding/StageDetailCard';
import { CompletionScreen } from '../components/onboarding/CompletionScreen';
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, BookOpen, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { MODULE_CATALOG } from '../data/mockUsers';
import '../styles/placeholders.css';
import '../styles/onboarding.css';

export const EmployeeHome = () => {
  const { user, logout } = useAuth();
  const empId = user?.userId || 'emp101';

  // Onboarding state management
  const [onboardingState, setOnboardingState] = useState(() =>
    onboardingService.getOnboardingState(empId)
  );

  const [selectedStageIndex, setSelectedStageIndex] = useState(
    onboardingState.currentStageIndex || 0
  );

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Sync selected stage index when currentStageIndex updates
  useEffect(() => {
    if (onboardingState.started && !onboardingState.isFinished) {
      setSelectedStageIndex(onboardingState.currentStageIndex);
    }
  }, [onboardingState.currentStageIndex, onboardingState.started, onboardingState.isFinished]);

  // Handler: Start Onboarding Journey from Welcome Screen
  const handleStartJourney = () => {
    const updated = onboardingService.startJourney(empId);
    setOnboardingState(updated);
    setSelectedStageIndex(updated.currentStageIndex || 0);
  };

  // Handler: Complete current stage
  const handleCompleteStage = (stageIdx) => {
    const updated = onboardingService.completeStage(empId, stageIdx);
    setOnboardingState(updated);
    if (updated.isFinished) {
      setShowCompletionModal(true);
    } else {
      setSelectedStageIndex(updated.currentStageIndex);
    }
  };

  // Handler: Finalize onboarding and proceed to Employee Home
  const handleFinishOnboarding = () => {
    onboardingService.markUserSessionCompleted(empId);
    setShowCompletionModal(false);
    setOnboardingState(prev => ({ ...prev, isFinished: true }));
  };

  // Handler: Reset onboarding for testing
  const handleResetOnboarding = () => {
    const resetState = onboardingService.resetOnboarding(empId);
    setOnboardingState(resetState);
    setSelectedStageIndex(0);
    setShowCompletionModal(false);
  };

  // VIEW 1: First-time Login Welcome Screen
  if (!user?.onboardingCompleted && !onboardingState.started && !onboardingState.isFinished) {
    return (
      <div className="onboarding-page">
        <WelcomeScreen
          userName={user?.name || 'John Doe'}
          onStartJourney={handleStartJourney}
        />
      </div>
    );
  }

  // VIEW 2: 100% Completion Screen
  if (showCompletionModal || (!user?.onboardingCompleted && onboardingState.isFinished && showCompletionModal)) {
    return (
      <div className="onboarding-page">
        <CompletionScreen
          userName={user?.name || 'John Doe'}
          completedAt={onboardingState.completedAt}
          onFinish={handleFinishOnboarding}
        />
      </div>
    );
  }

  // VIEW 3: Active Visual Journey Timeline in progress
  if (!user?.onboardingCompleted && onboardingState.started && !onboardingState.isFinished) {
    return (
      <div className="onboarding-page">
        {/* Header Bar */}
        <header className="app-header">
          <div className="header-brand">
            <JpmLogo size={32} variant="dark" />
            <div className="header-title">
              JPM <span>LMS</span> — Onboarding Journey
            </div>
          </div>

          <div className="header-user-section">
            <div className="user-profile-summary">
              <div className="user-avatar">{user?.avatarInitials || 'JD'}</div>
              <div className="user-info-text">
                <span className="user-name">{user?.name || 'Employee'}</span>
                <span className="user-role-badge badge-employee">Employee</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Journey Content */}
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

  // VIEW 4: Completed Onboarding -> Standard Employee Home Portal
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="app-header">
        <div className="header-brand">
          <JpmLogo size={32} variant="dark" />
          <div className="header-title">
            JPM <span>LMS</span>
          </div>
        </div>

        <div className="header-user-section">
          <div className="user-profile-summary">
            <div className="user-avatar">{user?.avatarInitials || 'EP'}</div>
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'Employee'}</span>
              <span className="user-role-badge badge-employee">Employee</span>
            </div>
          </div>

          {/* Test Action: Re-trigger Onboarding */}
          <button
            className="logout-btn"
            onClick={handleResetOnboarding}
            style={{ backgroundColor: 'rgba(197, 160, 89, 0.15)', borderColor: 'var(--jpm-gold)', color: 'var(--jpm-gold)' }}
            title="Re-test Onboarding Flow"
          >
            <RotateCcw size={15} />
            <span>Re-test Onboarding</span>
          </button>

          <button className="logout-btn" onClick={logout} title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="dashboard-container">
        {/* Step 2 Completion Status Banner */}
        <div className="step-status-banner">
          <CheckCircle2 size={24} className="banner-icon" />
          <div className="banner-content">
            <h3>STEP 2 COMPLETED — Employee Onboarding Journey Verified</h3>
            <p>
              Logged in as <strong>{user?.name}</strong> ({user?.title} - {user?.department}). 
              Your 5-stage onboarding sequence is 100% complete and verified. Work assignment and training modules remain modular placeholders for Step 3+.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--jpm-navy)' }}>
          Learning Portal Overview
        </h2>

        <div className="placeholder-grid">
          {MODULE_CATALOG.filter(m => m.roleAccess.includes('EMPLOYEE')).map(mod => (
            <div key={mod.id} className="placeholder-card">
              <div className="card-header">
                <div className="card-icon">
                  <BookOpen size={20} />
                </div>
                <h4 className="card-title">{mod.title}</h4>
              </div>
              <p className="card-desc">{mod.description}</p>
              <span className="card-status-tag">Step 3+ Placeholder</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
