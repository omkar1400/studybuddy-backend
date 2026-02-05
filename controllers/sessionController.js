const { promisePool } = require('../config/db');

/**
 * Get all study sessions for the logged-in user
 * GET /api/sessions
 */
exports.getAllSessions = async (req, res) => {
  try {
    const [sessions] = await promisePool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM StudySessions s
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.user_id = ?
      ORDER BY s.start_time DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
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
    const [sessions] = await promisePool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM StudySessions s
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.id = ? AND s.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    res.json({
      success: true,
      data: sessions[0]
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
    const [subjects] = await promisePool.query(
      'SELECT id FROM Subjects WHERE id = ? AND user_id = ?',
      [subject_id, req.user.id]
    );

    if (subjects.length === 0) {
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

    const [result] = await promisePool.query(
      `INSERT INTO StudySessions 
        (user_id, subject_id, title, description, start_time, end_time, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, subject_id, title, description || null, start_time, end_time, status || 'pending']
    );

    // Get the created session with subject name
    const [newSession] = await promisePool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM StudySessions s
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: newSession[0]
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
    const [existingSessions] = await promisePool.query(
      'SELECT * FROM StudySessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingSessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    const existingSession = existingSessions[0];

    // If subject_id is being updated, verify it belongs to user
    if (subject_id && subject_id !== existingSession.subject_id) {
      const [subjects] = await promisePool.query(
        'SELECT id FROM Subjects WHERE id = ? AND user_id = ?',
        [subject_id, req.user.id]
      );

      if (subjects.length === 0) {
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
    await promisePool.query(
      `UPDATE StudySessions 
      SET subject_id = ?, title = ?, description = ?, start_time = ?, end_time = ?, status = ?
      WHERE id = ?`,
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
    const [updatedSession] = await promisePool.query(
      `SELECT 
        s.*,
        sub.name as subject_name
      FROM StudySessions s
      LEFT JOIN Subjects sub ON s.subject_id = sub.id
      WHERE s.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Study session updated successfully',
      data: updatedSession[0]
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
    const [existingSessions] = await promisePool.query(
      'SELECT * FROM StudySessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingSessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found'
      });
    }

    // Delete session
    await promisePool.query(
      'DELETE FROM StudySessions WHERE id = ?',
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
