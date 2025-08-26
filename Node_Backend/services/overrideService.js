const Override = require('../models/Override');
const DeviceCommand = require('../models/DeviceCommand');
const Log = require('../models/Log');
const User = require('../models/User');

class OverrideService {
  async createOverride(overrideData) {
    try {
      const { device_id, user_id, action, expires_at } = overrideData;

      // Validate user exists and has faculty role
      const user = await User.findByPk(user_id);
      if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
        throw new Error('Only faculty or admin can create overrides');
      }

      // Create override (expires_at here represents the time the action should be applied)
      const override = await Override.create({
        device_id,
        user_id,
        action,
        expires_at: new Date(expires_at)
      });

      // NOTE: Delayed execution: device command will be created by scheduler when expires_at <= NOW
      await Log.create({
        device_id,
        user_id,
        action: 'override',
        status: 'success'
      });

      return override;
    } catch (error) {
      throw error;
    }
  }

  async getOverridesByDevice(deviceId) {
    try {
      return await Override.findAll({
        where: { 
          device_id: deviceId,
          expires_at: {
            [require('sequelize').Op.gt]: new Date()
          }
        },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async getOverridesByUser(userId) {
    try {
      return await Override.findAll({
        where: { 
          user_id: userId,
          expires_at: {
            [require('sequelize').Op.gt]: new Date()
          }
        },
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveOverrides() {
    try {
      return await Override.findAll({
        where: {
          expires_at: {
            [require('sequelize').Op.gt]: new Date()
          }
        },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteOverride(overrideId, userId) {
    try {
      const override = await Override.findByPk(overrideId);
      if (!override) {
        throw new Error('Override not found');
      }

      // Check if user is the creator or an admin
      const user = await User.findByPk(userId);
      if (!user || (user.role !== 'admin' && override.user_id !== userId)) {
        throw new Error('Unauthorized to delete this override');
      }

      await override.destroy();

      await Log.create({
        device_id: override.device_id,
        user_id: userId,
        action: 'override',
        status: 'success'
      });

      return { message: 'Override deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async triggerDueOverrides() {
    try {
      const now = new Date();
      const dueOverrides = await Override.findAll({
        where: {
          expires_at: {
            [require('sequelize').Op.lte]: now
          }
        }
      });

      for (const ov of dueOverrides) {
        // Create a device command valid for 5 minutes from now
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await DeviceCommand.create({
          device_id: ov.device_id,
          command: ov.action, // lock or unlock
          expires_at: expiresAt,
          executed: false
        });

        await Log.create({
          device_id: ov.device_id,
          user_id: ov.user_id,
          action: ov.action,
          status: 'pending'
        });

        // Remove override after triggering to avoid repeated commands
        await ov.destroy();
      }

      return { triggered: dueOverrides.length };
    } catch (error) {
      console.error('Error triggering due overrides:', error);
    }
  }

  async cleanupExpiredOverrides() {
    try {
      const expiredOverrides = await Override.findAll({
        where: {
          expires_at: {
            [require('sequelize').Op.lt]: new Date(Date.now() - 60 * 1000) // older than 1 min past due
          }
        }
      });

      for (const override of expiredOverrides) {
        await override.destroy();
      }

      return { message: `Cleaned up ${expiredOverrides.length} expired overrides` };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OverrideService();
