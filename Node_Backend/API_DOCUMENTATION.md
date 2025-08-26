# Smart Door Lock Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

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

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "faculty" // Optional: "admin" or "faculty" (default: "faculty")
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "faculty"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "faculty"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Get User Profile
**GET** `/auth/profile` *(Protected)*

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "role": "faculty"
  }
}
```

---

## 2. Device Management Endpoints

### 2.1 Register Device
**POST** `/devices/register` *(Admin only)*

**Request Body:**
```json
{
  "device_id": "LAB_001",
  "name": "Computer Lab 1",
  "location": "Building A, Floor 1"
}
```

**Response:**
```json
{
  "message": "Device registered successfully",
  "data": {
    "id": 1,
    "device_id": "LAB_001",
    "name": "Computer Lab 1",
    "location": "Building A, Floor 1",
    "status": "offline",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.2 Get All Devices
**GET** `/devices` *(Admin/Faculty)*

**Response:**
```json
{
  "message": "Devices retrieved successfully",
  "data": [
    {
      "id": 1,
      "device_id": "LAB_001",
      "name": "Computer Lab 1",
      "location": "Building A, Floor 1",
      "status": "online"
    }
  ]
}
```

### 2.3 Get Device by ID
**GET** `/devices/:deviceId` *(Admin/Faculty)*

**Response:**
```json
{
  "message": "Device retrieved successfully",
  "data": {
    "id": 1,
    "device_id": "LAB_001",
    "name": "Computer Lab 1",
    "location": "Building A, Floor 1",
    "status": "online"
  }
}
```

### 2.4 Update Device Status
**PUT** `/devices/:deviceId/status` *(Admin only)*

**Request Body:**
```json
{
  "status": "online" // "online", "offline", "locked", "unlocked"
}
```

### 2.5 Send Manual Device Command
**POST** `/devices/command` *(Admin/Faculty)*

**Request Body:**
```json
{
  "device_id": "LAB_001",
  "command": "lock", // "lock" or "unlock"
  "expires_at": "2024-01-01T01:00:00.000Z" // Optional, default: 5 minutes
}
```

---

## 3. Device Communication Endpoints

### 3.1 Device Heartbeat
**POST** `/device-comm/heartbeat` *(No authentication required)*

**Request Body:**
```json
{
  "device_id": "LAB_001",
  "status": "online" // Optional: "online", "offline", "locked", "unlocked"
}
```

**Response:**
```json
{
  "message": "Heartbeat received",
  "data": {
    "command": "lock", // null if no pending command
    "expires_at": "2024-01-01T01:00:00.000Z" // null if no pending command
  }
}
```

---

## 4. Schedule Management Endpoints

### 4.1 Create Schedule
**POST** `/schedules` *(Admin only)*

**Request Body:**
```json
{
  "device_id": "LAB_001",
  "day_of_week": 1, // 0-6 (Sunday-Saturday)
  "open_time": "08:00:00", // HH:MM:SS format
  "close_time": "18:00:00" // HH:MM:SS format
}
```

**Response:**
```json
{
  "message": "Schedule created successfully",
  "data": {
    "id": 1,
    "device_id": "LAB_001",
    "day_of_week": 1,
    "open_time": "08:00:00",
    "close_time": "18:00:00"
  }
}
```

### 4.2 Get All Schedules
**GET** `/schedules` *(Admin/Faculty)*

### 4.3 Get Schedule by ID
**GET** `/schedules/:scheduleId` *(Admin/Faculty)*

### 4.4 Update Schedule
**PUT** `/schedules/:scheduleId` *(Admin only)*

**Request Body:**
```json
{
  "open_time": "09:00:00",
  "close_time": "19:00:00"
}
```

### 4.5 Delete Schedule
**DELETE** `/schedules/:scheduleId` *(Admin only)*

### 4.6 Get Schedules by Device
**GET** `/schedules/device/:deviceId` *(Admin/Faculty)*

---

## 5. Override Management Endpoints

### 5.1 Create Override
**POST** `/overrides` *(Faculty only)*

**Request Body:**
```json
{
  "device_id": "LAB_001",
  "action": "unlock", // "lock" or "unlock"
  "expires_at": "2024-01-01T02:00:00.000Z" // ISO 8601 format
}
```

**Response:**
```json
{
  "message": "Override created successfully",
  "data": {
    "id": 1,
    "device_id": "LAB_001",
    "user_id": 1,
    "action": "unlock",
    "expires_at": "2024-01-01T02:00:00.000Z"
  }
}
```

### 5.2 Get All Active Overrides
**GET** `/overrides` *(Admin/Faculty)*

### 5.3 Get User's Overrides
**GET** `/overrides/my` *(Faculty)*

### 5.4 Get Override by ID
**GET** `/overrides/:overrideId` *(Admin/Faculty)*

### 5.5 Delete Override
**DELETE** `/overrides/:overrideId` *(Admin/Faculty)*

### 5.6 Get Overrides by Device
**GET** `/overrides/device/:deviceId` *(Admin/Faculty)*

---

## 6. Log Management Endpoints *(Admin only)*

### 6.1 Get All Logs
**GET** `/logs?limit=100&offset=0`

### 6.2 Get Log Statistics
**GET** `/logs/statistics`

**Response:**
```json
{
  "message": "Log statistics retrieved successfully",
  "data": {
    "total": 150,
    "success": 120,
    "failed": 20,
    "pending": 10,
    "actionStats": [
      {
        "action": "lock",
        "count": "50"
      },
      {
        "action": "unlock",
        "count": "45"
      }
    ]
  }
}
```

### 6.3 Get Logs by Device
**GET** `/logs/device/:deviceId?limit=100`

### 6.4 Get Logs by User
**GET** `/logs/user/:userId?limit=100`

### 6.5 Get Logs by Action
**GET** `/logs/action/:action?limit=100`

### 6.6 Get Logs by Status
**GET** `/logs/status/:status?limit=100`

### 6.7 Get Logs by Date Range
**GET** `/logs/range?startDate=2024-01-01&endDate=2024-01-31&limit=100`

---

## 7. Health Check

### 7.1 Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

---

## 8. Error Responses

### 8.1 Validation Error
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 8.2 Authentication Error
```json
{
  "error": "Access token required"
}
```

### 8.3 Authorization Error
```json
{
  "error": "Insufficient permissions"
}
```

### 8.4 Not Found Error
```json
{
  "error": "Device not found"
}
```

---

## 9. Kotlin Integration Examples

### 9.1 Login Example
```kotlin
// Using Retrofit
@POST("auth/login")
suspend fun login(@Body credentials: LoginRequest): LoginResponse

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val message: String,
    val data: LoginData
)

data class LoginData(
    val user: User,
    val token: String
)
```

### 9.2 Device Heartbeat Example
```kotlin
@POST("device-comm/heartbeat")
suspend fun sendHeartbeat(@Body heartbeat: HeartbeatRequest): HeartbeatResponse

data class HeartbeatRequest(
    val device_id: String,
    val status: String? = null
)

data class HeartbeatResponse(
    val message: String,
    val data: HeartbeatData
)

data class HeartbeatData(
    val command: String?,
    val expires_at: String?
)
```

### 9.3 Create Override Example (Faculty)
```kotlin
@POST("overrides")
suspend fun createOverride(
    @Header("Authorization") token: String,
    @Body override: OverrideRequest
): OverrideResponse

data class OverrideRequest(
    val device_id: String,
    val action: String, // "lock" or "unlock"
    val expires_at: String // ISO 8601 format
)
```

### 9.4 Send Device Command Example (Faculty)
```kotlin
@POST("devices/command")
suspend fun sendDeviceCommand(
    @Header("Authorization") token: String,
    @Body command: DeviceCommandRequest
): DeviceCommandResponse

data class DeviceCommandRequest(
    val device_id: String,
    val command: String, // "lock" or "unlock"
    val expires_at: String? = null
)
```

---

## 10. Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=smart_door_lock

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

---

## 11. Database Schema

The backend automatically creates the following tables:
- `users` - User accounts (admin, faculty)
- `devices` - Smart door lock devices
- `schedules` - Door lock schedules
- `overrides` - Faculty overrides
- `device_commands` - Commands sent to devices
- `logs` - Activity logs

---

## 12. Scheduler

The backend includes a scheduler that runs every minute to:
- Check and execute scheduled door operations
- Clean up expired overrides
- Update device commands

---

## 13. Role Permissions Summary

### Admin Permissions:
- ✅ Register and manage devices
- ✅ Create, update, delete schedules
- ✅ View all logs and statistics
- ✅ View all overrides
- ✅ Update device status

### Faculty Permissions:
- ✅ View all devices and their status
- ✅ Send manual device commands
- ✅ View schedules for devices
- ✅ Create temporary overrides
- ✅ View their own overrides

This API provides all the functionality needed for your Kotlin smart door lock application, with proper role-based access control for admin and faculty users.
