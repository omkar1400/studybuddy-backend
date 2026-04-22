import React, { useState, useEffect } from 'react';
import { subjectAPI, sessionAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import './Dashboard.css';

function Dashboard({ user }) {
  // Dashboard statistics state
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    cancelledSessions: 0,
    totalHours: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Calculate study statistics from sessions
   * Counts by status and calculates total study hours
   */
  const calculateStudyStats = (sessions) => {
    const stats = {
      completed: 0,
      pending: 0,
      cancelled: 0,
      totalHours: 0
    };
    
    sessions.forEach(session => {
      if (session.status === 'completed') stats.completed++;
      else if (session.status === 'pending') stats.pending++;
      else if (session.status === 'cancelled') stats.cancelled++;
      
      // Calculate duration in hours
      const hrs = (new Date(session.end_time) - new Date(session.start_time)) / (1000 * 60 * 60);
      stats.totalHours += hrs;
    });
    
    return stats;
  };

  /**
   * Fetch all subjects and sessions to populate dashboard
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch subjects and sessions in parallel
      const [subjectsRes, sessionsRes] = await Promise.all([
        subjectAPI.getAllSubjects(),
        sessionAPI.getAllSessions()
      ]);

      const subjects = subjectsRes.data.data || [];
      const sessions = sessionsRes.data.data || [];
      const sessionStats = calculateStudyStats(sessions);

      setStats({
        totalSubjects: subjects.length,
        totalSessions: sessions.length,
        completedSessions: sessionStats.completed,
        pendingSessions: sessionStats.pending,
        cancelledSessions: sessionStats.cancelled,
        totalHours: sessionStats.totalHours.toFixed(1)
      });

      // Show latest 5 sessions
      setRecentSessions(sessions.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome back, {user?.name}! 👋</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>📚 Subjects</h3>
            <p className="stat-number">{stats.totalSubjects}</p>
            <p className="stat-label">Total subjects</p>
          </div>

          <div className="stat-card">
            <h3>⏱️ Study Sessions</h3>
            <p className="stat-number">{stats.totalSessions}</p>
            <p className="stat-label">Total sessions</p>
          </div>

          <div className="stat-card">
            <h3>✅ Completed</h3>
            <p className="stat-number">{stats.completedSessions}</p>
            <p className="stat-label">Completed sessions</p>
          </div>

          <div className="stat-card">
            <h3>⏳ Pending</h3>
            <p className="stat-number">{stats.pendingSessions}</p>
            <p className="stat-label">Pending sessions</p>
          </div>
        </div>

        <div className="recent-section">
          <h2>Recent Study Sessions</h2>
          {recentSessions.length === 0 ? (
            <p className="no-data">No study sessions yet. Start by creating a subject and scheduling a session!</p>
          ) : (
            <div className="sessions-list">
              {recentSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-header">
                    <h4>{session.title}</h4>
                    <StatusBadge status={session.status} />
                  </div>
                  <p className="session-subject">📖 {session.subject_name}</p>
                  <p className="session-time">
                    🕐 {new Date(session.start_time).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
