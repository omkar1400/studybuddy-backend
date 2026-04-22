import React from 'react';

/**
 * StatusBadge Component
 * Renders a color-coded pill badge for a session status value.
 * Reused in both the Sessions page and the Dashboard recent-sessions list.
 *
 * Props:
 *   status {string} - 'pending' | 'completed' | 'cancelled'
 */
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
