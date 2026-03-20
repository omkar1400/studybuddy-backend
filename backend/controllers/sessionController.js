const pool = require('../config/db');

const VALID_STATUSES = ['pending', 'completed', 'cancelled'];

// get all sessions for the logged in user
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

// fetch a single session by id
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

// create a new study session
exports.createSession = async (req, res) => {
  try {
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    if (!subject_id || !title || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: subject_id, title, start_time, end_time'
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

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

    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

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

// update a study session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, description, start_time, end_time, status } = req.body;

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

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

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

    const newStartTime = start_time || sessionExists.rows[0].start_time;
    const newEndTime = end_time || sessionExists.rows[0].end_time;

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

// delete a study session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

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

// get sessions filtered by status
exports.getSessionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

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
