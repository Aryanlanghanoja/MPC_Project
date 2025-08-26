const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /logs - Get all logs (Admin only)
router.get('/', 
  authenticateToken, 
  requireAdmin, 
  LogController.getAllLogs
);

// GET /logs/statistics - Get log statistics (Admin only)
router.get('/statistics', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogStatistics
);

// GET /logs/device/:deviceId - Get logs by device (Admin only)
router.get('/device/:deviceId', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogsByDevice
);

// GET /logs/user/:userId - Get logs by user (Admin only)
router.get('/user/:userId', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogsByUser
);

// GET /logs/action/:action - Get logs by action (Admin only)
router.get('/action/:action', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogsByAction
);

// GET /logs/status/:status - Get logs by status (Admin only)
router.get('/status/:status', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogsByStatus
);

// GET /logs/range - Get logs by date range (Admin only)
router.get('/range', 
  authenticateToken, 
  requireAdmin, 
  LogController.getLogsByDateRange
);

module.exports = router;
