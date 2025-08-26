package com.example.mpc_app

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.model.Device
import com.example.mpc_app.data.repository.DevicesRepository
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class FacultyDashboardActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val repo by lazy { DevicesRepository(this) }
    private val dateFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_faculty_dashboard)

        findViewById<Button>(R.id.btnCreateOverride).setOnClickListener {
            startActivity(Intent(this, FacultyOverridesActivity::class.java))
        }

        findViewById<Button>(R.id.btnLogoutFaculty).setOnClickListener {
            scope.launch {
                val ds = com.example.mpc_app.data.datastore.DataStoreManager(applicationContext)
                ds.setJwtToken(null)
                ds.setUserRole(null)
                ds.setUserName(null)
                finishAffinity()
            }
        }

        loadDevices()
    }

    private fun loadDevices() {
        val container = findViewById<LinearLayout>(R.id.contentContainerFaculty)
        container.removeAllViews()
        val listView = ListView(this)
        container.addView(listView)

        scope.launch {
            try {
                val devices = repo.getDevices()
                val adapter = ArrayAdapter<String>(
                    this@FacultyDashboardActivity,
                    android.R.layout.simple_list_item_1,
                    devices.map { "${it.name} (${it.device_id}) - ${it.status}" }
                )
                listView.adapter = adapter

                listView.setOnItemClickListener { _, _, position, _ ->
                    showControlDialog(devices[position])
                }

                // Update servo status display
                updateServoStatus(devices)
            } catch (e: Exception) {
                Toast.makeText(this@FacultyDashboardActivity, e.message ?: "Failed to load", Toast.LENGTH_SHORT).show()
                updateServoStatusError()
            }
        }
    }

    private fun updateServoStatus(devices: List<Device>) {
        val tvServoStatus = findViewById<TextView>(R.id.tvServoStatus)
        val tvLastUpdate = findViewById<TextView>(R.id.tvLastUpdate)
        
        if (devices.isEmpty()) {
            tvServoStatus.text = "No devices found"
            tvLastUpdate.text = ""
            return
        }

        // Build status text for all devices
        val statusText = devices.joinToString("\n\n") { device ->
            val status = device.status ?: "Unknown"
            val servoPosition = when (status.lowercase()) {
                "locked" -> "0° (Locked Position)"
                "unlocked" -> "180° (Unlocked Position)"
                else -> "Unknown Position"
            }
            "Device: ${device.name}\nStatus: $status\nServo: $servoPosition"
        }
        
        tvServoStatus.text = statusText
        tvLastUpdate.text = "Last updated: ${dateFormat.format(Date())}"
    }

    private fun updateServoStatusError() {
        val tvServoStatus = findViewById<TextView>(R.id.tvServoStatus)
        val tvLastUpdate = findViewById<TextView>(R.id.tvLastUpdate)
        
        tvServoStatus.text = "Error loading status"
        tvLastUpdate.text = "Last updated: ${dateFormat.format(Date())}"
    }

    private fun showControlDialog(device: Device) {
        val options = arrayOf("Lock", "Unlock")
        AlertDialog.Builder(this)
            .setTitle("Control ${device.name}")
            .setItems(options) { d, which ->
                val cmd = if (which == 0) "lock" else "unlock"
                scope.launch {
                    try {
                        repo.sendCommand(device.device_id, cmd)
                        Toast.makeText(this@FacultyDashboardActivity, "Sent $cmd", Toast.LENGTH_SHORT).show()
                        loadDevices() // Refresh to update status
                    } catch (e: Exception) {
                        Toast.makeText(this@FacultyDashboardActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
                    }
                }
                d.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}
