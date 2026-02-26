const pool = require('../config/db');

// ─── GET /api/subjects ───────────────────────────────────────────────────────
// Returns all subjects that belong to the authenticated user.
// Each user only ever sees their own subjects (data isolation via user_id).
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

// ─── GET /api/subjects/:id ───────────────────────────────────────────────────
// Returns a single subject by its ID.
// The user_id check ensures users cannot read other users' subjects.
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    // 404 covers both "doesn't exist" and "belongs to another user"
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

// ─── POST /api/subjects ──────────────────────────────────────────────────────
// Creates a new subject for the authenticated user.
// `name` is required; `description` is optional.
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required field
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    // Insert the new subject and return the full row
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

// ─── PUT /api/subjects/:id ───────────────────────────────────────────────────
// Updates an existing subject.
// Only the owner can update; unset fields fall back to current DB values.
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Confirm the subject exists and belongs to the authenticated user
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

    // Use parameterised query to prevent SQL injection.
    // Fall back to the current DB value for any field the caller omitted.
    const updatedSubject = await pool.query(
      `UPDATE subjects
       SET name        = $1,
           description = $2,
           updated_at  = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [
        name        || subjectExists.rows[0].name,
        description !== undefined ? description : subjectExists.rows[0].description,
        id,
        req.userId
      ]
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

// ─── DELETE /api/subjects/:id ────────────────────────────────────────────────
// Permanently removes a subject.
// Cascades to all study_sessions linked to this subject (DB ON DELETE CASCADE).
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm the subject exists and belongs to the authenticated user
    const subjectExists = await pool.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (subjectExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Hard-delete — related study_sessions are removed automatically via FK cascade
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
