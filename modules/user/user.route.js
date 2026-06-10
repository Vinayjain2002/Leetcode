const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// GET /api/users/:id  — public profile
router.get('/:id', userController.getProfile);

// All routes below require authentication
router.use(authMiddleware);

// PATCH /api/users/me
router.patch('/me', userController.updateProfile);

// GET /api/users/me/streak
router.get('/me/streak', userController.getStreak);

// POST /api/users/me/education
router.post('/me/education', userController.addEducation);

// DELETE /api/users/me/education/:id
router.delete('/me/education/:id', userController.deleteEducation);

// POST /api/users/me/experience
router.post('/me/experience', userController.addExperience);

// DELETE /api/users/me/experience/:id
router.delete('/me/experience/:id', userController.deleteExperience);

module.exports = router;
