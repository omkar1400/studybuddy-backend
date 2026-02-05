const { pool } = require('../config/db');

/**
 * Get all subjects for the logged-in user
 * GET /api/subjects
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get a single subject by ID
 * GET /api/subjects/:id
 */
exports.getSubjectById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create a new subject
 * POST /api/subjects
 */
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    // PostgreSQL uses RETURNING to get the inserted row
    const result = await pool.query(
      'INSERT INTO subjects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, name, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update a subject
 * PUT /api/subjects/:id
 */
exports.updateSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if subject exists and belongs to user
    const existingSubject = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existingSubject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const subject = existingSubject.rows[0];

    // Update subject using RETURNING to get updated row
    const result = await pool.query(
      'UPDATE subjects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [
        name || subject.name,
        description !== undefined ? description : subject.description,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete a subject
 * DELETE /api/subjects/:id
 */
exports.deleteSubject = async (req, res) => {
  try {
    // Check if subject exists and belongs to user
    const existingSubject = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existingSubject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Delete subject (cascade will delete related sessions)
    await pool.query(
      'DELETE FROM subjects WHERE id = $1',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
