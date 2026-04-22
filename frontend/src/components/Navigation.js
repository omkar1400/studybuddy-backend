import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

/**
 * Navigation Component
 * Top navigation bar rendered on every authenticated page.
 * Receives the current user and a logout callback via props.
 */
function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  /**
   * Calls the parent logout handler to clear auth state,
   * then redirects the user to the login page.
   */
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand logo / home link */}
        <Link to="/dashboard" className="navbar-logo">
          📚 StudyBuddy
        </Link>

        {/* Primary navigation links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/subjects" className="nav-link">Subjects</Link>
          </li>
          <li className="nav-item">
            <Link to="/sessions" className="nav-link">Sessions</Link>
          </li>
        </ul>

        {/* User info and logout button */}
        <div className="nav-user">
          <span className="user-info">👤 {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
