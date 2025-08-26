package com.example.mpc_app.data.network

import kotlinx.coroutines.flow.first
import okhttp3.Interceptor
import okhttp3.Response
import com.example.mpc_app.data.datastore.DataStoreManager

class AuthInterceptor(private val dataStore: DataStoreManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()

        // Read token synchronously for interceptor using runBlocking minimal scope
        val token = kotlinx.coroutines.runBlocking {
            dataStore.jwtTokenFlow.first()
        }

        val newRequest = if (!token.isNullOrBlank()) {
            original.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            original
        }

        return chain.proceed(newRequest)
    }
}
