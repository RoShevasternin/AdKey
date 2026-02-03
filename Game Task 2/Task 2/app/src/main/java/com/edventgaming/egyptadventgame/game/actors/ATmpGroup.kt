package com.edventgaming.egyptadventgame.game.actors

import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedGroup
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen

class ATmpGroup(override val screen: AdvancedScreen): AdvancedGroup() {

    override fun getPrefHeight() = height
    override fun getPrefWidth() = width

    override fun addActorsOnGroup() { }

}