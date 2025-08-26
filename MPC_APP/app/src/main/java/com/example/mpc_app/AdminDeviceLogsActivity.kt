package com.example.mpc_app

import android.os.Bundle
import android.view.MenuItem
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.network.NetworkModule
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class AdminDeviceLogsActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val api by lazy { NetworkModule.createService<ApiService>(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_device_logs)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Device Logs"

        val deviceId = intent.getStringExtra("device_id") ?: return
        val list = findViewById<ListView>(R.id.lvDeviceLogs)

        scope.launch {
            val logs = api.getLogsByDevice(deviceId).data ?: emptyList()
            list.adapter = ArrayAdapter(
                this@AdminDeviceLogsActivity,
                android.R.layout.simple_list_item_1,
                logs.map { "${it.timestamp} ${it.device_id} ${it.action} ${it.status}" }
            )
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) { finish(); return true }
        return super.onOptionsItemSelected(item)
    }
}
