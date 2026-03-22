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

// These endpoints don't require authentication
router.post('/register', register);
router.post('/login',    login);

// Protected endpoints - require valid JWT token
// Note: /profile route must come before /:id to prevent route conflicts
router.get('/profile',  auth, getProfile);
router.get('/',         auth, getAllUsers);
router.get('/:id',      auth, getUserById);
router.put('/:id',      auth, updateUser);
router.delete('/:id',   auth, deleteUser);

module.exports = router;
