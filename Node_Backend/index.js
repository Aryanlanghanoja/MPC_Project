require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

// Import models to establish associations
require('./models/index');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const deviceCommRoutes = require('./routes/deviceComm.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const overrideRoutes = require('./routes/override.routes');
const logRoutes = require('./routes/log.routes');

// Import scheduler
const scheduler = require('./utils/scheduler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/overrides', overrideRoutes);
app.use('/api/logs', logRoutes);

// Device communication endpoint (separate from device routes)
app.use('/api/device-comm', deviceCommRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Door Lock Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      devices: '/api/devices',
      schedules: '/api/schedules',
      overrides: '/api/overrides',
      logs: '/api/logs',
      deviceComm: '/api/device-comm'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');

    // Start scheduler
    scheduler.start();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Smart Door Lock Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  scheduler.stop();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  scheduler.stop();
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;