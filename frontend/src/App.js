import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Sessions from './pages/Sessions';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';

/**
 * Main App Component
 * Manages authentication state and routing
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        {/* Show navigation bar only when user is authenticated */}
        {isAuthenticated && <Navigation user={currentUser} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public Routes - Redirect to dashboard if already authenticated */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          
          {/* Protected Routes - Redirect to login if not authenticated */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard user={currentUser} /> : <Navigate to="/login" />}
          />
          <Route 
            path="/subjects" 
            element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />}
          />
          <Route 
            path="/sessions" 
            element={isAuthenticated ? <Sessions /> : <Navigate to="/login" />}
          />
          
          {/* Root redirect */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          
          {/* 404 Not Found - must be last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
