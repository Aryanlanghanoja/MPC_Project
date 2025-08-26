const express = require('express');
const router = express.Router();
const OverrideController = require('../controllers/overrideController');
const { authenticateToken, requireFaculty, requireAdmin } = require('../middleware/auth');

// POST /overrides - Create a new override (Faculty only)
router.post('/', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.createOverrideValidation, 
  OverrideController.createOverride
);

// GET /overrides - Get all active overrides (Admin/Faculty)
router.get('/', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.getAllActiveOverrides
);

// GET /overrides/my - Get user's overrides (Faculty)
router.get('/my', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.getOverridesByUser
);

// GET /overrides/:overrideId - Get override by ID (Admin/Faculty)
router.get('/:overrideId', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.getOverrideById
);

// DELETE /overrides/:overrideId - Delete override (Admin/Faculty)
router.delete('/:overrideId', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.deleteOverride
);

// GET /overrides/device/:deviceId - Get overrides by device (Admin/Faculty)
router.get('/device/:deviceId', 
  authenticateToken, 
  requireFaculty, 
  OverrideController.getOverridesByDevice
);

module.exports = router;
