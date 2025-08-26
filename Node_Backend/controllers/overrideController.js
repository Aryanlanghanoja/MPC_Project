const overrideService = require('../services/overrideService');
const { body, validationResult } = require('express-validator');

class OverrideController {
  // Validation rules
  static createOverrideValidation = [
    body('device_id').trim().isLength({ min: 1 }).withMessage('Device ID is required'),
    body('action').isIn(['lock', 'unlock']).withMessage('Action must be lock or unlock'),
    body('expires_at').isISO8601().withMessage('Expires at must be a valid date')
  ];

  static async createOverride(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const overrideData = {
        ...req.body,
        user_id: req.user.id
      };

      const override = await overrideService.createOverride(overrideData);
      res.status(201).json({
        message: 'Override created successfully',
        data: override
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOverridesByDevice(req, res, next) {
    try {
      const overrides = await overrideService.getOverridesByDevice(req.params.deviceId);
      res.status(200).json({
        message: 'Device overrides retrieved successfully',
        data: overrides
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOverridesByUser(req, res, next) {
    try {
      const overrides = await overrideService.getOverridesByUser(req.user.id);
      res.status(200).json({
        message: 'User overrides retrieved successfully',
        data: overrides
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllActiveOverrides(req, res, next) {
    try {
      const overrides = await overrideService.getAllActiveOverrides();
      res.status(200).json({
        message: 'All active overrides retrieved successfully',
        data: overrides
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOverride(req, res, next) {
    try {
      const result = await overrideService.deleteOverride(req.params.overrideId, req.user.id);
      res.status(200).json({
        message: 'Override deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOverrideById(req, res, next) {
    try {
      const override = await overrideService.getOverrideById(req.params.overrideId);
      if (!override) {
        return res.status(404).json({
          error: 'Override not found'
        });
      }
      res.status(200).json({
        message: 'Override retrieved successfully',
        data: override
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OverrideController;
