package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.edventgaming.egyptadventgame.game.actors.button.AButton
import com.edventgaming.egyptadventgame.game.actors.button.AImageButton
import com.edventgaming.egyptadventgame.game.utils.Block
import com.edventgaming.egyptadventgame.game.utils.TIME_ANIM_SCREEN
import com.edventgaming.egyptadventgame.game.utils.actor.addActorWithConstraints
import com.edventgaming.egyptadventgame.game.utils.actor.animDelay
import com.edventgaming.egyptadventgame.game.utils.actor.animHide
import com.edventgaming.egyptadventgame.game.utils.actor.animShow
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.gdxGame

class MenuScreen: AdvancedScreen() {

    private val imgCenter = Image(gdxGame.assetsAll.GLAZ)
    private val btnPlay   = AButton(this, AButton.Type.PLAY)
    private val btnSett   = AImageButton(this, AImageButton.Type.SETTINGS)
    private val btnRecord = AImageButton(this, AImageButton.Type.RECORD)

    override fun show() {
        setBackBackground(gdxGame.assetsLoader.BACKGROUND)
        super.show()
    }

    override fun Group.addActorsOnStageUI() {
        color.a = 0f

        addImgCenter()
        addBtnPlay()
        addBtnSett()
        addBtnRecord()

        animShow()
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

    private fun Group.addImgCenter() {
        imgCenter.setSize(816f, 816f)
        addActorWithConstraints(imgCenter) {
            startToStartOf   = this@addImgCenter
            endToEndOf       = this@addImgCenter
            topToTopOf       = this@addImgCenter
            bottomToBottomOf = this@addImgCenter

            verticalBias = 0.65f
        }
    }

    private fun Group.addBtnPlay() {
        btnPlay.setSize(872f, 244f)
        addActorWithConstraints(btnPlay) {
            startToStartOf   = imgCenter
            endToEndOf       = imgCenter
            topToBottomOf    = imgCenter
            bottomToBottomOf = this@addBtnPlay

            verticalBias = 0.65f
        }

        btnPlay.setOnClickListener {
            this@MenuScreen.animHideScreen { gdxGame.navigationManager.navigate(LevelScreen::class.java.name, MenuScreen::class.java.name) }
        }

    }

    private fun Group.addBtnSett() {
        btnSett.setSize(230f, 244f)
        addActorWithConstraints(btnSett) {
            endToEndOf = this@addBtnSett
            topToTopOf = this@addBtnSett

            marginEnd = 37f
            marginTop = 25f
        }

        btnSett.setOnClickListener {
            this@MenuScreen.animHideScreen { gdxGame.navigationManager.navigate(SettingsScreen::class.java.name, MenuScreen::class.java.name) }
        }

    }

    private fun Group.addBtnRecord() {
        btnRecord.setSize(230f, 244f)
        addActorWithConstraints(btnRecord) {
            startToStartOf = this@addBtnRecord
            topToTopOf     = this@addBtnRecord

            marginStart = 37f
            marginTop   = 25f
        }

        btnRecord.setOnClickListener {
            this@MenuScreen.animHideScreen { gdxGame.navigationManager.navigate(RecordScreen::class.java.name, MenuScreen::class.java.name) }
        }

    }

}