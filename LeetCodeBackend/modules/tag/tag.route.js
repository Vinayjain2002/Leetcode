const express = require('express');
const router = express.Router();
const tagController = require('./tag.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// GET /api/tags  — public
router.get('/', tagController.list);

// POST /api/tags  — admin only
router.post('/', authMiddleware, roleMiddleware('ADMIN'), tagController.create);

// DELETE /api/tags/:id  — admin only
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), tagController.remove);

module.exports = router;
