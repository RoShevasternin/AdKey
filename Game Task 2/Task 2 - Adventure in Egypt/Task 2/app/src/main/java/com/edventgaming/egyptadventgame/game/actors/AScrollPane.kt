package com.edventgaming.egyptadventgame.game.actors

import com.badlogic.gdx.scenes.scene2d.ui.ScrollPane
import com.badlogic.gdx.utils.Disposable
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedGroup
import com.edventgaming.egyptadventgame.util.log

class AScrollPane(private val group: AdvancedGroup): ScrollPane(group), Disposable {

    override fun dispose() {
        group.dispose()
    }

}