package com.example.mpc_app.data.datastore

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private const val DATASTORE_NAME = "app_prefs"

val Context.dataStore by preferencesDataStore(name = DATASTORE_NAME)

class DataStoreManager(private val context: Context) {

    object Keys {
        val API_BASE_URL: Preferences.Key<String> = stringPreferencesKey("api_base_url")
        val ENVIRONMENT: Preferences.Key<String> = stringPreferencesKey("environment")
        val JWT_TOKEN: Preferences.Key<String> = stringPreferencesKey("jwt_token")
        val USER_ROLE: Preferences.Key<String> = stringPreferencesKey("user_role")
        val USER_NAME: Preferences.Key<String> = stringPreferencesKey("user_name")
    }

    val apiBaseUrlFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[Keys.API_BASE_URL] ?: DEFAULT_BASE_URL
    }

    val environmentFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[Keys.ENVIRONMENT] ?: DEFAULT_ENV
    }

    val jwtTokenFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[Keys.JWT_TOKEN]
    }

    val userRoleFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[Keys.USER_ROLE]
    }

    val userNameFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[Keys.USER_NAME]
    }

    suspend fun setApiBaseUrl(url: String) {
        context.dataStore.edit { prefs ->
            prefs[Keys.API_BASE_URL] = url
        }
    }

    suspend fun setEnvironment(env: String) {
        context.dataStore.edit { prefs ->
            prefs[Keys.ENVIRONMENT] = env
        }
    }

    suspend fun setJwtToken(token: String?) {
        context.dataStore.edit { prefs ->
            if (token.isNullOrBlank()) {
                prefs.remove(Keys.JWT_TOKEN)
            } else {
                prefs[Keys.JWT_TOKEN] = token
            }
        }
    }

    suspend fun setUserRole(role: String?) {
        context.dataStore.edit { prefs ->
            if (role.isNullOrBlank()) prefs.remove(Keys.USER_ROLE) else prefs[Keys.USER_ROLE] = role
        }
    }

    suspend fun setUserName(name: String?) {
        context.dataStore.edit { prefs ->
            if (name.isNullOrBlank()) prefs.remove(Keys.USER_NAME) else prefs[Keys.USER_NAME] = name
        }
    }

    companion object {
        const val DEFAULT_BASE_URL = "http://10.0.2.2:3000/api/"
        const val DEFAULT_ENV = "development"
    }
}
