const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Can be null for system actions
  },
  action: {
    type: DataTypes.ENUM('lock', 'unlock', 'override', 'schedule', 'heartbeat'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('success', 'failed', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'logs',
  timestamps: true
});

module.exports = Log;
