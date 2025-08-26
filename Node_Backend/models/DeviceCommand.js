const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeviceCommand = sequelize.define('DeviceCommand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  command: {
    type: DataTypes.ENUM('lock', 'unlock'),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  executed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'device_commands',
  timestamps: true
});

module.exports = DeviceCommand;
