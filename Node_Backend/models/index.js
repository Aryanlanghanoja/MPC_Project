const User = require('./User');
const Device = require('./Device');
const Schedule = require('./Schedule');
const Override = require('./Override');
const DeviceCommand = require('./DeviceCommand');
const Log = require('./Log');

// Define associations
User.hasMany(Override, { foreignKey: 'user_id' });
Override.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Log, { foreignKey: 'user_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

Device.hasMany(Schedule, { foreignKey: 'device_id', sourceKey: 'device_id' });
Schedule.belongsTo(Device, { foreignKey: 'device_id', targetKey: 'device_id' });

Device.hasMany(Override, { foreignKey: 'device_id', sourceKey: 'device_id' });
Override.belongsTo(Device, { foreignKey: 'device_id', targetKey: 'device_id' });

Device.hasMany(DeviceCommand, { foreignKey: 'device_id', sourceKey: 'device_id' });
DeviceCommand.belongsTo(Device, { foreignKey: 'device_id', targetKey: 'device_id' });

Device.hasMany(Log, { foreignKey: 'device_id', sourceKey: 'device_id' });
Log.belongsTo(Device, { foreignKey: 'device_id', targetKey: 'device_id' });

module.exports = {
  User,
  Device,
  Schedule,
  Override,
  DeviceCommand,
  Log
};
