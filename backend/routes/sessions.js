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

// ─── Auth Guard ──────────────────────────────────────────────────────────────
// Every session route requires a valid JWT.
router.use(auth);

// ─── Study-Session Routes (all JWT-protected) ────────────────────────────────
// IMPORTANT: specific string routes (/status/:status) must be registered
// BEFORE parameterised routes (/:id) to avoid Express matching them as IDs.
router.get('/',               getAllSessions);      // GET    /api/sessions
router.get('/status/:status', getSessionsByStatus); // GET    /api/sessions/status/:status
router.get('/:id',            getSessionById);      // GET    /api/sessions/:id
router.post('/',              createSession);       // POST   /api/sessions
router.put('/:id',            updateSession);       // PUT    /api/sessions/:id
router.delete('/:id',         deleteSession);       // DELETE /api/sessions/:id

module.exports = router;
