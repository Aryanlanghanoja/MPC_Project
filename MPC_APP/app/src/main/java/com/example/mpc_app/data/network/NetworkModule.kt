package com.example.mpc_app.data.network

import android.content.Context
import com.example.mpc_app.data.datastore.DataStoreManager
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

object NetworkModule {

    @Volatile
    private var retrofit: Retrofit? = null

    fun provideRetrofit(context: Context): Retrofit {
        val appContext = context.applicationContext
        val dataStore = DataStoreManager(appContext)

        val baseUrl = runBlocking {
            dataStore.apiBaseUrlFlow.first()
        }

        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor(AuthInterceptor(dataStore))
            .build()

        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

        val instance = retrofit ?: Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .also { retrofit = it }

        return instance
    }

    inline fun <reified T> createService(context: Context): T {
        return provideRetrofit(context).create(T::class.java)
    }
}
