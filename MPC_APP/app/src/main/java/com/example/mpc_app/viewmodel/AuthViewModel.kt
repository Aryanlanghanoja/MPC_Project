package com.example.mpc_app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.mpc_app.data.model.LoginData
import com.example.mpc_app.data.repository.AuthRepository
import kotlinx.coroutines.launch

class AuthViewModel(app: Application) : AndroidViewModel(app) {
    private val repo = AuthRepository(app)

    private val _auth = MutableLiveData<Result<LoginData>>()
    val auth: LiveData<Result<LoginData>> = _auth

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val data = repo.login(email, password)
                _auth.postValue(Result.success(data))
            } catch (e: Exception) {
                _auth.postValue(Result.failure(e))
            }
        }
    }

    fun register(name: String, email: String, password: String, role: String? = null) {
        viewModelScope.launch {
            try {
                val data = repo.register(name, email, password, role)
                _auth.postValue(Result.success(data))
            } catch (e: Exception) {
                _auth.postValue(Result.failure(e))
            }
        }
    }
}
