const logService = require('../services/logService');

class LogController {
  static async getLogsByDevice(req, res, next) {
    try {
      const { limit = 100 } = req.query;
      const logs = await logService.getLogsByDevice(req.params.deviceId, limit);
      res.status(200).json({
        message: 'Device logs retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogsByUser(req, res, next) {
    try {
      const { limit = 100 } = req.query;
      const logs = await logService.getLogsByUser(req.params.userId, limit);
      res.status(200).json({
        message: 'User logs retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllLogs(req, res, next) {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const logs = await logService.getAllLogs(limit, offset);
      res.status(200).json({
        message: 'All logs retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogsByDateRange(req, res, next) {
    try {
      const { startDate, endDate, limit = 100 } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Start date and end date are required'
        });
      }

      const logs = await logService.getLogsByDateRange(startDate, endDate, limit);
      res.status(200).json({
        message: 'Logs by date range retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogsByAction(req, res, next) {
    try {
      const { limit = 100 } = req.query;
      const logs = await logService.getLogsByAction(req.params.action, limit);
      res.status(200).json({
        message: 'Logs by action retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogsByStatus(req, res, next) {
    try {
      const { limit = 100 } = req.query;
      const logs = await logService.getLogsByStatus(req.params.status, limit);
      res.status(200).json({
        message: 'Logs by status retrieved successfully',
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogStatistics(req, res, next) {
    try {
      const statistics = await logService.getLogStatistics();
      res.status(200).json({
        message: 'Log statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LogController;
