const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/notifications
router.get('/', notificationController.list);

// PATCH /api/notifications/read-all
router.patch('/read-all', notificationController.markAllRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', notificationController.markRead);

// DELETE /api/notifications/:id
router.delete('/:id', notificationController.remove);

module.exports = router;
