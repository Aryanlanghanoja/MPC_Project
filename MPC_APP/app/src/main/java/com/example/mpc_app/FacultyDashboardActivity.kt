package com.example.mpc_app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.datastore.DataStoreManager
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class FacultyDashboardActivity : AppCompatActivity() {
    private val scope = MainScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_faculty_dashboard)

        findViewById<Button>(R.id.btnLogoutFaculty).setOnClickListener {
            scope.launch {
                val ds = DataStoreManager(applicationContext)
                ds.setJwtToken(null)
                ds.setUserRole(null)
                ds.setUserName(null)
                startActivity(Intent(this@FacultyDashboardActivity, MainActivity::class.java))
                finishAffinity()
            }
        }
    }
}
