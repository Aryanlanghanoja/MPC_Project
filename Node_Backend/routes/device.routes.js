const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const { authenticateToken, requireAdmin, requireFaculty } = require('../middleware/auth');

// POST /devices/register - Register a new device (Admin only)
router.post('/register', 
  authenticateToken, 
  requireAdmin, 
  DeviceController.registerDeviceValidation, 
  DeviceController.registerDevice
);

// GET /devices - Get all devices (Admin/Faculty)
router.get('/', 
  authenticateToken, 
  requireFaculty, 
  DeviceController.getAllDevices
);

// GET /devices/:deviceId - Get device by ID (Admin/Faculty)
router.get('/:deviceId', 
  authenticateToken, 
  requireFaculty, 
  DeviceController.getDeviceById
);

// PUT /devices/:deviceId/status - Update device status (Admin only)
router.put('/:deviceId/status', 
  authenticateToken, 
  requireAdmin, 
  DeviceController.updateStatusValidation, 
  DeviceController.updateDeviceStatus
);

// POST /devices/command - Send manual device command (Admin/Faculty)
router.post('/command', 
  authenticateToken, 
  requireFaculty, 
  DeviceController.sendDeviceCommand
);

module.exports = router;
