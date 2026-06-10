const express = require('express');
const router = express.Router();
const leaderboardController = require('./leaderboard.controller');

// GET /api/leaderboard  — top users by problems solved
router.get('/', leaderboardController.byProblems);

// GET /api/leaderboard/coins  — top users by coin balance
router.get('/coins', leaderboardController.byCoins);

module.exports = router;
