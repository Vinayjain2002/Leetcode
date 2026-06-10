const express = require('express');
const router = express.Router();
const coinController = require('./coin.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/coins  — balance + recent transactions
router.get('/', coinController.getWallet);

// GET /api/coins/transactions  — paginated transaction history
router.get('/transactions', coinController.getTransactions);

module.exports = router;