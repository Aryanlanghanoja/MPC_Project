package com.example.mpc_app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.example.mpc_app.viewmodel.AuthViewModel

class LoginActivity : AppCompatActivity() {
    private lateinit var viewModel: AuthViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        viewModel = ViewModelProvider(this)[AuthViewModel::class.java]

        val emailEt = findViewById<EditText>(R.id.etEmail)
        val passwordEt = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val email = emailEt.text.toString().trim()
            val password = passwordEt.text.toString().trim()
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Enter email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            viewModel.login(email, password)
        }

        viewModel.auth.observe(this) { result ->
            result.onSuccess { data ->
                Toast.makeText(this, "Login success: ${data.user.role}", Toast.LENGTH_SHORT).show()
                val next = if (data.user.role == "admin") AdminDashboardActivity::class.java else FacultyDashboardActivity::class.java
                startActivity(Intent(this, next))
                finish()
            }.onFailure {
                Toast.makeText(this, it.message ?: "Login failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
