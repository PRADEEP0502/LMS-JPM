import { STAGE_KEYS, STAGE_STATUS, OVERALL_STATUS, createAbcdRecord } from './abcdData';

const STORAGE_KEY = 'jpm_lms_abcd_progress';

/**
 * ABCD Service — manages A→B→C→D learning progress per assignment.
 * Sequential stage logic with HR verification.
 */
class AbcdService {
  _getAll() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('ABCD read error:', e);
    }
    return [];
  }

  _saveAll(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  /**
   * Get or create ABCD progress for an assignment
   */
  getProgress(assignmentId, employeeId, workId) {
    const all = this._getAll();
    let record = all.find(r => r.assignmentId === assignmentId);
    if (!record) {
      record = createAbcdRecord(assignmentId, employeeId, workId);
      all.push(record);
      this._saveAll(all);
    }
    return record;
  }

  /**
   * Employee submits a stage for HR verification
   */
  submitStage(assignmentId, stageKey, employeeNotes = '') {
    const all = this._getAll();
    const record = all.find(r => r.assignmentId === assignmentId);
    if (!record) return null;

    const stage = record.stages[stageKey];
    if (!stage) return null;
    if (stage.status !== STAGE_STATUS.CURRENT && stage.status !== STAGE_STATUS.NEEDS_REVISION) return null;

    stage.status = STAGE_STATUS.PENDING_HR_VERIFICATION;
    stage.submittedAt = new Date().toISOString();
    stage.employeeNotes = employeeNotes;
    record.overallStatus = OVERALL_STATUS.IN_PROGRESS;

    this._saveAll(all);
    return record;
  }

  /**
   * HR approves a stage
   */
  approveStage(assignmentId, stageKey, hrId, remarks = '', rating = null) {
    const all = this._getAll();
    const record = all.find(r => r.assignmentId === assignmentId);
    if (!record) return null;

    const stage = record.stages[stageKey];
    if (!stage || stage.status !== STAGE_STATUS.PENDING_HR_VERIFICATION) return null;

    stage.status = STAGE_STATUS.COMPLETED;
    stage.verifiedAt = new Date().toISOString();
    stage.verifiedBy = hrId;
    stage.remarks = remarks;
    if (rating !== null) stage.rating = rating;

    // Unlock next stage
    const currentIdx = STAGE_KEYS.indexOf(stageKey);
    if (currentIdx < STAGE_KEYS.length - 1) {
      const nextKey = STAGE_KEYS[currentIdx + 1];
      record.stages[nextKey].status = STAGE_STATUS.CURRENT;
    } else {
      // All stages completed
      record.overallStatus = OVERALL_STATUS.COMPLETED;
      record.completedAt = new Date().toISOString();
    }

    this._saveAll(all);
    return record;
  }

  /**
   * HR sends back a stage for revision
   */
  rejectStage(assignmentId, stageKey, hrId, remarks) {
    const all = this._getAll();
    const record = all.find(r => r.assignmentId === assignmentId);
    if (!record) return null;

    const stage = record.stages[stageKey];
    if (!stage || stage.status !== STAGE_STATUS.PENDING_HR_VERIFICATION) return null;

    stage.status = STAGE_STATUS.NEEDS_REVISION;
    stage.verifiedAt = new Date().toISOString();
    stage.verifiedBy = hrId;
    stage.remarks = remarks;

    this._saveAll(all);
    return record;
  }

  /**
   * Get all pending HR verification requests
   */
  getPendingVerifications() {
    const all = this._getAll();
    const pending = [];
    for (const record of all) {
      for (const key of STAGE_KEYS) {
        if (record.stages[key].status === STAGE_STATUS.PENDING_HR_VERIFICATION) {
          pending.push({
            abcdRecord: record,
            stageKey: key,
            stage: record.stages[key],
            assignmentId: record.assignmentId,
            employeeId: record.employeeId,
            workId: record.workId
          });
        }
      }
    }
    return pending;
  }

  /**
   * Get all ABCD progress records for an employee
   */
  getEmployeeProgress(employeeId) {
    return this._getAll().filter(r => r.employeeId === employeeId);
  }

  /**
   * Get all ABCD records (for HR overview)
   */
  getAllProgress() {
    return this._getAll();
  }

  /**
   * Calculate completion percentage for a record
   */
  getCompletionPercent(record) {
    if (!record) return 0;
    const completed = STAGE_KEYS.filter(k => record.stages[k].status === STAGE_STATUS.COMPLETED).length;
    return Math.round((completed / STAGE_KEYS.length) * 100);
  }

  /**
   * Get the current active stage key
   */
  getCurrentStage(record) {
    if (!record) return null;
    for (const key of STAGE_KEYS) {
      const s = record.stages[key].status;
      if (s === STAGE_STATUS.CURRENT || s === STAGE_STATUS.PENDING_HR_VERIFICATION || s === STAGE_STATUS.NEEDS_REVISION) {
        return key;
      }
    }
    return null;
  }
}

export const abcdService = new AbcdService();
