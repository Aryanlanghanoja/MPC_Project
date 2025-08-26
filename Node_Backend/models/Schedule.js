const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.INTEGER, // 0-6 (Sunday-Saturday)
    allowNull: false,
    validate: {
      min: 0,
      max: 6
    }
  },
  open_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  close_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: true
});

module.exports = Schedule;
