const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');
const { authenticateToken, requireAdmin, requireFaculty } = require('../middleware/auth');

// POST /schedules - Create a new schedule (Admin only)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  ScheduleController.createScheduleValidation, 
  ScheduleController.createSchedule
);

// GET /schedules - Get all schedules (Admin/Faculty)
router.get('/', 
  authenticateToken, 
  requireFaculty, 
  ScheduleController.getAllSchedules
);

// GET /schedules/:scheduleId - Get schedule by ID (Admin/Faculty)
router.get('/:scheduleId', 
  authenticateToken, 
  requireFaculty, 
  ScheduleController.getScheduleById
);

// PUT /schedules/:scheduleId - Update schedule (Admin only)
router.put('/:scheduleId', 
  authenticateToken, 
  requireAdmin, 
  ScheduleController.updateScheduleValidation, 
  ScheduleController.updateSchedule
);

// DELETE /schedules/:scheduleId - Delete schedule (Admin only)
router.delete('/:scheduleId', 
  authenticateToken, 
  requireAdmin, 
  ScheduleController.deleteSchedule
);

// GET /schedules/device/:deviceId - Get schedules by device (Admin/Faculty)
router.get('/device/:deviceId', 
  authenticateToken, 
  requireFaculty, 
  ScheduleController.getSchedulesByDevice
);

module.exports = router;
