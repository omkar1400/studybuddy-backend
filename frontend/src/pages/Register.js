import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import './Auth.css';

/**
 * Register Page
 * Handles new user account creation.
 * On success, automatically logs the user in and redirects to the dashboard.
 */
function Register({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Validates all fields then submits the registration request.
   * Auto-logs the user in after a successful registration so they
   * land directly on the dashboard without an extra login step.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim and validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmedName.length > 100) {
      setError('Name cannot exceed 100 characters');
      return;
    }

    // Trim and validate email format
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email');
      return;
    }

    // Validate password strength
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password.length > 128) {
      setError('Password is too long');
      return;
    }

    // Ensure both password fields match
    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Register the user account
      const registerRes = await userAPI.register(trimmedName, trimmedEmail, password);

      // Auto-login: if the API returns a token on registration, use it directly;
      // otherwise perform a follow-up login call for a seamless experience.
      let userData, token;
      if (registerRes.data?.data?.token) {
        userData = registerRes.data.data.user;
        token = registerRes.data.data.token;
      } else {
        const loginRes = await userAPI.login(trimmedEmail, password);
        userData = loginRes.data.data.user;
        token = loginRes.data.data.token;
      }

      // Update global auth state and redirect to dashboard
      onLogin(userData, token);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>📚 StudyBuddy</h1>
        <h2>Create Your Account</h2>

        {/* Error feedback */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          {/* Email address */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
