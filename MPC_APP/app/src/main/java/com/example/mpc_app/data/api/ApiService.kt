package com.example.mpc_app.data.api

import com.example.mpc_app.data.model.*
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.DELETE
import retrofit2.http.Query

interface ApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): ApiResponse<LoginData>

    @POST("auth/register")
    suspend fun register(@Body req: RegisterRequest): ApiResponse<LoginData>

    @GET("auth/profile")
    suspend fun profile(): ApiResponse<User>

    // Devices
    @GET("devices")
    suspend fun getDevices(): ApiResponse<List<Device>>

    @GET("devices/{deviceId}")
    suspend fun getDevice(@Path("deviceId") deviceId: String): ApiResponse<Device>

    @POST("devices/command")
    suspend fun sendDeviceCommand(@Body req: DeviceCommandRequest): ApiResponse<Any>

    // Device communication
    @POST("device-comm/heartbeat")
    suspend fun heartbeat(@Body req: DeviceHeartbeatRequest): ApiResponse<HeartbeatData>

    // Schedules
    @GET("schedules")
    suspend fun getSchedules(): ApiResponse<List<Schedule>>

    @GET("schedules/device/{deviceId}")
    suspend fun getSchedulesByDevice(@Path("deviceId") deviceId: String): ApiResponse<List<Schedule>>

    @POST("schedules")
    suspend fun createSchedule(@Body req: CreateScheduleRequest): ApiResponse<Schedule>

    @PUT("schedules/{scheduleId}")
    suspend fun updateSchedule(
        @Path("scheduleId") scheduleId: Int,
        @Body req: CreateScheduleRequest
    ): ApiResponse<Schedule>

    @DELETE("schedules/{scheduleId}")
    suspend fun deleteSchedule(@Path("scheduleId") scheduleId: Int): ApiResponse<Any>

    // Overrides
    @POST("overrides")
    suspend fun createOverride(@Body req: OverrideRequest): ApiResponse<Any>

    @GET("overrides")
    suspend fun getActiveOverrides(): ApiResponse<List<Any>>

    @GET("overrides/my")
    suspend fun getMyOverrides(): ApiResponse<List<Any>>

    @GET("overrides/device/{deviceId}")
    suspend fun getOverridesByDevice(@Path("deviceId") deviceId: String): ApiResponse<List<Any>>

    // Logs (Admin only)
    @GET("logs")
    suspend fun getLogs(@Query("limit") limit: Int = 100, @Query("offset") offset: Int = 0): ApiResponse<Any>

    @GET("logs/statistics")
    suspend fun getLogStatistics(): ApiResponse<Any>
}
