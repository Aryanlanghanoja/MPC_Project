const Schedule = require('../models/Schedule');
const DeviceCommand = require('../models/DeviceCommand');
const Log = require('../models/Log');

class ScheduleService {
  async createSchedule(scheduleData) {
    try {
      const { device_id, day_of_week, open_time, close_time } = scheduleData;

      // Check if schedule already exists for this device and day
      const existingSchedule = await Schedule.findOne({
        where: { device_id, day_of_week }
      });

      if (existingSchedule) {
        throw new Error('Schedule already exists for this device and day');
      }

      const schedule = await Schedule.create({
        device_id,
        day_of_week,
        open_time,
        close_time
      });

      // Log schedule creation
      await Log.create({
        device_id,
        action: 'schedule',
        status: 'success'
      });

      return schedule;
    } catch (error) {
      throw error;
    }
  }

  async updateSchedule(scheduleId, updateData) {
    try {
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      await schedule.update(updateData);

      // Log schedule update
      await Log.create({
        device_id: schedule.device_id,
        action: 'schedule',
        status: 'success'
      });

      return schedule;
    } catch (error) {
      throw error;
    }
  }

  async deleteSchedule(scheduleId) {
    try {
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      const deviceId = schedule.device_id;
      await schedule.destroy();

      // Log schedule deletion
      await Log.create({
        device_id: deviceId,
        action: 'schedule',
        status: 'success'
      });

      return { message: 'Schedule deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getSchedulesByDevice(deviceId) {
    try {
      return await Schedule.findAll({
        where: { device_id: deviceId },
        order: [['day_of_week', 'ASC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllSchedules() {
    try {
      return await Schedule.findAll({
        order: [['device_id', 'ASC'], ['day_of_week', 'ASC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async checkAndExecuteSchedules() {
    try {
      const now = new Date();
      const currentDay = now.getDay(); // 0-6 (Sunday-Saturday)
      const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS

      // Get all schedules for current day
      const schedules = await Schedule.findAll({
        where: { day_of_week: currentDay }
      });

      for (const schedule of schedules) {
        const openTime = schedule.open_time;
        const closeTime = schedule.close_time;

        // Check if it's time to open or close
        if (currentTime === openTime) {
          await this.createDeviceCommand(schedule.device_id, 'unlock', new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes
        } else if (currentTime === closeTime) {
          await this.createDeviceCommand(schedule.device_id, 'lock', new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes
        }
      }
    } catch (error) {
      console.error('Error executing schedules:', error);
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

module.exports = new ScheduleService();
