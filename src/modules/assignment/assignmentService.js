import { INITIAL_ASSIGNMENTS } from './assignmentData';

const STORAGE_KEY = 'jpm_lms_assignments';

/**
 * Assignment Service — manages work-to-employee assignments in localStorage.
 * Ready for future backend/API replacement.
 */
class AssignmentService {
  _generateId() {
    return `assign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  getAssignments() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Assignment read error:', e);
    }
    this._save(INITIAL_ASSIGNMENTS);
    return [...INITIAL_ASSIGNMENTS];
  }

  _save(assignments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }

  getAssignmentsByEmployee(employeeId) {
    return this.getAssignments().filter(a => a.employeeId === employeeId && a.status === 'ACTIVE');
  }

  getAssignment(assignmentId) {
    return this.getAssignments().find(a => a.id === assignmentId) || null;
  }

  assignWork(employeeId, workId, assignedBy) {
    const assignments = this.getAssignments();
    const exists = assignments.find(a => a.employeeId === employeeId && a.workId === workId && a.status === 'ACTIVE');
    if (exists) return exists;

    const newAssignment = {
      id: this._generateId(),
      employeeId,
      workId,
      assignedBy,
      assignedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    assignments.push(newAssignment);
    this._save(assignments);
    return newAssignment;
  }

  getAllAssignments() {
    return this.getAssignments();
  }
}

export const assignmentService = new AssignmentService();
