package com.example.mpc_app.data.repository

import android.content.Context
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.model.CreateScheduleRequest
import com.example.mpc_app.data.model.Schedule
import com.example.mpc_app.data.network.NetworkModule

class SchedulesRepository(context: Context) {
    private val api = NetworkModule.createService<ApiService>(context)

    suspend fun getSchedules(): List<Schedule> = api.getSchedules().data ?: emptyList()

    suspend fun getSchedulesByDevice(deviceId: String): List<Schedule> =
        api.getSchedulesByDevice(deviceId).data ?: emptyList()

    suspend fun createSchedule(req: CreateScheduleRequest): Schedule =
        api.createSchedule(req).data ?: throw IllegalStateException("Failed to create schedule")

    suspend fun updateSchedule(id: Int, req: CreateScheduleRequest): Schedule =
        api.updateSchedule(id, req).data ?: throw IllegalStateException("Failed to update schedule")

    suspend fun deleteSchedule(id: Int) {
        api.deleteSchedule(id)
    }
}
