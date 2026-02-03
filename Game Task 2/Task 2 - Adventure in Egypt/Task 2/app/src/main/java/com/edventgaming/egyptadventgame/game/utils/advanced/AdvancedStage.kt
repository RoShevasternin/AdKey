package com.edventgaming.egyptadventgame.game.utils.advanced

import com.badlogic.gdx.scenes.scene2d.Stage
import com.badlogic.gdx.utils.Disposable
import com.badlogic.gdx.utils.viewport.Viewport

open class AdvancedStage(viewport: Viewport) : Stage(viewport) {

    fun update(screenWidth: Int, screenHeight: Int, centerCamera: Boolean) {
        viewport.update(screenWidth, screenHeight, centerCamera)
        root.setSize(viewport.worldWidth, viewport.worldHeight)
    }

    fun render() {
        viewport.apply()
        act()

        draw()
    }

    override fun dispose() {
        actors.onEach { actor -> if (actor is Disposable) actor.dispose() }
        super.dispose()
    }

}