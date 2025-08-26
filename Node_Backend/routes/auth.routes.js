const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /auth/register - Register a new user
router.post('/register', AuthController.registerValidation, AuthController.register);

// POST /auth/login - Login user
router.post('/login', AuthController.loginValidation, AuthController.login);

// GET /auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;
