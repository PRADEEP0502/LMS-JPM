import { INITIAL_WORKS } from './workMasterData';

const STORAGE_KEY = 'jpm_lms_work_master';

/**
 * Work Master CRUD Service
 * 
 * Manages work items in localStorage.
 * Designed for future replacement with a real backend/API service.
 * All methods are decoupled from UI components.
 */
class WorkMasterService {
  _generateId() {
    return `work-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  getWorks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading Work Master data from localStorage:', err);
    }
    // Default initial seed on first load
    this.saveWorks(INITIAL_WORKS);
    return [...INITIAL_WORKS];
  }

  saveWorks(works) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
  }

  getWorkById(id) {
    const works = this.getWorks();
    return works.find(w => w.id === id) || null;
  }

  addWork(workData) {
    const works = this.getWorks();
    const newWork = {
      ...workData,
      id: this._generateId(),
      status: workData.status || 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    const updated = [newWork, ...works];
    this.saveWorks(updated);
    return newWork;
  }

  updateWork(workData) {
    const works = this.getWorks();
    const index = works.findIndex(w => w.id === workData.id);
    if (index === -1) return null;

    works[index] = {
      ...works[index],
      ...workData,
      updatedAt: new Date().toISOString()
    };
    this.saveWorks(works);
    return works[index];
  }

  toggleStatus(id) {
    const works = this.getWorks();
    const work = works.find(w => w.id === id);
    if (!work) return null;

    work.status = work.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.saveWorks(works);
    return work;
  }

  deleteWork(id) {
    const works = this.getWorks();
    const updated = works.filter(w => w.id !== id);
    this.saveWorks(updated);
    return true;
  }

  /**
   * Simulate file upload (mock for frontend-only mode).
   * In production, this would call a real backend storage API.
   * @param {File|Object} file - The file object or mock metadata
   * @returns {Object} - Mock upload result with metadata
   */
  simulateFileUpload(file) {
    return {
      name: file.name || 'uploaded_file',
      size: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '2.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      // In production this would be a real storage URL
      url: file.url || null
    };
  }
}

export const workMasterService = new WorkMasterService();
