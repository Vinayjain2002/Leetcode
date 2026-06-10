const express = require('express');
const router = express.Router();
const contestController = require('./contest.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// GET /api/contests
router.get('/', contestController.list);

// GET /api/contests/:id
router.get('/:id', contestController.getOne);

// GET /api/contests/:id/leaderboard
router.get('/:id/leaderboard', contestController.getLeaderboard);

// POST /api/contests/:id/join  — authenticated
router.post('/:id/join', authMiddleware, contestController.join);

// ── Admin-only ──
router.use(authMiddleware, roleMiddleware('ADMIN'));

// POST /api/contests
router.post('/', contestController.create);

// PATCH /api/contests/:id
router.patch('/:id', contestController.update);

// DELETE /api/contests/:id
router.delete('/:id', contestController.remove);

// POST /api/contests/:id/problems
router.post('/:id/problems', contestController.addProblem);

// DELETE /api/contests/:id/problems/:problemId
router.delete('/:id/problems/:problemId', contestController.removeProblem);

module.exports = router;
