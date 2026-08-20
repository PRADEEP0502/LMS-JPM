import { INITIAL_ONBOARDING_STAGES } from './onboardingData';

const STORAGE_PREFIX = 'jpm_lms_onboarding_';

class OnboardingService {
  getStorageKey(empId) {
    return `${STORAGE_PREFIX}${empId ? empId.toLowerCase() : 'default'}`;
  }

  /**
   * Get employee onboarding state
   * @param {string} empId 
   */
  getOnboardingState(empId) {
    const key = this.getStorageKey(empId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading onboarding state:', err);
    }

    // Default initial state for first-time employee
    return {
      started: false,
      currentStageIndex: 0,
      completedStageIds: [],
      isFinished: false,
      completedAt: null
    };
  }

  /**
   * Save onboarding state
   */
  saveOnboardingState(empId, state) {
    const key = this.getStorageKey(empId);
    localStorage.setItem(key, JSON.stringify(state));
  }

  /**
   * Start onboarding journey
   */
  startJourney(empId) {
    const state = this.getOnboardingState(empId);
    const updated = {
      ...state,
      started: true,
      currentStageIndex: state.currentStageIndex || 0
    };
    this.saveOnboardingState(empId, updated);
    return updated;
  }

  /**
   * Complete the current stage and advance to the next
   */
  completeStage(empId, stageIndex) {
    const state = this.getOnboardingState(empId);
    const targetStage = INITIAL_ONBOARDING_STAGES[stageIndex];
    if (!targetStage) return state;

    const completedSet = new Set(state.completedStageIds || []);
    completedSet.add(targetStage.id);

    const isLastStage = stageIndex >= INITIAL_ONBOARDING_STAGES.length - 1;
    const nextIndex = isLastStage ? stageIndex : stageIndex + 1;

    const updated = {
      ...state,
      currentStageIndex: nextIndex,
      completedStageIds: Array.from(completedSet),
      isFinished: isLastStage || completedSet.size >= INITIAL_ONBOARDING_STAGES.length,
      completedAt: isLastStage ? new Date().toISOString() : state.completedAt
    };

    this.saveOnboardingState(empId, updated);

    // Also update main user session if finished
    if (updated.isFinished) {
      this.markUserSessionCompleted(empId);
    }

    return updated;
  }

  /**
   * Mark main user session as onboarding completed
   */
  markUserSessionCompleted(empId) {
    try {
      const userSession = localStorage.getItem('jpm_lms_user_session');
      if (userSession) {
        const parsed = JSON.parse(userSession);
        if (parsed.userId.toLowerCase() === empId.toLowerCase()) {
          parsed.onboardingCompleted = true;
          localStorage.setItem('jpm_lms_user_session', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error('Error updating user session completion state:', e);
    }
  }

  /**
   * Reset onboarding for testing
   */
  resetOnboarding(empId) {
    const key = this.getStorageKey(empId);
    localStorage.removeItem(key);
    try {
      const userSession = localStorage.getItem('jpm_lms_user_session');
      if (userSession) {
        const parsed = JSON.parse(userSession);
        if (parsed.userId.toLowerCase() === empId.toLowerCase()) {
          parsed.onboardingCompleted = false;
          localStorage.setItem('jpm_lms_user_session', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error('Error resetting user session:', e);
    }
    return this.getOnboardingState(empId);
  }
}

export const onboardingService = new OnboardingService();
