package com.example.mpc_app.data.repository

import android.content.Context
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.model.*
import com.example.mpc_app.data.network.NetworkModule

class DevicesRepository(context: Context) {
    private val api = NetworkModule.createService<ApiService>(context)

    suspend fun getDevices(): List<Device> {
        val res = api.getDevices()
        return res.data ?: emptyList()
    }

    suspend fun getDevice(deviceId: String): Device {
        val res = api.getDevice(deviceId)
        return res.data ?: throw IllegalStateException(res.error ?: "Not found")
    }

    suspend fun registerDevice(deviceId: String, name: String, location: String): Device {
        val res = api.registerDevice(DeviceRegisterRequest(device_id = deviceId, name = name, location = location))
        return res.data ?: throw IllegalStateException("Failed to register device")
    }

    suspend fun sendCommand(deviceId: String, command: String, expiresAtIso: String? = null) {
        api.sendDeviceCommand(DeviceCommandRequest(device_id = deviceId, command = command, expires_at = expiresAtIso))
    }

    suspend fun heartbeat(deviceId: String, status: String? = null): HeartbeatData? {
        val res = api.heartbeat(DeviceHeartbeatRequest(device_id = deviceId, status = status))
        return res.data
    }
}
