package com.task123.task321.game.screens

import com.badlogic.gdx.scenes.scene2d.Group
import com.task123.task321.game.actors.AGamePan
import com.task123.task321.game.actors.AGamePanel
import com.task123.task321.game.actors.button.AImageButton
import com.task123.task321.game.utils.Block
import com.task123.task321.game.utils.TIME_ANIM_SCREEN
import com.task123.task321.game.utils.actor.addActorWithConstraints
import com.task123.task321.game.utils.actor.animDelay
import com.task123.task321.game.utils.actor.animHide
import com.task123.task321.game.utils.actor.animShow
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame

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