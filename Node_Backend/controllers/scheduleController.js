const scheduleService = require('../services/scheduleService');
const { body, validationResult } = require('express-validator');

class ScheduleController {
  // Validation rules
  static createScheduleValidation = [
    body('device_id').trim().isLength({ min: 1 }).withMessage('Device ID is required'),
    body('day_of_week').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
    body('open_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Open time must be in HH:MM:SS format'),
    body('close_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Close time must be in HH:MM:SS format')
  ];

  static updateScheduleValidation = [
    body('day_of_week').optional().isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
    body('open_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Open time must be in HH:MM:SS format'),
    body('close_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Close time must be in HH:MM:SS format')
  ];

  static async createSchedule(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const schedule = await scheduleService.createSchedule(req.body);
      res.status(201).json({
        message: 'Schedule created successfully',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSchedule(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const schedule = await scheduleService.updateSchedule(req.params.scheduleId, req.body);
      res.status(200).json({
        message: 'Schedule updated successfully',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSchedule(req, res, next) {
    try {
      const result = await scheduleService.deleteSchedule(req.params.scheduleId);
      res.status(200).json({
        message: 'Schedule deleted successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSchedulesByDevice(req, res, next) {
    try {
      const schedules = await scheduleService.getSchedulesByDevice(req.params.deviceId);
      res.status(200).json({
        message: 'Schedules retrieved successfully',
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllSchedules(req, res, next) {
    try {
      const schedules = await scheduleService.getAllSchedules();
      res.status(200).json({
        message: 'All schedules retrieved successfully',
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  }

  static async getScheduleById(req, res, next) {
    try {
      const schedule = await scheduleService.getScheduleById(req.params.scheduleId);
      if (!schedule) {
        return res.status(404).json({
          error: 'Schedule not found'
        });
      }
      res.status(200).json({
        message: 'Schedule retrieved successfully',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScheduleController;
