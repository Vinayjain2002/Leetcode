const express = require('express');
const router = express.Router();
const submissionController = require('./submission.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { submitValidation, runValidation } = require('./submission.validation');
const validate = require('../../utils/validateRequest');

router.use(authMiddleware);

// POST /api/submissions  — submit code
router.post('/', submitValidation, validate, submissionController.submit);

// POST /api/submissions/run  — run against sample cases only
router.post('/run', runValidation, validate, submissionController.runCode);

// GET /api/submissions  — my submission history
router.get('/', submissionController.list);

// GET /api/submissions/:id  — single submission detail
router.get('/:id', submissionController.getOne);

module.exports = router;
