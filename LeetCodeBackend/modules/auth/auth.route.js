const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('./auth.validation');
const validate = require('../../utils/validateRequest');

// POST /api/auth/register
router.post('/register', registerValidation, validate, authController.register);

// POST /api/auth/login
router.post('/login', loginValidation, validate, authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// GET /api/auth/profile
router.get('/profile', authMiddleware, authController.profile);

module.exports = router;
