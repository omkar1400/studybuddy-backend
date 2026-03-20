const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// custom validation utility
const validateUserInput = (name, email, password) => {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !email.includes('@')) errors.push('Valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  if (name && name.length > 100) errors.push('Name is too long');
  return errors;
};

// user registration with enhanced validation
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const validationErrors = validateUserInput(name, email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        errors: validationErrors
      });
    }

    const emailCheckResult = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: 'This email is already registered in our system'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), hashedPassword]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to StudyBuddy!',
      data: {
        user: newUser.rows[0],
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Unable to complete registration. Please try again later.' 
    });
  }
};

// user login with enhanced security
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required'
      });
    }

    const userQuery = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Email or password is incorrect'
      });
    }

    const user = userQuery.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false,
        message: 'Email or password is incorrect'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const { password: _, ...userData } = user;
    userData.lastLogin = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication service temporarily unavailable' 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all users (admin-style read — passwords excluded)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: users.rows.length,
      data: users.rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.rows[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user (only the authenticated user can update their own account)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Users can only update their own account
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Check user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If email is being changed, check it is not already taken
    if (email && email !== userExists.rows[0].email) {
      const emailTaken = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailTaken.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account'
        });
      }
    }

    const updatedUser = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, created_at, updated_at`,
      [
        name  || userExists.rows[0].name,
        email || userExists.rows[0].email,
        id
      ]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user (only the authenticated user can delete their own account)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only delete their own account
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user'
      });
    }

    // Check user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
