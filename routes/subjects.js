const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');

// All routes are protected (require authentication)
router.get('/', auth, subjectController.getAllSubjects);
router.get('/:id', auth, subjectController.getSubjectById);
router.post('/', auth, subjectController.createSubject);
router.put('/:id', auth, subjectController.updateSubject);
router.delete('/:id', auth, subjectController.deleteSubject);

module.exports = router;
