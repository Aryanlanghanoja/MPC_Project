const authService = require('../services/authService');
const { body, validationResult } = require('express-validator');

class AuthController {
  // Validation rules
  static registerValidation = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'faculty']).withMessage('Role must be admin or faculty')
  ];

  static loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ];

  static async register(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const result = await authService.login(req.body);
      res.status(200).json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
