const express = require('express');
const router  = express.Router();
const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getSessionsByStatus
} = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// All session operations require authentication
router.use(auth);

// Study session endpoints
// Note: specific routes like /status/:status must come before /:id routes
router.get('/',               getAllSessions);
router.get('/status/:status', getSessionsByStatus);
router.get('/:id',            getSessionById);
router.post('/',              createSession);
router.put('/:id',            updateSession);
router.delete('/:id',         deleteSession);

module.exports = router;
