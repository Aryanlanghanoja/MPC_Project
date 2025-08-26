const Device = require('../models/Device');
const DeviceCommand = require('../models/DeviceCommand');
const Log = require('../models/Log');

class DeviceService {
  async registerDevice(deviceData) {
    try {
      const { device_id, name, location } = deviceData;

      // Check if device already exists
      const existingDevice = await Device.findOne({ where: { device_id } });
      if (existingDevice) {
        return 'Device already exists';
      }

      // Create device
      const device = await Device.create({
        device_id,
        name,
        location,
        status: 'offline'
      });

      // Log device registration (use a valid action from enum)
      await Log.create({
        device_id,
        action: 'heartbeat',
        status: 'success'
      });

      return device;
    } catch (error) {
      throw error;
    }
  }

  async getAllDevices() {
    try {
      return await Device.findAll({
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async getDeviceById(deviceId) {
    try {
      const device = await Device.findByPk(deviceId);
      if (!device) {
        return null;
      }
      return device;
    } catch (error) {
      throw error;
    }
  }

  async updateDeviceStatus(deviceId, status) {
    try {
      const device = await Device.findOne({ where: { device_id: deviceId } });
      if (!device) {
        return 'Device not found';
      }

      await device.update({ status });

      // Log status update
      await Log.create({
        device_id: deviceId,
        action: 'heartbeat',
        status: 'success'
      });

      return device;
    } catch (error) {
      throw error;
    }
  }

  async getDeviceCommand(deviceId) {
    try {
      // 1) Prefer explicit pending DeviceCommand
      const command = await DeviceCommand.findOne({
        where: {
          device_id: deviceId,
          executed: false,
          expires_at: {
            [require('sequelize').Op.gt]: new Date()
          }
        },
        order: [['createdAt', 'DESC']]
      });

      if (command) {
        // Mark command as executed to avoid re-sending
        await command.update({ executed: true });
        return command;
      }

      // 2) Fall back to current device status -> treat locked/unlocked as implicit command
      const device = await Device.findOne({ where: { device_id: deviceId } });
      if (!device) {
        return null;
      }

      if (device.status === 'locked' || device.status === 'unlocked') {
        // Return a lightweight, command-like object with required shape
        return {
          device_id: deviceId,
          command: device.status === 'locked' ? 'lock' : 'unlock',
          expires_at: null,
          executed: true
        };
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async createDeviceCommand(deviceId, command, expiresAt) {
    try {
      const deviceCommand = await DeviceCommand.create({
        device_id: deviceId,
        command,
        expires_at: expiresAt,
        executed: false
      });

      // Log command creation
      await Log.create({
        device_id: deviceId,
        action: command,
        status: 'pending'
      });

      return deviceCommand;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DeviceService();
