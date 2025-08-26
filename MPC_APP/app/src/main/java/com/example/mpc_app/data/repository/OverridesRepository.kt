package com.example.mpc_app.data.repository

import android.content.Context
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.model.OverrideRequest
import com.example.mpc_app.data.network.NetworkModule

class OverridesRepository(context: Context) {
    private val api = NetworkModule.createService<ApiService>(context)

    suspend fun createOverride(deviceId: String, action: String, expiresAtIso: String) {
        api.createOverride(OverrideRequest(device_id = deviceId, action = action, expires_at = expiresAtIso))
    }

    suspend fun getMyOverrides(): List<Any> = api.getMyOverrides().data ?: emptyList()

    suspend fun getActiveOverrides(): List<Any> = api.getActiveOverrides().data ?: emptyList()

    suspend fun getOverridesByDevice(deviceId: String): List<Any> =
        api.getOverridesByDevice(deviceId).data ?: emptyList()
}
