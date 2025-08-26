const deviceService = require('../services/deviceService');
const { body, validationResult } = require('express-validator');

class DeviceController {
  // Validation rules
  static registerDeviceValidation = [
    body('device_id').trim().isLength({ min: 1 }).withMessage('Device ID is required'),
    body('name').trim().isLength({ min: 1 }).withMessage('Device name is required'),
    body('location').trim().isLength({ min: 1 }).withMessage('Device location is required')
  ];

  static updateStatusValidation = [
    body('status').isIn(['online', 'offline', 'locked', 'unlocked']).withMessage('Invalid status')
  ];

  static async registerDevice(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const device = await deviceService.registerDevice(req.body);

      if(device === 'Device already exists') {
        return res.status(409).json({
          message: 'Device already exists'
        });
      }

        res.status(201).json({
        message: 'Device registered successfully',
        data: device
      });
      
    } catch (error) {
      next(error);
    }
  }

  static async getAllDevices(req, res, next) {
    try {
      const devices = await deviceService.getAllDevices();
      res.status(200).json({
        message: 'Devices retrieved successfully',
        data: devices
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDeviceById(req, res, next) {
    try {
      const device = await deviceService.getDeviceById(req.params.deviceId);
      if (!device) {
        return res.status(404).json({
          message: 'Device not found'
        });
      }
      res.status(200).json({
        message: 'Device retrieved successfully',
        data: device
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateDeviceStatus(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const device = await deviceService.updateDeviceStatus(
        req.params.deviceId,
        req.body.status
      );
      if(device === 'Device not found') {
        return res.status(404).json({
          message: 'Device not found'
        });
      }
      res.status(200).json({
        message: 'Device status updated successfully',
        data: device
      });
    } catch (error) {
      next(error);
    }
  }

  // Device communication endpoint (heartbeat)
  static async deviceHeartbeat(req, res, next) {
    try {
      const { device_id, status } = req.body;

      if (!device_id) {
        return res.status(400).json({
          error: 'Device ID is required'
        });
      }

      // Update device status
      await deviceService.updateDeviceStatus(device_id, status || 'online');

      // Get pending command for device
      const command = await deviceService.getDeviceCommand(device_id);

      res.status(200).json({
        message: 'Heartbeat received',
        data: {
          command: command ? command.command : null,
          expires_at: command ? command.expires_at : null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Manual device command
  static async sendDeviceCommand(req, res, next) {
    try {
      const { device_id, command, expires_at } = req.body;

      if (!device_id || !command) {
        return res.status(400).json({
          error: 'Device ID and command are required'
        });
      }

      const deviceCommand = await deviceService.createDeviceCommand(
        device_id,
        command,
        expires_at || new Date(Date.now() + 5 * 60 * 1000) // Default 5 minutes
      );

      res.status(201).json({
        message: 'Device command sent successfully',
        data: deviceCommand
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeviceController;
