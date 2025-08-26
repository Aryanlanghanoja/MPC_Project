const cron = require('node-cron');
const scheduleService = require('../services/scheduleService');
const overrideService = require('../services/overrideService');

class Scheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting scheduler...');

    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        console.log('Running scheduled tasks...');
        
        // Check and execute schedules
        await scheduleService.checkAndExecuteSchedules();
        
        // Clean up expired overrides
        await overrideService.cleanupExpiredOverrides();
        
        console.log('Scheduled tasks completed');
      } catch (error) {
        console.error('Error in scheduled tasks:', error);
      }
    });

    this.isRunning = true;
    console.log('Scheduler started successfully');
  }

  stop() {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    console.log('Stopping scheduler...');
    this.isRunning = false;
    console.log('Scheduler stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new Scheduler();
