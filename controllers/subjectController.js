const { promisePool } = require('../config/db');

/**
 * Get all subjects for the logged-in user
 * GET /api/subjects
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const [subjects] = await promisePool.query(
      'SELECT * FROM Subjects WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      count: subjects.length,
      data: subjects
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
    const [subjects] = await promisePool.query(
      'SELECT * FROM Subjects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      data: subjects[0]
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

    const [result] = await promisePool.query(
      'INSERT INTO Subjects (user_id, name, description) VALUES (?, ?, ?)',
      [req.user.id, name, description || null]
    );

    // Get the created subject
    const [newSubject] = await promisePool.query(
      'SELECT * FROM Subjects WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject[0]
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
    const [existingSubjects] = await promisePool.query(
      'SELECT * FROM Subjects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingSubjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Update subject
    await promisePool.query(
      'UPDATE Subjects SET name = ?, description = ? WHERE id = ?',
      [name || existingSubjects[0].name, description !== undefined ? description : existingSubjects[0].description, req.params.id]
    );

    // Get updated subject
    const [updatedSubject] = await promisePool.query(
      'SELECT * FROM Subjects WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject[0]
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
    const [existingSubjects] = await promisePool.query(
      'SELECT * FROM Subjects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingSubjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Delete subject (cascade will delete related sessions)
    await promisePool.query(
      'DELETE FROM Subjects WHERE id = ?',
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
