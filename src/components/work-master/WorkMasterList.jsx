import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import { workMasterService } from '../../modules/work-master/workMasterService';
import { DEPARTMENTS, WORK_LEVELS } from '../../modules/work-master/workMasterData';
import { WorkCard } from './WorkCard';
import { WorkFormModal } from './WorkFormModal';
import { WorkPreviewModal } from './WorkPreviewModal';
import '../../styles/work-master.css';

export const WorkMasterList = () => {
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [workToEdit, setWorkToEdit] = useState(null);

  // Load works
  const loadWorks = () => {
    const list = workMasterService.getWorks();
    setWorks(list);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  // Filter handlers
  const filteredWorks = works.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || w.department === deptFilter;
    const matchesLevel = levelFilter === 'ALL' || w.level === levelFilter;
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;

    return matchesSearch && matchesDept && matchesLevel && matchesStatus;
  });

  // Action handlers
  const handleOpenCreate = () => {
    setWorkToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (work) => {
    setWorkToEdit(work);
    setIsFormOpen(true);
  };

  const handleOpenPreview = (work) => {
    setSelectedWork(work);
    setIsPreviewOpen(true);
  };

  const handleSaveWork = (formData) => {
    if (formData.id) {
      workMasterService.updateWork(formData);
    } else {
      workMasterService.addWork(formData);
    }
    loadWorks();
  };

  const handleToggleStatus = (id) => {
    workMasterService.toggleStatus(id);
    loadWorks();
  };

  return (
    <div className="work-master-page">
      {/* Header Banner */}
      <div className="wm-header-card">
        <div className="wm-title-group">
          <h1>Work Master</h1>
          <p>Manage JPM learning works and their training resources.</p>
        </div>

        <button className="wm-create-btn" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Create New Work</span>
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="wm-filter-bar">
        <div className="wm-search-wrapper">
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="wm-search-input"
            placeholder="Search work title, department, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="wm-filter-select"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="wm-filter-select"
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
        >
          <option value="ALL">All Levels</option>
          {WORK_LEVELS.map(lvl => (
            <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
          ))}
        </select>

        <select
          className="wm-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Works List */}
      <div className="wm-works-list">
        {filteredWorks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-light)'
          }}>
            <BookOpen size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--jpm-navy)', marginBottom: '0.25rem' }}>
              No Works Found
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              No Work Master items match the selected search or filter criteria.
            </p>
            <button className="wm-create-btn" onClick={handleOpenCreate}>
              <Plus size={16} /> Create New Work
            </button>
          </div>
        ) : (
          filteredWorks.map(work => (
            <WorkCard
              key={work.id}
              work={work}
              onPreview={handleOpenPreview}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>

      {/* Form Modal (Create / Edit) */}
      <WorkFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveWork}
        workToEdit={workToEdit}
      />

      {/* Preview Modal */}
      <WorkPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        work={selectedWork}
      />
    </div>
  );
};
