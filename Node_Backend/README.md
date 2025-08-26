# Smart Door Lock Backend

A comprehensive Node.js backend API for managing smart door locks with authentication, scheduling, overrides, and real-time device communication.

## Features

- 🔐 **JWT Authentication** with role-based access control (Admin & Faculty)
- 🏢 **Device Management** - Register and manage smart door locks
- ⏰ **Schedule Management** - Set automatic door lock/unlock schedules for labs
- 🎛️ **Faculty Overrides** - Allow faculty to override schedules temporarily
- 📡 **Real-time Communication** - Device heartbeat and command system
- 📊 **Comprehensive Logging** - Track all device activities
- 🤖 **Automated Scheduler** - Execute schedules and clean up expired overrides
- 🔒 **Security** - Helmet, CORS, input validation, and error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Scheduling**: node-cron
- **Security**: Helmet, CORS
- **Validation**: express-validator

## Role-Based Access Control

### Admin Role
- **Device Management**: Register new devices, update device status
- **Schedule Management**: Create, update, delete schedules for labs/devices
- **Log Management**: View all logs and statistics
- **Override Management**: View and manage all overrides

### Faculty Role
- **Device Control**: View all devices with their status, send manual commands
- **Schedule Viewing**: View schedules for labs/devices
- **Override Management**: Create temporary overrides for device access

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd Node_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp sample.env .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   # Database
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=smart_door_lock

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server
   PORT=3000
   NODE_ENV=development

   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify the server is running**
   ```bash
   curl http://localhost:3000/health
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (admin/faculty)
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Device Management
- `POST /api/devices/register` - Register new device (Admin only)
- `GET /api/devices` - Get all devices (Admin/Faculty)
- `GET /api/devices/:deviceId` - Get device by ID (Admin/Faculty)
- `PUT /api/devices/:deviceId/status` - Update device status (Admin only)
- `POST /api/devices/command` - Send manual command (Admin/Faculty)

### Device Communication
- `POST /api/device-comm/heartbeat` - Device heartbeat (no auth)

### Schedule Management
- `POST /api/schedules` - Create schedule (Admin only)
- `GET /api/schedules` - Get all schedules (Admin/Faculty)
- `PUT /api/schedules/:scheduleId` - Update schedule (Admin only)
- `DELETE /api/schedules/:scheduleId` - Delete schedule (Admin only)
- `GET /api/schedules/device/:deviceId` - Get schedules by device (Admin/Faculty)

### Override Management
- `POST /api/overrides` - Create override (Faculty only)
- `GET /api/overrides` - Get all active overrides (Admin/Faculty)
- `GET /api/overrides/my` - Get user's overrides (Faculty)
- `DELETE /api/overrides/:overrideId` - Delete override (Admin/Faculty)

### Log Management (Admin only)
- `GET /api/logs` - Get all logs
- `GET /api/logs/statistics` - Get log statistics
- `GET /api/logs/device/:deviceId` - Get logs by device
- `GET /api/logs/user/:userId` - Get logs by user

## Database Schema

The application automatically creates these tables:

### Users
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `passwordHash` - Bcrypt hashed password
- `role` - User role (admin, faculty)

### Devices
- `id` - Primary key
- `device_id` - Unique device identifier
- `name` - Device name (e.g., "Computer Lab 1")
- `location` - Device location
- `status` - Current status (online, offline, locked, unlocked)

### Schedules
- `id` - Primary key
- `device_id` - Device reference
- `day_of_week` - Day of week (0-6)
- `open_time` - Opening time (HH:MM:SS)
- `close_time` - Closing time (HH:MM:SS)

### Overrides
- `id` - Primary key
- `device_id` - Device reference
- `user_id` - User who created override
- `action` - Action (lock/unlock)
- `expires_at` - Expiration timestamp

### Device Commands
- `id` - Primary key
- `device_id` - Device reference
- `command` - Command to execute
- `expires_at` - Command expiration
- `executed` - Execution status

### Logs
- `id` - Primary key
- `device_id` - Device reference
- `user_id` - User reference (optional)
- `action` - Action performed
- `timestamp` - Action timestamp
- `status` - Action status

## Usage Examples

### 1. Register an Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Register a Faculty User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Faculty User",
    "email": "faculty@example.com",
    "password": "password123",
    "role": "faculty"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 4. Register a Device (Admin only)
```bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "device_id": "LAB_001",
    "name": "Computer Lab 1",
    "location": "Building A, Floor 1"
  }'
