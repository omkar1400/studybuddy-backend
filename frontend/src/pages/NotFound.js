import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound (404) Page
 * Displayed whenever the user navigates to a route that does not exist.
 * Provides helpful links to guide them back into the application.
 */
function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Large error code for immediate visual clarity */}
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          Sorry, the page you're looking for doesn't exist. Let's get you back on track!
        </p>

        {/* Recovery links */}
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
