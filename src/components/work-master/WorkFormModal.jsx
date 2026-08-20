import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Video, FileText, CheckCircle2, Layers, Save, Upload, UploadCloud, RefreshCw, Trash } from 'lucide-react';
import { DEPARTMENTS, WORK_LEVELS, DOCUMENT_TYPES } from '../../modules/work-master/workMasterData';

const EMPTY_FORM = {
  name: '',
  department: 'Data Entry',
  role: '',
  level: 'L1',
  shortDescription: '',
  description: '',
  status: 'ACTIVE',
  trainingVideo: null,
  documents: [],
  learningPoints: [],
  practical: {
    durationDays: 4,
    instructions: '',
    expectedOutcome: '',
    accuracyTarget: ''
  }
};

export const WorkFormModal = ({ isOpen, onClose, onSave, workToEdit = null }) => {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [newPoint, setNewPoint] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('SOP');
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Populate form when opening
  useEffect(() => {
    if (!isOpen) return;
    if (workToEdit) {
      setFormData({
        id: workToEdit.id,
        name: workToEdit.name || '',
        department: workToEdit.department || 'Data Entry',
        role: workToEdit.role || '',
        level: workToEdit.level || 'L1',
        shortDescription: workToEdit.shortDescription || '',
        description: workToEdit.description || '',
        status: workToEdit.status || 'ACTIVE',
        trainingVideo: workToEdit.trainingVideo || null,
        documents: workToEdit.documents || [],
        learningPoints: workToEdit.learningPoints || [],
        practical: {
          durationDays: workToEdit.practical?.durationDays || 4,
          instructions: workToEdit.practical?.instructions || '',
          expectedOutcome: workToEdit.practical?.expectedOutcome || '',
          accuracyTarget: workToEdit.practical?.accuracyTarget || ''
        }
      });
    } else {
      setFormData({ ...EMPTY_FORM, practical: { ...EMPTY_FORM.practical } });
    }
    setNewPoint('');
    setNewDocName('');
  }, [workToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  // --- Video handlers ---
  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Create a local object URL for preview (mock upload)
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      trainingVideo: {
        name: file.name,
        url: previewUrl,
        duration: 'Pending',
        uploadedAt: new Date().toISOString().split('T')[0],
        _localFile: true // Flag: this is a local preview, not a real server URL
      }
    }));
    e.target.value = ''; // reset file input
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, trainingVideo: null }));
  };

  const handleReplaceVideo = () => {
    videoInputRef.current?.click();
  };

  // --- Document handlers ---
  const handleDocFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: newDocType,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      _localFile: true
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
    e.target.value = '';
  };

  const handleAddDocumentManual = () => {
    if (!newDocName.trim()) return;
    const doc = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : newDocName.trim() + '.pdf',
      type: newDocType,
      size: '—',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
    setNewDocName('');
  };

  const handleRemoveDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  // --- Learning points ---
  const handleAddLearningPoint = () => {
    if (!newPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      learningPoints: [...prev.learningPoints, newPoint.trim()]
    }));
    setNewPoint('');
  };

  const handleRemoveLearningPoint = (idx) => {
    setFormData(prev => ({
      ...prev,
      learningPoints: prev.learningPoints.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wm-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="modal-title">
            {workToEdit ? 'Edit Work Master' : 'Create New Work Master'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Basic Information */}
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">Basic Information</h3>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="work-name">Work Name *</label>
              <input
                id="work-name"
                type="text"
                className="form-input"
                placeholder="e.g. Bill Inward Entry"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="work-dept">Department</label>
                <select
                  id="work-dept"
                  className="form-input"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="work-role">Target Role</label>
                <input
                  id="work-role"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Data Entry Specialist, Procurement Officer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="work-level">Work Level</label>
                <select
                  id="work-level"
                  className="form-input"
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                >
                  {WORK_LEVELS.map(lvl => (
                    <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="work-status">Status</label>
                <select
                  id="work-status"
                  className="form-input"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="work-short-desc">Short Description</label>
              <input
                id="work-short-desc"
                type="text"
                className="form-input"
                placeholder="Brief 1-line summary of the work"
                value={formData.shortDescription}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="work-desc">Detailed Description</label>
              <textarea
                id="work-desc"
                className="form-input"
                rows={3}
                placeholder="Detailed scope, context, and operational details of this work"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 2: Training Video — Upload / Preview / Replace / Remove */}
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <Video size={18} color="#0A2240" />
              <span>Training Video</span>
            </h3>

            {/* Hidden file input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleVideoFileSelect}
            />

            {formData.trainingVideo ? (
              <div>
                {/* Show video preview */}
                <div className="video-preview-box" style={{ marginBottom: '0.75rem' }}>
                  <video controls className="video-player" src={formData.trainingVideo.url}>
                    Your browser does not support video preview.
                  </video>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>{formData.trainingVideo.name}</strong>
                    {formData.trainingVideo.duration && <span> &bull; {formData.trainingVideo.duration}</span>}
                    {formData.trainingVideo._localFile && (
                      <span style={{ marginLeft: '8px', fontSize: '0.725rem', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '4px', fontWeight: 600 }}>
                        Local Preview
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="wm-action-btn" onClick={handleReplaceVideo}>
                      <RefreshCw size={14} /> Replace Video
                    </button>
                    <button type="button" className="wm-action-btn" onClick={handleRemoveVideo} style={{ color: '#DC2626' }}>
                      <Trash size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-primary)',
                  transition: 'all 150ms ease'
                }}
              >
                <UploadCloud size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--jpm-navy)', marginBottom: '0.25rem' }}>
                  Click to upload training video
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  MP4, AVI, MOV &bull; Will connect to JPM storage service in production
                </p>
              </div>
            )}
          </div>

          {/* Section 3: SOP & Documents — Upload / Add / Remove */}
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <FileText size={18} color="#C5A059" />
              <span>SOP & Documents</span>
            </h3>

            {/* Hidden file input for doc upload */}
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              onChange={handleDocFileSelect}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Document name (e.g. Bill Inward SOP)"
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                style={{ flex: 2, minWidth: '200px' }}
              />
              <select
                className="form-input"
                value={newDocType}
                onChange={e => setNewDocType(e.target.value)}
                style={{ flex: 0.8, minWidth: '120px' }}
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button type="button" className="wm-action-btn btn-primary" onClick={handleAddDocumentManual}>
                <Plus size={15} /> Add
              </button>
              <button type="button" className="wm-action-btn" onClick={() => docInputRef.current?.click()}>
                <Upload size={15} /> Upload File
              </button>
            </div>

            {formData.documents.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No documents added yet. Add or upload SOP, Checklist, Work Instruction, or Reference Documents.
              </p>
            )}

            {formData.documents.map((doc) => (
              <div key={doc.id} className="document-item-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="#0A2240" />
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--jpm-navy)' }}>{doc.name}</span>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {doc.type} &bull; {doc.size || '—'} &bull; {doc.uploadDate}
                      {doc._localFile && (
                        <span style={{ marginLeft: '6px', padding: '1px 5px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '3px', fontWeight: 600 }}>
                          Local
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveDocument(doc.id)} style={{ color: '#DC2626', padding: '4px' }} title="Remove document">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Section 4: Key Learning Points */}
          <div className="wm-form-section">
            <h3 className="wm-form-section-title">
              <CheckCircle2 size={18} color="#166534" />
              <span>What You Will Learn</span>
            </h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter a learning point"
                value={newPoint}
                onChange={e => setNewPoint(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLearningPoint(); } }}
              />
              <button type="button" className="wm-action-btn btn-primary" onClick={handleAddLearningPoint}>
                <Plus size={15} /> Add
              </button>
            </div>

            {formData.learningPoints.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No learning points added yet.
              </p>
            )}

            <div className="learning-points-builder">
              {formData.learningPoints.map((pt, idx) => (
                <div key={idx} className="learning-point-item">
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-gold)', flexShrink: 0 }}>✓</span>
                  <input
                    type="text"
                    className="form-input"
                    value={pt}
                    onChange={e => {
                      const updated = [...formData.learningPoints];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, learningPoints: updated });
                    }}
                  />
                  <button type="button" onClick={() => handleRemoveLearningPoint(idx)} style={{ color: '#DC2626', padding: '4px', flexShrink: 0 }} title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Practical Training */}
          <div className="wm-form-section" style={{ borderBottom: 'none' }}>
            <h3 className="wm-form-section-title">
              <Layers size={18} color="#0A2240" />
              <span>Practical Training</span>
            </h3>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prac-duration">Practical Duration (Days)</label>
                <input
                  id="prac-duration"
                  type="number"
                  min="1"
                  max="90"
                  className="form-input"
                  value={formData.practical?.durationDays || ''}
                  onChange={e => setFormData({
                    ...formData,
                    practical: { ...formData.practical, durationDays: parseInt(e.target.value) || '' }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prac-accuracy">Accuracy Target (Optional)</label>
                <input
                  id="prac-accuracy"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 99%, 95%, or leave empty"
                  value={formData.practical?.accuracyTarget || ''}
                  onChange={e => setFormData({
                    ...formData,
                    practical: { ...formData.practical, accuracyTarget: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="prac-instructions">Practical Instructions</label>
              <textarea
                id="prac-instructions"
                className="form-input"
                rows={2}
                placeholder="Describe the shadowing, practice tasks, or assessments"
                value={formData.practical?.instructions || ''}
                onChange={e => setFormData({
                  ...formData,
                  practical: { ...formData.practical, instructions: e.target.value }
                })}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prac-outcome">Expected Outcome</label>
              <input
                id="prac-outcome"
                type="text"
                className="form-input"
                placeholder="e.g. Employee can perform the work independently."
                value={formData.practical?.expectedOutcome || ''}
                onChange={e => setFormData({
                  ...formData,
                  practical: { ...formData.practical, expectedOutcome: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" className="wm-action-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="wm-action-btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Save size={18} />
              <span>{workToEdit ? 'Save Changes' : 'Create Work Master'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
