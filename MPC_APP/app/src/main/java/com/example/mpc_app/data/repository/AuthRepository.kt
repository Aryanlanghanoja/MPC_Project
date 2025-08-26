package com.example.mpc_app.data.repository

import android.content.Context
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.datastore.DataStoreManager
import com.example.mpc_app.data.model.*
import com.example.mpc_app.data.network.NetworkModule

class AuthRepository(context: Context) {
    private val api = NetworkModule.createService<ApiService>(context)
    private val dataStore = DataStoreManager(context.applicationContext)

    suspend fun login(email: String, password: String): LoginData {
        val res = api.login(LoginRequest(email, password))
        val data = res.data ?: throw IllegalStateException(res.error ?: "Unknown error")
        dataStore.setJwtToken(data.token)
        dataStore.setUserRole(data.user.role)
        dataStore.setUserName(data.user.name)
        return data
    }

    suspend fun register(name: String, email: String, password: String, role: String? = null): LoginData {
        val res = api.register(RegisterRequest(name, email, password, role))
        val data = res.data ?: throw IllegalStateException(res.error ?: "Unknown error")
        dataStore.setJwtToken(data.token)
        dataStore.setUserRole(data.user.role)
        dataStore.setUserName(data.user.name)
        return data
    }

    suspend fun profile(): User {
        val res = api.profile()
        return res.data ?: throw IllegalStateException(res.error ?: "Unknown error")
    }

    suspend fun logout() {
        dataStore.setJwtToken(null)
        dataStore.setUserRole(null)
        dataStore.setUserName(null)
    }
}
