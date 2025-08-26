package com.example.mpc_app

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.model.Device
import com.example.mpc_app.data.repository.DevicesRepository
import com.example.mpc_app.data.network.NetworkModule
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class AdminDashboardActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val devicesRepo by lazy { DevicesRepository(this) }
    private val api by lazy { NetworkModule.createService<ApiService>(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_dashboard)

        findViewById<Button>(R.id.btnLogoutAdmin).setOnClickListener {
            scope.launch {
                val ds = com.example.mpc_app.data.datastore.DataStoreManager(applicationContext)
                ds.setJwtToken(null)
                ds.setUserRole(null)
                ds.setUserName(null)
                startActivity(Intent(this@AdminDashboardActivity, MainActivity::class.java))
                finishAffinity()
            }
        }

        findViewById<Button>(R.id.btnAddDevice).setOnClickListener { showAddDeviceDialog() }
        findViewById<Button>(R.id.btnOverrides).setOnClickListener {
            startActivity(Intent(this, AdminOverridesActivity::class.java))
        }

        loadDevicesList()
    }

    private fun loadDevicesList() {
        val container = findViewById<LinearLayout>(R.id.contentContainer)
        container.removeAllViews()
        val listView = ListView(this)
        container.addView(listView)
        scope.launch {
            val devices = devicesRepo.getDevices()
            listView.adapter = ArrayAdapter(
                this@AdminDashboardActivity,
                android.R.layout.simple_list_item_1,
                devices.map { "${it.name} (${it.device_id}) - ${it.status}" }
            )
            listView.setOnItemClickListener { _, _, position, _ ->
                showDeviceDialog(devices[position])
            }
        }
    }

    private fun showDeviceDialog(device: Device) {
        val options = arrayOf("Lock", "Unlock", "Update Status", "View Schedules", "View Overrides", "View Logs")
        AlertDialog.Builder(this)
            .setTitle(device.name)
            .setItems(options) { d, which ->
                when (which) {
                    0 -> scope.launch {
                        devicesRepo.sendCommand(device.device_id, "lock")
                        loadDevicesList()
                        Toast.makeText(this@AdminDashboardActivity, "Locked command sent", Toast.LENGTH_SHORT).show()
                    }
                    1 -> scope.launch {
                        devicesRepo.sendCommand(device.device_id, "unlock")
                        loadDevicesList()
                        Toast.makeText(this@AdminDashboardActivity, "Unlock command sent", Toast.LENGTH_SHORT).show()
                    }
                    2 -> showUpdateStatusDialog(device)
                    3 -> {
                        val intent = Intent(this, AdminSchedulesActivity::class.java)
                        intent.putExtra("device_id", device.device_id)
                        startActivity(intent)
                    }
                    4 -> {
                        val intent = Intent(this, AdminOverridesActivity::class.java)
                        startActivity(intent)
                    }
                    5 -> {
                        val intent = Intent(this, AdminDeviceLogsActivity::class.java)
                        intent.putExtra("device_id", device.device_id)
                        startActivity(intent)
                    }
                }
                d.dismiss()
            }
            .setNegativeButton("Close", null)
            .show()
    }

    private fun showAddDeviceDialog() {
        val view = LayoutInflater.from(this).inflate(R.layout.dialog_add_device, null)
        val etId = view.findViewById<EditText>(R.id.etDeviceId)
        val etName = view.findViewById<EditText>(R.id.etDeviceName)
        val etLocation = view.findViewById<EditText>(R.id.etDeviceLocation)

        AlertDialog.Builder(this)
            .setTitle("Register Device")
            .setView(view)
            .setPositiveButton("Register") { d, _ ->
                val id = etId.text.toString().trim()
                val name = etName.text.toString().trim()
                val loc = etLocation.text.toString().trim()
                if (id.isEmpty() || name.isEmpty() || loc.isEmpty()) {
                    Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show()
                } else {
                    scope.launch {
                        try {
                            devicesRepo.registerDevice(id, name, loc)
                            Toast.makeText(this@AdminDashboardActivity, "Device registered", Toast.LENGTH_SHORT).show()
                            loadDevicesList()
                        } catch (e: Exception) {
                            Toast.makeText(this@AdminDashboardActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
                d.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun showUpdateStatusDialog(device: Device) {
        val statuses = arrayOf("online", "offline", "locked", "unlocked")
        AlertDialog.Builder(this)
            .setTitle("Update Status")
            .setItems(statuses) { d, which ->
                scope.launch {
                    api.updateDeviceStatus(device.device_id, mapOf("status" to statuses[which]))
                    loadDevicesList()
                    Toast.makeText(this@AdminDashboardActivity, "Status updated", Toast.LENGTH_SHORT).show()
                }
                d.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}
