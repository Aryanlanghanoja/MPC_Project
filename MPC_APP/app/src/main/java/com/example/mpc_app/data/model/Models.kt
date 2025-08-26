package com.example.mpc_app.data.model

// Auth
data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String? = null // "admin" or "faculty"
)

data class ApiResponse<T>(
    val message: String? = null,
    val data: T? = null,
    val error: String? = null
)

data class LoginData(
    val user: User,
    val token: String
)

data class User(
    val id: Int,
    val name: String,
    val email: String,
    val role: String
)

// Devices

data class Device(
    val id: Int,
    val device_id: String,
    val name: String,
    val location: String,
    val status: String
)

data class DeviceRegisterRequest(
    val device_id: String,
    val name: String,
    val location: String
)

data class DeviceCommandRequest(
    val device_id: String,
    val command: String,
    val expires_at: String? = null
)

data class DeviceHeartbeatRequest(
    val device_id: String,
    val status: String? = null
)

data class HeartbeatData(
    val command: String?,
    val expires_at: String?
)

// Schedules

data class Schedule(
    val id: Int,
    val device_id: String,
    val day_of_week: Int,
    val open_time: String,
    val close_time: String
)

data class CreateScheduleRequest(
    val device_id: String,
    val day_of_week: Int,
    val open_time: String,
    val close_time: String
)

// Overrides

data class OverrideRequest(
    val device_id: String,
    val action: String,
    val expires_at: String
)

data class OverrideEntry(
    val id: Int,
    val device_id: String,
    val user_id: Int?,
    val action: String,
    val expires_at: String,
    val createdAt: String,
    val updatedAt: String
)

// Logs (admin)

data class LogEntry(
    val id: Int,
    val device_id: String,
    val user_id: Int?,
    val action: String,
    val timestamp: String,
    val status: String
)

data class LogStats(
    val total: Int,
    val success: Int,
    val failed: Int,
    val pending: Int,
    val actionStats: List<Map<String, String>>
)
