const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// All routes are protected (require authentication)
router.get('/', auth, sessionController.getAllSessions);
router.get('/:id', auth, sessionController.getSessionById);
router.post('/', auth, sessionController.createSession);
router.put('/:id', auth, sessionController.updateSession);
router.delete('/:id', auth, sessionController.deleteSession);

module.exports = router;
