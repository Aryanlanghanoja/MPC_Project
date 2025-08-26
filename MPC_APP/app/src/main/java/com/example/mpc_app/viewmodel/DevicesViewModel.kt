package com.example.mpc_app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.mpc_app.data.model.Device
import com.example.mpc_app.data.model.HeartbeatData
import com.example.mpc_app.data.repository.DevicesRepository
import kotlinx.coroutines.launch

class DevicesViewModel(app: Application) : AndroidViewModel(app) {
    private val repo = DevicesRepository(app)

    private val _devices = MutableLiveData<Result<List<Device>>>()
    val devices: LiveData<Result<List<Device>>> = _devices

    private val _heartbeat = MutableLiveData<Result<HeartbeatData?>>()
    val heartbeat: LiveData<Result<HeartbeatData?>> = _heartbeat

    fun loadDevices() {
        viewModelScope.launch {
            try {
                val list = repo.getDevices()
                _devices.postValue(Result.success(list))
            } catch (e: Exception) {
                _devices.postValue(Result.failure(e))
            }
        }
    }

    fun sendCommand(deviceId: String, command: String, expiresAtIso: String? = null) {
        viewModelScope.launch {
            try {
                repo.sendCommand(deviceId, command, expiresAtIso)
            } catch (_: Exception) {}
        }
    }

    fun heartbeat(deviceId: String, status: String? = null) {
        viewModelScope.launch {
            try {
                val data = repo.heartbeat(deviceId, status)
                _heartbeat.postValue(Result.success(data))
            } catch (e: Exception) {
                _heartbeat.postValue(Result.failure(e))
            }
        }
    }
}
