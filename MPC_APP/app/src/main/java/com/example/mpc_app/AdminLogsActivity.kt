package com.example.mpc_app

import android.os.Bundle
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.network.NetworkModule
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class AdminLogsActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val api by lazy { NetworkModule.createService<ApiService>(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_logs)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Logs"

        val tv = findViewById<TextView>(R.id.tvStats)
        scope.launch {
            try {
                val stats = api.getLogStatistics().data
                tv.text = stats.toString()
            } catch (e: Exception) {
                tv.text = e.message ?: "Failed"
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}
