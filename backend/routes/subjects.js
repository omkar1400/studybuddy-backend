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

// All subject operations require authentication
router.use(auth);

// Subject management endpoints
router.get('/',    getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/',   createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
