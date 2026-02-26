const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// ─── Public Routes (no token required) ──────────────────────────────────────
router.post('/register', register);   // POST /api/users/register — create account
router.post('/login',    login);      // POST /api/users/login    — obtain JWT

// ─── Protected Routes (valid JWT required) ───────────────────────────────────
// NOTE: /profile must be registered BEFORE /:id so Express does not treat
// the literal string "profile" as a numeric user ID parameter.
router.get('/profile',  auth, getProfile);   // GET    /api/users/profile — own profile
router.get('/',         auth, getAllUsers);   // GET    /api/users         — all users
router.get('/:id',      auth, getUserById);  // GET    /api/users/:id     — single user
router.put('/:id',      auth, updateUser);   // PUT    /api/users/:id     — update user
router.delete('/:id',   auth, deleteUser);   // DELETE /api/users/:id     — delete user

module.exports = router;
