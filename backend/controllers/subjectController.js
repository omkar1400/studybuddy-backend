const pool = require('../config/db');

// Get all subjects for logged-in user
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await pool.query(
      'SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({
      success: true,
      count: subjects.rows.length,
      data: subjects.rows
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Get single subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (subject.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Subject not found' 
      });
    }

    res.json({
      success: true,
      data: subject.rows[0]
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Create new subject
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Subject name is required' 
      });
    }

    const newSubject = await pool.query(
      'INSERT INTO subjects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject.rows[0]
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if subject exists and belongs to user
    const subjectExists = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (subjectExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Subject not found' 
      });
    }

    const updatedSubject = await pool.query(
      'UPDATE subjects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [name || subjectExists.rows[0].name, description !== undefined ? description : subjectExists.rows[0].description, id, req.userId]
    );

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject.rows[0]
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subject exists and belongs to user
    const subjectExists = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (subjectExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Subject not found' 
      });
    }

    await pool.query(
      'DELETE FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
