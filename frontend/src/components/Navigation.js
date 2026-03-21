import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          📚 StudyBuddy
        </Link>
        
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

        <div className="nav-user">
          <span className="user-info">👤 {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
