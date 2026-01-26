package com.kerkabig.runner.dice.game.dataStore

import com.kerkabig.runner.dice.game.manager.DataStoreManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow

class DS_Record(override val coroutine: CoroutineScope): DataStoreUtil<Int>() {

    override val dataStore = DataStoreManager.Record

    override val flow = MutableStateFlow(0)

    init {
        initialize()
    }

}