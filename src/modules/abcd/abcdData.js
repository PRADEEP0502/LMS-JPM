/**
 * ABCD Stage Metadata & Constants
 */

export const STAGE_KEYS = ['A', 'B', 'C', 'D'];

export const STAGE_STATUS = {
  LOCKED: 'LOCKED',
  CURRENT: 'CURRENT',
  PENDING_HR_VERIFICATION: 'PENDING_HR_VERIFICATION',
  COMPLETED: 'COMPLETED',
  NEEDS_REVISION: 'NEEDS_REVISION'
};

export const OVERALL_STATUS = {
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export const STAGE_META = {
  A: {
    key: 'A',
    label: 'Learned',
    fullLabel: 'A — Learned',
    description: 'Understand the work before starting practical training.',
    instruction: 'Watch the training video, read the SOP, and review all learning points.',
    icon: 'BookOpen',
    color: '#0A2240'
  },
  B: {
    key: 'B',
    label: 'Practical',
    fullLabel: 'B — Practical',
    description: 'Now perform the work in practice under supervision.',
    instruction: 'Complete the practical duration and tasks as described in the work instructions.',
    icon: 'Hammer',
    color: '#8B5CF6'
  },
  C: {
    key: 'C',
    label: 'Can Perform',
    fullLabel: 'C — Can Perform',
    description: 'Demonstrate that you can perform this work independently.',
    instruction: 'Submit confirmation that you can perform the work without supervision.',
    icon: 'UserCheck',
    color: '#D97706'
  },
  D: {
    key: 'D',
    label: 'Performance',
    fullLabel: 'D — Performance',
    description: 'Complete the final performance evaluation.',
    instruction: 'Submit for final HR performance review and rating.',
    icon: 'Award',
    color: '#059669'
  }
};

/**
 * Create a fresh ABCD progress record
 */
export function createAbcdRecord(assignmentId, employeeId, workId) {
  return {
    id: `abcd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    assignmentId,
    employeeId,
    workId,
    stages: {
      A: { status: STAGE_STATUS.CURRENT, submittedAt: null, verifiedAt: null, verifiedBy: null, remarks: '', employeeNotes: '' },
      B: { status: STAGE_STATUS.LOCKED, submittedAt: null, verifiedAt: null, verifiedBy: null, remarks: '', employeeNotes: '' },
      C: { status: STAGE_STATUS.LOCKED, submittedAt: null, verifiedAt: null, verifiedBy: null, remarks: '', employeeNotes: '' },
      D: { status: STAGE_STATUS.LOCKED, submittedAt: null, verifiedAt: null, verifiedBy: null, remarks: '', employeeNotes: '', rating: null }
    },
    overallStatus: OVERALL_STATUS.IN_PROGRESS,
    completedAt: null
  };
}
