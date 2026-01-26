package com.task123.task321.game.actors

import com.task123.task321.game.utils.advanced.AdvancedGroup
import com.task123.task321.game.utils.advanced.AdvancedScreen

class ATmpGroup(override val screen: AdvancedScreen): AdvancedGroup() {

    override fun getPrefHeight() = height
    override fun getPrefWidth() = width

    override fun addActorsOnGroup() { }

}