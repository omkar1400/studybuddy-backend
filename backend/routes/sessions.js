const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getSessionsByStatus
} = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/', getAllSessions);
router.get('/status/:status', getSessionsByStatus);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
