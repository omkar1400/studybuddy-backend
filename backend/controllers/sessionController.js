const pool = require('../config/db');

// Get all study sessions for logged-in user
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await pool.query(
      `SELECT 
        ss.*, 
        s.name as subject_name 
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

// Get single study session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await pool.query(
      `SELECT 
        ss.*, 
        s.name as subject_name,
        s.description as subject_description
      FROM study_sessions ss
      JOIN subjects s ON ss.subject_id = s.id
      WHERE ss.id = $1 AND ss.user_id = $2`,
      [id, req.userId]
    );

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

// Create new study session
exports.createSession = async (req, res) => {
  try {
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Validate input
    if (!subject_id || !title || !start_time || !end_time) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields (subject_id, title, start_time, end_time)' 
      });
    }

    // Check if subject exists and belongs to user
    const subjectExists = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );

    if (subjectExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Subject not found' 
      });
    }

    // Validate time (end_time should be after start_time)
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

// Update study session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, title, description, start_time, end_time, status } = req.body;

    // Check if session exists and belongs to user
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

    // If subject_id is being updated, verify it exists and belongs to user
    if (subject_id && subject_id !== sessionExists.rows[0].subject_id) {
      const subjectExists = await pool.query(
        'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
        [subject_id, req.userId]
      );

      if (subjectExists.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Subject not found' 
        });
      }
    }

    // Validate time if both are provided
    const newStartTime = start_time || sessionExists.rows[0].start_time;
    const newEndTime = end_time || sessionExists.rows[0].end_time;
    
    if (new Date(newEndTime) <= new Date(newStartTime)) {
      return res.status(400).json({ 
        success: false,
        message: 'End time must be after start time' 
      });
    }

    const updatedSession = await pool.query(
      `UPDATE study_sessions 
       SET subject_id = $1, 
           title = $2, 
           description = $3, 
           start_time = $4, 
           end_time = $5, 
           status = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8 
       RETURNING *`,
      [
        subject_id || sessionExists.rows[0].subject_id,
        title || sessionExists.rows[0].title,
        description !== undefined ? description : sessionExists.rows[0].description,
        newStartTime,
        newEndTime,
        status || sessionExists.rows[0].status,
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

// Delete study session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if session exists and belongs to user
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

// Get sessions by status
exports.getSessionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const sessions = await pool.query(
      `SELECT 
        ss.*, 
        s.name as subject_name 
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
