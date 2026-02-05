const { pool } = require('../config/db');

/**
 * Get all study sessions for the logged-in user
 * GET /api/sessions
 */
exports.getAllSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.user_id = $1
      ORDER BY s.start_time DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get a single study session by ID
 * GET /api/sessions/:id
 */
exports.getSessionById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.id = $1 AND s.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create a new study session
 * POST /api/sessions
 */
exports.createSession = async (req, res) => {
  try {
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Validation
    if (!subject_id || !title || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject_id, title, start_time, and end_time'
      });
    }

    // Verify subject belongs to user
    const subjectResult = await pool.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.user.id]
    );

    if (subjectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found or does not belong to you'
      });
    }

    // Validate dates
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Insert session and return the created row
    const result = await pool.query(
      `INSERT INTO study_sessions 
        (user_id, subject_id, title, description, start_time, end_time, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [req.user.id, subject_id, title, description || null, start_time, end_time, status || 'pending']
    );

    // Get the created session with subject name
    const newSessionResult = await pool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: newSessionResult.rows[0]
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update a study session
 * PUT /api/sessions/:id
 */
exports.updateSession = async (req, res) => {
  try {
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Check if session exists and belongs to user
    const existingSessionResult = await pool.query(
      'SELECT * FROM study_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existingSessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    const existingSession = existingSessionResult.rows[0];

    // If subject_id is being updated, verify it belongs to user
    if (subject_id && subject_id !== existingSession.subject_id) {
      const subjectResult = await pool.query(
        'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
        [subject_id, req.user.id]
      );

      if (subjectResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found or does not belong to you'
        });
      }
    }

    // Validate dates if provided
    const newStartTime = start_time || existingSession.start_time;
    const newEndTime = end_time || existingSession.end_time;
    
    if (new Date(newEndTime) <= new Date(newStartTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Update session
    await pool.query(
      `UPDATE study_sessions 
      SET subject_id = $1, title = $2, description = $3, start_time = $4, end_time = $5, status = $6
      WHERE id = $7`,
      [
        subject_id || existingSession.subject_id,
        title || existingSession.title,
        description !== undefined ? description : existingSession.description,
        start_time || existingSession.start_time,
        end_time || existingSession.end_time,
        status || existingSession.status,
        req.params.id
      ]
    );

    // Get updated session with subject name
    const updatedSessionResult = await pool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM study_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.id = $1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Study session updated successfully',
      data: updatedSessionResult.rows[0]
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete a study session
 * DELETE /api/sessions/:id
 */
exports.deleteSession = async (req, res) => {
  try {
    // Check if session exists and belongs to user
    const existingSessionResult = await pool.query(
      'SELECT * FROM study_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existingSessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    // Delete session
    await pool.query(
      'DELETE FROM study_sessions WHERE id = $1',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Study session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
