package com.edventgaming.egyptadventgame.game.dataStore

import com.edventgaming.egyptadventgame.game.manager.DataStoreManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow

class DS_Key(override val coroutine: CoroutineScope): DataStoreUtil<Int>() {

    override val dataStore = DataStoreManager.Key

    override val flow = MutableStateFlow(1)

    init {
        initialize()
    }

}