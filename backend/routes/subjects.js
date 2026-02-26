const express = require('express');
const router  = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const auth = require('../middleware/auth');

// ─── Auth Guard ──────────────────────────────────────────────────────────────
// Every subject route requires a valid JWT — apply auth middleware globally
// for this router so it doesn't need to be repeated on each route.
router.use(auth);

// ─── Subject Routes (all JWT-protected) ─────────────────────────────────────
router.get('/',    getAllSubjects);   // GET  /api/subjects         — list all
router.get('/:id', getSubjectById);  // GET  /api/subjects/:id     — single item
router.post('/',   createSubject);   // POST /api/subjects         — create
router.put('/:id', updateSubject);   // PUT  /api/subjects/:id     — update
router.delete('/:id', deleteSubject); // DELETE /api/subjects/:id  — remove

module.exports = router;
