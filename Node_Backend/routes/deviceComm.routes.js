const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');

// POST /device-comm/heartbeat - Device heartbeat (no auth required)
router.post('/heartbeat', DeviceController.deviceHeartbeat);

module.exports = router;
