package com.example.mpc_app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.datastore.DataStoreManager
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private val scope = MainScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Session check
        val ds = DataStoreManager(applicationContext)
        scope.launch {
            val token = ds.jwtTokenFlow.first()
            val role = ds.userRoleFlow.first()
            if (!token.isNullOrBlank() && !role.isNullOrBlank()) {
                val next = if (role == "admin") AdminDashboardActivity::class.java else FacultyDashboardActivity::class.java
                startActivity(Intent(this@MainActivity, next))
                finish()
                return@launch
            }
        }

        val btnLogin = findViewById<Button>(R.id.btnGoLogin)
        val btnRegister = findViewById<Button>(R.id.btnGoRegister)

        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }

        btnRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
}
