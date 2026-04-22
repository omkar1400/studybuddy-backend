import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../services/api';
import './Subjects.css';

/**
 * Subjects Page
 * Allows the user to view, create, edit, and delete their study subjects (full CRUD).
 * Each subject can optionally have a description.
 */
function Subjects() {
  // Full list of subjects fetched from the API
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  // When editingId is set, the form is in edit mode rather than create mode
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Load all subjects when the component mounts
  useEffect(() => {
    fetchSubjects();
  }, []);

  /**
   * Fetches the current user's subjects from the API.
   * Resets the list on each call to ensure data is always fresh.
   */
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getAllSubjects();
      setSubjects(response.data.data || []);
    } catch (err) {
      setError('Unable to fetch your subjects. Please check your connection and try again');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generic handler for form field changes.
   * Uses the input's name attribute to update the correct field in state.
   */
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Validates form inputs then creates or updates a subject via the API.
   * Determines create vs. update based on whether editingId is set.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = formData.name.trim();

    // Validate subject name length and presence
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
      setSubmitting(true);
      const cleanData = {
        name: trimmedName,
        description: formData.description.trim()
      };

      if (editingId) {
        // Update the existing subject
        await subjectAPI.updateSubject(editingId, cleanData.name, cleanData.description);
        setSuccess('Subject updated successfully!');
      } else {
        // Create a brand new subject
        await subjectAPI.createSubject(cleanData.name, cleanData.description);
        setSuccess('Subject created successfully!');
      }

      // Reset form and refresh the subject list
      resetForm();
      fetchSubjects();

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save subject. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Loads a subject's data into the form for editing.
   * Sets editingId so the form knows to call updateSubject instead of createSubject.
   */
  const handleEdit = (subject) => {
    setFormData({ name: subject.name, description: subject.description || '' });
    setEditingId(subject.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  /**
   * Asks for confirmation then deletes the selected subject.
   * Refreshes the list and shows a brief success message on completion.
   */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectAPI.deleteSubject(id);
        setSuccess('Subject deleted.');
        fetchSubjects();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Could not delete subject. Please try again or contact support');
      }
    }
  };

  /**
   * Resets the form to its empty initial state and hides it.
   */
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
    setError('');
  };

  // Show loading indicator while subjects are being fetched
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
            onClick={() => {
              // Toggle form visibility; reset state when closing
              if (showForm) {
                handleCancel();
              } else {
                setShowForm(true);
                setError('');
                setSuccess('');
              }
            }}
          >
            {showForm ? 'Cancel' : '+ Add Subject'}
          </button>
        </div>

        {/* Feedback messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Create / Edit Form */}
        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Subject' : 'Create New Subject'}</h3>
            <form onSubmit={handleSubmit}>
              {/* Subject name — required */}
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

              {/* Optional description / notes */}
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
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingId ? 'Update Subject' : 'Create Subject')}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subject Cards */}
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
