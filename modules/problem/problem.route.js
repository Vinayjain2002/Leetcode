const express = require('express');
const router = express.Router();
const problemController = require('./problem.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// GET /api/problems  — public list with filters
router.get('/', problemController.list);

// GET /api/problems/:id  — public detail
router.get('/:id', problemController.getOne);

// GET /api/problems/:id/testcases  — sample cases public, all for admin
router.get('/:id/testcases', authMiddleware, problemController.getTestCases);

// ── Admin-only routes ──
router.use(authMiddleware, roleMiddleware('ADMIN'));

// POST /api/problems
router.post('/', problemController.create);

// PATCH /api/problems/:id
router.patch('/:id', problemController.update);

// DELETE /api/problems/:id
router.delete('/:id', problemController.remove);

// POST /api/problems/:id/tags
router.post('/:id/tags', problemController.addTag);

// DELETE /api/problems/:id/tags/:tagId
router.delete('/:id/tags/:tagId', problemController.removeTag);

// POST /api/problems/:id/testcases
router.post('/:id/testcases', problemController.addTestCase);

// DELETE /api/problems/:id/testcases/:tcId
router.delete('/:id/testcases/:tcId', problemController.deleteTestCase);

module.exports = router;
