package com.task123.task321.game.screens

import com.badlogic.gdx.scenes.scene2d.Group
import com.task123.task321.game.actors.AItemRecord
import com.task123.task321.game.actors.AScrollPane
import com.task123.task321.game.actors.autoLayout.AVerticalGroup
import com.task123.task321.game.actors.button.AImageButton
import com.task123.task321.game.utils.Block
import com.task123.task321.game.utils.TIME_ANIM_SCREEN
import com.task123.task321.game.utils.actor.addActorWithConstraints
import com.task123.task321.game.utils.actor.animDelay
import com.task123.task321.game.utils.actor.animHide
import com.task123.task321.game.utils.actor.animShow
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame

class RecordScreen: AdvancedScreen() {

    private val btnBack = AImageButton(this, AImageButton.Type.BACK)

    private val verticalGroup = AVerticalGroup(this, 16f, isWrap = true, endGap = 300f)
    private val scroll        = AScrollPane(verticalGroup)

    override fun show() {
        stageUI.root.color.a = 0f
        setBackBackground(gdxGame.assetsLoader.BACKGROUND)
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        addBtnBack()
        addScoll()

        scroll.apply {
            setUpVertical()
        }

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
            this@RecordScreen.animHideScreen { gdxGame.navigationManager.back() }
        }

    }

    private fun Group.addScoll() {
        scroll.setSize(872f, 1f)
        addActorWithConstraints(scroll) {
            startToStartOf   = this@addScoll
            endToEndOf       = this@addScoll
            topToBottomOf    = btnBack
            bottomToBottomOf = this@addScoll

            verticalBias = 1f
        }

        scroll.height = scroll.y
        scroll.y      = -80f
    }

    private fun Group.setUpVertical() {
        verticalGroup.setSize(width, height)
        repeat(10) { index ->
            val itemRecord = AItemRecord(this@RecordScreen, index)
            itemRecord.setSize(872f, 281f)
            verticalGroup.addActor(itemRecord)
        }
    }


}