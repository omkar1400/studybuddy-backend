import React, { useState, useEffect } from 'react';
import { sessionAPI, subjectAPI } from '../services/api';
import './Sessions.css';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, subjectsRes] = await Promise.all([
        sessionAPI.getAllSessions(),
        subjectAPI.getAllSubjects()
      ]);
      setSessions(sessionsRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
    } catch (err) {
      setError('Unable to load your study sessions and subjects. Please refresh or contact support');
      console.error('Data fetch error:', err);
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

    if (!formData.subject_id) {
      setError('Please select a subject for this study session');
      return;
    }

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setError('Session title cannot be empty');
      return;
    }

    if (trimmedTitle.length < 3) {
      setError('Session title must be at least 3 characters long');
      return;
    }

    if (trimmedTitle.length > 150) {
      setError('Session title is too long (maximum 150 characters)');
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      setError('Both start and end times are required');
      return;
    }

    const startTime = new Date(formData.start_time);
    const endTime = new Date(formData.end_time);

    if (endTime <= startTime) {
      setError('End time must be after the start time');
      return;
    }

    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    if (durationHours > 24) {
      setError('Study sessions cannot exceed 24 hours');
      return;
    }

    try {
      const cleanData = {
        subject_id: formData.subject_id,
        title: trimmedTitle,
        description: formData.description.trim(),
        start_time: formData.start_time,
        end_time: formData.end_time,
        status: formData.status
      };

      if (editingId) {
        await sessionAPI.updateSession(editingId, cleanData);
      } else {
        await sessionAPI.createSession(cleanData);
      }
      
      setFormData({
        subject_id: '',
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        status: 'pending'
      });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save session. Please try again');
    }
  };

  const handleEdit = (session) => {
    setFormData({
      subject_id: session.subject_id,
      title: session.title,
      description: session.description || '',
      start_time: session.start_time.slice(0, 16),
      end_time: session.end_time.slice(0, 16),
      status: session.status
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionAPI.deleteSession(id);
        fetchData();
      } catch (err) {
        setError('Could not delete the session. Please try again or contact support');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      subject_id: '',
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'pending'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div className="container">
      <div className="sessions-page">
        <div className="page-header">
          <h1>⏱️ Study Sessions</h1>
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Schedule Session'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Session' : 'Schedule New Study Session'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject *</label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Chapter 5 Review"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleFormChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes / Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Add notes or details about this study session..."
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-btn">
                  {editingId ? 'Update Session' : 'Schedule Session'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="sessions-list">
          {sessions.length === 0 ? (
            <p className="no-data">No study sessions scheduled yet. Create one to plan your study time!</p>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-content">
                  <div className="session-title">
                    <h3>{session.title}</h3>
                    <span className={`status-badge ${session.status}`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="session-subject">📖 {session.subject_name}</p>
                  {session.description && <p className="session-description">{session.description}</p>}
                  <div className="session-times">
                    <span className="time-item">
                      🕐 {new Date(session.start_time).toLocaleString()}
                    </span>
                    <span className="time-item">
                      🕑 {new Date(session.end_time).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="session-actions">
                  <button className="edit-btn" onClick={() => handleEdit(session)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(session.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Sessions;
