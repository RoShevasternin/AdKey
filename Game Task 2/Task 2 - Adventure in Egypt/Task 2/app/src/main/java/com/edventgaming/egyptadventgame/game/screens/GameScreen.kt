package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.scenes.scene2d.Group
import com.edventgaming.egyptadventgame.game.actors.AGamePan
import com.edventgaming.egyptadventgame.game.actors.AGamePanel
import com.edventgaming.egyptadventgame.game.actors.button.AImageButton
import com.edventgaming.egyptadventgame.game.utils.Block
import com.edventgaming.egyptadventgame.game.utils.TIME_ANIM_SCREEN
import com.edventgaming.egyptadventgame.game.utils.actor.addActorWithConstraints
import com.edventgaming.egyptadventgame.game.utils.actor.animDelay
import com.edventgaming.egyptadventgame.game.utils.actor.animHide
import com.edventgaming.egyptadventgame.game.utils.actor.animShow
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.gdxGame

class GameScreen: AdvancedScreen() {

    private val btnBack   = AImageButton(this, AImageButton.Type.BACK)
    private val panel     = AGamePan(this)
    private val gamePanel = AGamePanel(this)

    override fun show() {
        AGamePanel.GLOBAL_COST_FLOW.value = 0
        
        stageUI.root.color.a = 0f
        setBackBackground(gdxGame.assetsLoader.BACKGROUND)
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        addBtnBack()
        addPanel()
        addGamePanel()
    }

    override fun animHideScreen(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageUI.root.animHide(TIME_ANIM_SCREEN)
        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun animShowScreen(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageUI.root.animShow(TIME_ANIM_SCREEN)
        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    // Actors ------------------------------------------------------------------------

    private fun Group.addBtnBack() {
        btnBack.setSize(212f, 212f)
        addActorWithConstraints(btnBack) {
            startToStartOf = this@addBtnBack
            topToTopOf     = this@addBtnBack

            marginStart = 113f
            marginTop   = 101f
        }

        btnBack.setOnClickListener {
            this@GameScreen.animHideScreen { gdxGame.navigationManager.back() }
        }

    }

    private fun Group.addPanel() {
        panel.setSize(674f, 244f)
        addActorWithConstraints(panel) {
            startToEndOf     = btnBack
            endToEndOf       = this@addPanel
            topToTopOf       = btnBack
            bottomToBottomOf = btnBack
        }

        panel.timer.finishBlock = {
            animHideScreen { gdxGame.navigationManager.navigate(LoseScreen::class.java.name) }
        }
    }

    private fun Group.addGamePanel() {
        gamePanel.setSize(684f, 1070f)
        addActorWithConstraints(gamePanel) {
            startToStartOf   = this@addGamePanel
            endToEndOf       = this@addGamePanel
            topToBottomOf    = panel
            bottomToBottomOf = this@addGamePanel

            verticalBias = 0.75f
        }
    }

}