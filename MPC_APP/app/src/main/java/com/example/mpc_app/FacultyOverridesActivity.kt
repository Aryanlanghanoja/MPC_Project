package com.example.mpc_app

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MenuItem
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.model.OverrideRequest
import com.example.mpc_app.data.network.NetworkModule
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class FacultyOverridesActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val api by lazy { NetworkModule.createService<ApiService>(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_faculty_overrides)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "My Overrides"

        findViewById<Button>(R.id.btnNewOverride).setOnClickListener { showNewDialog() }
        loadMyOverrides()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun loadMyOverrides() {
        val list = findViewById<ListView>(R.id.lvMyOverrides)
        scope.launch {
            try {
                val items = api.getMyOverrides().data ?: emptyList()
                list.adapter = ArrayAdapter(
                    this@FacultyOverridesActivity,
                    android.R.layout.simple_list_item_1,
                    items.map { "${it.device_id} ${it.action} until ${it.expires_at}" }
                )
            } catch (e: Exception) {
                Toast.makeText(this@FacultyOverridesActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showNewDialog() {
        val view = LayoutInflater.from(this).inflate(R.layout.dialog_create_override, null)
        val etDevice = view.findViewById<EditText>(R.id.etDeviceId)
        val spinnerAction = view.findViewById<Spinner>(R.id.spinnerAction)
        val etSeconds = view.findViewById<EditText>(R.id.etSeconds)
        val etExpires = view.findViewById<EditText>(R.id.etExpires)

        spinnerAction.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, listOf("lock", "unlock"))

        AlertDialog.Builder(this)
            .setTitle("Create Override")
            .setView(view)
            .setPositiveButton("Create") { d, _ ->
                val deviceId = etDevice.text.toString().trim()
                val action = spinnerAction.selectedItem as String
                val secondsStr = etSeconds.text.toString().trim()
                val expiresTyped = etExpires.text.toString().trim()

                if (deviceId.isEmpty()) {
                    Toast.makeText(this, "Device ID required", Toast.LENGTH_SHORT).show()
                } else {
                    val expiresAt: String = if (secondsStr.isNotEmpty()) {
                        val sec = secondsStr.toLongOrNull() ?: 0L
                        val targetMs = System.currentTimeMillis() + TimeUnit.SECONDS.toMillis(sec)
                        // ISO8601 (UTC)
                        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                        sdf.timeZone = TimeZone.getTimeZone("UTC")
                        sdf.format(Date(targetMs))
                    } else if (expiresTyped.isNotEmpty()) {
                        expiresTyped
                    } else {
                        // default 5 minutes
                        val targetMs = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5)
                        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                        sdf.timeZone = TimeZone.getTimeZone("UTC")
                        sdf.format(Date(targetMs))
                    }

                    scope.launch {
                        try {
                            api.createOverride(OverrideRequest(deviceId, action, expiresAt))
                            loadMyOverrides()
                        } catch (e: Exception) {
                            Toast.makeText(this@FacultyOverridesActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
                d.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}
