package com.example.mpc_app

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MenuItem
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.model.CreateScheduleRequest
import com.example.mpc_app.data.repository.SchedulesRepository
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class AdminSchedulesActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val repo by lazy { SchedulesRepository(this) }
    private var deviceIdFilter: String? = null
    private var readOnly: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_schedules)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Schedules"

        deviceIdFilter = intent.getStringExtra("device_id")
        readOnly = intent.getBooleanExtra("read_only", false)

        val btnAdd = findViewById<Button>(R.id.btnAddSchedule)
        btnAdd.setOnClickListener { showAddDialog() }
        if (readOnly) btnAdd.isEnabled = false

        load()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun load() {
        val listView = findViewById<ListView>(R.id.lvSchedules)
        scope.launch {
            try {
                val items = if (deviceIdFilter.isNullOrBlank()) repo.getSchedules() else repo.getSchedulesByDevice(deviceIdFilter!!)
                listView.adapter = ArrayAdapter(
                    this@AdminSchedulesActivity,
                    android.R.layout.simple_list_item_1,
                    items.map { "${it.device_id}: D${it.day_of_week} ${it.open_time}-${it.close_time}" }
                )
                if (!readOnly) {
                    listView.setOnItemLongClickListener { _, _, position, _ ->
                        val schedule = items[position]
                        AlertDialog.Builder(this@AdminSchedulesActivity)
                            .setTitle("Delete schedule?")
                            .setMessage("${schedule.device_id} day ${schedule.day_of_week}")
                            .setPositiveButton("Delete") { d, _ ->
                                scope.launch {
                                    repo.deleteSchedule(schedule.id)
                                    load()
                                }
                                d.dismiss()
                            }
                            .setNegativeButton("Cancel", null)
                            .show()
                        true
                    }
                }
            } catch (e: Exception) {
                Toast.makeText(this@AdminSchedulesActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showAddDialog() {
        if (readOnly) return
        val view = LayoutInflater.from(this).inflate(R.layout.dialog_add_schedule, null)
        val etDevice = view.findViewById<EditText>(R.id.etDeviceId)
        val etDay = view.findViewById<EditText>(R.id.etDay)
        val etOpen = view.findViewById<EditText>(R.id.etOpen)
        val etClose = view.findViewById<EditText>(R.id.etClose)
        if (!deviceIdFilter.isNullOrBlank()) etDevice.setText(deviceIdFilter)
        AlertDialog.Builder(this)
            .setTitle("Add Schedule")
            .setView(view)
            .setPositiveButton("Add") { d, _ ->
                val dev = etDevice.text.toString().trim()
                val day = etDay.text.toString().trim().toIntOrNull()
                val open = etOpen.text.toString().trim()
                val close = etClose.text.toString().trim()
                if (dev.isEmpty() || day == null || open.isEmpty() || close.isEmpty()) {
                    Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show()
                } else {
                    scope.launch {
                        try {
                            repo.createSchedule(CreateScheduleRequest(dev, day, open, close))
                            load()
                        } catch (e: Exception) {
                            Toast.makeText(this@AdminSchedulesActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
                d.dismiss()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}
