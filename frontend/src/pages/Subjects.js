import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../services/api';
import './Subjects.css';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getAllSubjects();
      setSubjects(response.data.data || []);
    } catch (err) {
      setError('Unable to fetch your subjects. Please check your connection and try again');
      console.error('Subject fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = formData.name.trim();
    
    if (!trimmedName) {
      setError('Please enter a subject name');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Subject name must be at least 2 characters long');
      return;
    }

    if (trimmedName.length > 100) {
      setError('Subject name cannot exceed 100 characters');
      return;
    }

    try {
      const cleanData = {
        name: trimmedName,
        description: formData.description.trim()
      };
      
      if (editingId) {
        await subjectAPI.updateSubject(editingId, cleanData.name, cleanData.description);
      } else {
        await subjectAPI.createSubject(cleanData.name, cleanData.description);
      }
      
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save subject. Please try again');
    }
  };

  const handleEdit = (subject) => {
    setFormData({ name: subject.name, description: subject.description || '' });
    setEditingId(subject.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectAPI.deleteSubject(id);
        fetchSubjects();
      } catch (err) {
        setError('Could not delete subject. Please try again or contact support');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading subjects...</div>;
  }

  return (
    <div className="container">
      <div className="subjects-page">
        <div className="page-header">
          <h1>📚 My Subjects</h1>
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Subject'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Subject' : 'Create New Subject'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., Mathematics, Physics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Add notes about this subject..."
                  rows="4"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  {editingId ? 'Update Subject' : 'Create Subject'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="subjects-list">
          {subjects.length === 0 ? (
            <p className="no-data">No subjects yet. Create one to get started!</p>
          ) : (
            subjects.map(subject => (
              <div key={subject.id} className="subject-card">
                <div className="subject-content">
                  <h3>{subject.name}</h3>
                  {subject.description && <p>{subject.description}</p>}
                  <small>Created: {new Date(subject.created_at).toLocaleDateString()}</small>
                </div>
                <div className="subject-actions">
                  <button className="edit-btn" onClick={() => handleEdit(subject)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(subject.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Subjects;
