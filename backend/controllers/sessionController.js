const pool = require('../config/db');

// Allowed values for the `status` column (matches DB CHECK constraint)
const VALID_STATUSES = ['pending', 'completed', 'cancelled'];

// ─── GET /api/sessions ───────────────────────────────────────────────────────
// Returns all study sessions belonging to the authenticated user.
// JOINs with subjects so the subject name is included in each row.
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await pool.query(
      `SELECT
        ss.*,
        s.name AS subject_name
      FROM study_sessions ss
      JOIN subjects s ON ss.subject_id = s.id
      WHERE ss.user_id = $1
      ORDER BY ss.start_time DESC`,
      [req.userId]
    );

    res.json({
      success: true,
      count: sessions.rows.length,
      data: sessions.rows
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ─── GET /api/sessions/:id ───────────────────────────────────────────────────
// Returns a single session by its ID.
// Also verifies that the session belongs to the requesting user (data isolation).
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await pool.query(
      `SELECT
        ss.*,
        s.name        AS subject_name,
        s.description AS subject_description
      FROM study_sessions ss
      JOIN subjects s ON ss.subject_id = s.id
      WHERE ss.id = $1 AND ss.user_id = $2`,
      [id, req.userId]
    );

    // Return 404 if the session doesn't exist or belongs to another user
    if (session.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    res.json({
      success: true,
      data: session.rows[0]
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ─── POST /api/sessions ──────────────────────────────────────────────────────
// Creates a new study session linked to an existing subject.
// Validates required fields, subject ownership, and time logic.
exports.createSession = async (req, res) => {
  try {
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Validate required fields
    if (!subject_id || !title || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: subject_id, title, start_time, end_time'
      });
    }

    // Validate status value if provided (must match DB CHECK constraint)
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Ensure the referenced subject exists and belongs to this user
    const subjectExists = await pool.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );

    if (subjectExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Business rule: end_time must be after start_time
    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Insert the new session; default status to 'pending' if not provided
    const newSession = await pool.query(
      `INSERT INTO study_sessions
         (user_id, subject_id, title, description, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.userId, subject_id, title, description || null, start_time, end_time, status || 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: newSession.rows[0]
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ─── PUT /api/sessions/:id ───────────────────────────────────────────────────
// Updates an existing study session.
// Only the owner of the session may update it.
// All fields are optional — unset fields fall back to current DB values.
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Confirm the session exists and belongs to the authenticated user
    const sessionExists = await pool.query(
      'SELECT * FROM study_sessions WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (sessionExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    // Validate the new status value if one was supplied
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // If subject_id is changing, verify the new subject exists and belongs to this user
    if (subject_id && subject_id !== sessionExists.rows[0].subject_id) {
      const subjectExists = await pool.query(
        'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
        [subject_id, req.userId]
      );

      if (subjectExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }
    }

    // Merge incoming times with existing values before validating the range
    const newStartTime = start_time || sessionExists.rows[0].start_time;
    const newEndTime   = end_time   || sessionExists.rows[0].end_time;

    if (new Date(newEndTime) <= new Date(newStartTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Perform the update, falling back to existing values for any unset field
    const updatedSession = await pool.query(
      `UPDATE study_sessions
       SET subject_id  = $1,
           title       = $2,
           description = $3,
           start_time  = $4,
           end_time    = $5,
           status      = $6,
           updated_at  = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        subject_id  || sessionExists.rows[0].subject_id,
        title       || sessionExists.rows[0].title,
        description !== undefined ? description : sessionExists.rows[0].description,
        newStartTime,
        newEndTime,
        status      || sessionExists.rows[0].status,
        id,
        req.userId
      ]
    );

    res.json({
      success: true,
      message: 'Study session updated successfully',
      data: updatedSession.rows[0]
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ─── DELETE /api/sessions/:id ────────────────────────────────────────────────
// Permanently removes a study session.
// Only the owner may delete their own session.
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm the session exists and belongs to the authenticated user
    const sessionExists = await pool.query(
      'SELECT id FROM study_sessions WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (sessionExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    // Hard-delete the row from the database
    await pool.query(
      'DELETE FROM study_sessions WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    res.json({
      success: true,
      message: 'Study session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ─── GET /api/sessions/status/:status ───────────────────────────────────────
// Filters the authenticated user's sessions by status value.
// Valid statuses: pending | completed | cancelled
exports.getSessionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Reject unknown status values immediately (prevents empty-result confusion)
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const sessions = await pool.query(
      `SELECT
        ss.*,
        s.name AS subject_name
      FROM study_sessions ss
      JOIN subjects s ON ss.subject_id = s.id
      WHERE ss.user_id = $1 AND ss.status = $2
      ORDER BY ss.start_time DESC`,
      [req.userId, status]
    );

    res.json({
      success: true,
      count: sessions.rows.length,
      data: sessions.rows
    });
  } catch (error) {
    console.error('Get sessions by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
