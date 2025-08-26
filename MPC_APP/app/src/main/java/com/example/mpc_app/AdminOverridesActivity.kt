package com.example.mpc_app

import android.os.Bundle
import android.view.MenuItem
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.mpc_app.data.api.ApiService
import com.example.mpc_app.data.network.NetworkModule
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class AdminOverridesActivity : AppCompatActivity() {
    private val scope = MainScope()
    private val api by lazy { NetworkModule.createService<ApiService>(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_overrides)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Overrides"

        val list = findViewById<ListView>(R.id.lvOverrides)
        scope.launch {
            try {
                val overrides = api.getActiveOverrides().data ?: emptyList()
                list.adapter = ArrayAdapter(
                    this@AdminOverridesActivity,
                    android.R.layout.simple_list_item_1,
                    overrides.map { "${it.device_id} ${it.action} until ${it.expires_at}" }
                )
            } catch (e: Exception) {
                Toast.makeText(this@AdminOverridesActivity, e.message ?: "Failed", Toast.LENGTH_SHORT).show()
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
