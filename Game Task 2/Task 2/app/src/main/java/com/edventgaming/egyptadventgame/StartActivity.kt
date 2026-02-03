package com.edventgaming.egyptadventgame

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.edventgaming.egyptadventgame.util.log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private var onCreateCounter = 0

class StartActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        onCreateCounter++
        log("StartActivity: $onCreateCounter")

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)

        CoroutineScope(Dispatchers.Main).launch {
            delay(3000)
            startActivity(Intent(this@StartActivity, MainActivity::class.java))
            finish()
        }
    }

}