```

### 5. Create a Schedule (Admin only)
```bash
curl -X POST http://localhost:3000/api/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "device_id": "LAB_001",
    "day_of_week": 1,
    "open_time": "08:00:00",
    "close_time": "18:00:00"
  }'
```

### 6. Create an Override (Faculty only)
```bash
curl -X POST http://localhost:3000/api/overrides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "device_id": "LAB_001",
    "action": "unlock",
    "expires_at": "2024-01-01T02:00:00.000Z"
  }'
```

### 7. Send Device Command (Faculty)
```bash
curl -X POST http://localhost:3000/api/devices/command \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "device_id": "LAB_001",
    "command": "unlock"
  }'
```

### 8. Device Heartbeat
```bash
curl -X POST http://localhost:3000/api/device-comm/heartbeat \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "LAB_001",
    "status": "online"
  }'
```

## Kotlin Integration

For Kotlin app integration, see the complete API documentation in `API_DOCUMENTATION.md`.

Key endpoints for Kotlin:
- **Authentication**: `/api/auth/login` and `/api/auth/register`
- **Device Communication**: `/api/device-comm/heartbeat`
- **Faculty Overrides**: `/api/overrides` (for faculty)
- **Device Commands**: `/api/devices/command` (for faculty)
- **Schedule Viewing**: `/api/schedules` (for viewing)

## Development

### Project Structure
```
Node_Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── deviceController.js  # Device management
│   ├── scheduleController.js # Schedule management
│   ├── overrideController.js # Override management
│   └── logController.js     # Log management
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User model
│   ├── Device.js           # Device model
│   ├── Schedule.js         # Schedule model
│   ├── Override.js         # Override model
│   ├── DeviceCommand.js    # Device command model
│   ├── Log.js              # Log model
│   └── index.js            # Model associations
├── routes/
│   ├── auth.routes.js      # Authentication routes
│   ├── device.routes.js    # Device routes
│   ├── schedule.routes.js  # Schedule routes
│   ├── override.routes.js  # Override routes
│   └── log.routes.js       # Log routes
├── services/
│   ├── authService.js      # Authentication business logic
│   ├── deviceService.js    # Device business logic
│   ├── scheduleService.js  # Schedule business logic
│   ├── overrideService.js  # Override business logic
│   └── logService.js       # Log business logic
├── utils/
│   └── scheduler.js        # Automated scheduler
├── index.js                # Main application file
├── package.json            # Dependencies
└── README.md              # This file
```

### Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start in development mode with auto-restart
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for admin and faculty
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin resource sharing
- **Helmet Security** - Security headers and protection
- **Error Handling** - Secure error responses without sensitive data

## Monitoring and Logging

- **Health Check Endpoint** - `/health` for monitoring
- **Comprehensive Logging** - All actions are logged with user and device context
- **Statistics Endpoint** - `/api/logs/statistics` for analytics (Admin only)
- **Real-time Status** - Device status tracking and heartbeat monitoring

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
ALLOWED_ORIGINS=https://yourdomain.com
```

### Database Setup
1. Create a PostgreSQL database
2. Update environment variables
3. The application will automatically create tables on first run

### Process Management
For production, use a process manager like PM2:
```bash
npm install -g pm2
pm2 start index.js --name "smart-door-lock-backend"
pm2 startup
pm2 save
```

## Support

For detailed API documentation, see `API_DOCUMENTATION.md`.

For issues and questions, please refer to the project guidelines in `generation_guidelines (1).md`.
