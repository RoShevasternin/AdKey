package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.scenes.scene2d.Group
import com.edventgaming.egyptadventgame.game.actors.AItemRecord
import com.edventgaming.egyptadventgame.game.actors.AScrollPane
import com.edventgaming.egyptadventgame.game.actors.autoLayout.AVerticalGroup
import com.edventgaming.egyptadventgame.game.actors.button.AImageButton
import com.edventgaming.egyptadventgame.game.utils.Block
import com.edventgaming.egyptadventgame.game.utils.TIME_ANIM_SCREEN
import com.edventgaming.egyptadventgame.game.utils.actor.addActorWithConstraints
import com.edventgaming.egyptadventgame.game.utils.actor.animDelay
import com.edventgaming.egyptadventgame.game.utils.actor.animHide
import com.edventgaming.egyptadventgame.game.utils.actor.animShow
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.gdxGame
import com.edventgaming.egyptadventgame.util.log

class RecordScreen: AdvancedScreen() {

    companion object {
        fun unlockAchievement(index: Int) {
            val prefs = Gdx.app.getPreferences("EgyptGamePrefs")
            prefs.putBoolean("achievement_$index", true)
            prefs.flush() // Важливо викликати flush(), щоб дані записалися в пам'ять
        }
    }

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

        // Отримуємо доступ до збережених даних
        val prefs = Gdx.app.getPreferences("EgyptGamePrefs")

        repeat(10) { index ->
            // Перевіряємо, чи була ачівка збережена як "true"
            val isUnlocked = prefs.getBoolean("achievement_$index", false)

            val itemRecord = AItemRecord(this@RecordScreen, index, isUnlocked)
            itemRecord.setSize(872f, 281f)
            verticalGroup.addActor(itemRecord)
        }
    }


}