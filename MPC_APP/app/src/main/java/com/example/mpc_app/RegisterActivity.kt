package com.example.mpc_app

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.example.mpc_app.viewmodel.AuthViewModel

class RegisterActivity : AppCompatActivity() {
    private lateinit var viewModel: AuthViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        viewModel = ViewModelProvider(this)[AuthViewModel::class.java]

        val nameEt = findViewById<EditText>(R.id.etName)
        val emailEt = findViewById<EditText>(R.id.etEmail)
        val passwordEt = findViewById<EditText>(R.id.etPassword)
        val roleSpinner = findViewById<Spinner>(R.id.spinnerRole)
        val btnRegister = findViewById<Button>(R.id.btnRegister)

        roleSpinner.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_dropdown_item,
            listOf("faculty", "admin")
        )

        btnRegister.setOnClickListener {
            val name = nameEt.text.toString().trim()
            val email = emailEt.text.toString().trim()
            val password = passwordEt.text.toString().trim()
            val role = roleSpinner.selectedItem as String

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            viewModel.register(name, email, password, role)
        }

        viewModel.auth.observe(this) { result ->
            result.onSuccess {
                Toast.makeText(this, "Registered as ${it.user.role}", Toast.LENGTH_SHORT).show()
                finish()
            }.onFailure {
                Toast.makeText(this, it.message ?: "Registration failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
