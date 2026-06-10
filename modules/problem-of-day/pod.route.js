const express = require('express');
const router = express.Router();
const podController = require('./pod.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// GET /api/problem-of-day  — public
router.get('/', podController.getToday);

// GET /api/problem-of-day/history  — public
router.get('/history', podController.getHistory);

// POST /api/problem-of-day  — admin only
router.post('/', authMiddleware, roleMiddleware('ADMIN'), podController.setToday);

module.exports = router;
