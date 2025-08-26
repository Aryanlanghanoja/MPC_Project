const Log = require('../models/Log');
const User = require('../models/User');
const Device = require('../models/Device');

class LogService {
  async createLog(logData) {
    try {
      const { device_id, user_id, action, status = 'pending' } = logData;

      const log = await Log.create({
        device_id,
        user_id,
        action,
        status,
        timestamp: new Date()
      });

      return log;
    } catch (error) {
      throw error;
    }
  }

  async getLogsByDevice(deviceId, limit = 100) {
    try {
      return await Log.findAll({
        where: { device_id: deviceId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogsByUser(userId, limit = 100) {
    try {
      return await Log.findAll({
        where: { user_id: userId },
        include: [{
          model: Device,
          attributes: ['device_id', 'name', 'location']
        }],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllLogs(limit = 100, offset = 0) {
    try {
      return await Log.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          },
          {
            model: Device,
            attributes: ['device_id', 'name', 'location']
          }
        ],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogsByDateRange(startDate, endDate, limit = 100) {
    try {
      return await Log.findAll({
        where: {
          timestamp: {
            [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          },
          {
            model: Device,
            attributes: ['device_id', 'name', 'location']
          }
        ],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogsByAction(action, limit = 100) {
    try {
      return await Log.findAll({
        where: { action },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          },
          {
            model: Device,
            attributes: ['device_id', 'name', 'location']
          }
        ],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogsByStatus(status, limit = 100) {
    try {
      return await Log.findAll({
        where: { status },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          },
          {
            model: Device,
            attributes: ['device_id', 'name', 'location']
          }
        ],
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit)
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogStatistics() {
    try {
      const totalLogs = await Log.count();
      const successLogs = await Log.count({ where: { status: 'success' } });
      const failedLogs = await Log.count({ where: { status: 'failed' } });
      const pendingLogs = await Log.count({ where: { status: 'pending' } });

      const actionStats = await Log.findAll({
        attributes: [
          'action',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['action']
      });

      return {
        total: totalLogs,
        success: successLogs,
        failed: failedLogs,
        pending: pendingLogs,
        actionStats
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LogService();
