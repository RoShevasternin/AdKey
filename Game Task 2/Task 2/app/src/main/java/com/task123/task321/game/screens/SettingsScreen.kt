package com.task123.task321.game.screens

import com.badlogic.gdx.scenes.scene2d.Actor
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.task123.task321.game.actors.ATmpGroup
import com.task123.task321.game.actors.checkbox.ACheckBox
import com.task123.task321.game.actors.progress.AProgress
import com.task123.task321.game.utils.Block
import com.task123.task321.game.utils.TIME_ANIM_SCREEN
import com.task123.task321.game.utils.actor.*
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame
import com.task123.task321.game.utils.runGDX
import kotlinx.coroutines.launch

class SettingsScreen: AdvancedScreen() {

    companion object {
        var IS_VIBRO = true
            private set
    }

    private val groupSettings = ATmpGroup(this)
    private val imgSettings   = Image(gdxGame.assetsAll.SETT_PAN)
    private val btnBack       = Actor()
    private val btnStar       = Actor()
    private val boxVibro      = ACheckBox(this, ACheckBox.Type.VIBRO)
    private val progress      = AProgress(this)

    override fun show() {
        stageUI.root.color.a = 0f
        setBackBackground(gdxGame.assetsLoader.BACKGROUND)
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        addGroupSettings()

        groupSettings.apply {
            addImgSettings()
            addBtnBack()
            addBtnStar()
            addBoxVibro()
            addAProgress()
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

    private fun Group.addGroupSettings() {
        groupSettings.setSize(905f, 1123f)
        addActorWithConstraints(groupSettings) {
            startToStartOf   = this@addGroupSettings
            endToEndOf       = this@addGroupSettings
            topToTopOf       = this@addGroupSettings
            bottomToBottomOf = this@addGroupSettings
        }
    }

    private fun Group.addImgSettings() {
        addAndFillActor(imgSettings)
    }

    private fun Group.addBtnBack() {
        addActor(btnBack)
        btnBack.setBounds(788f, 1006f, 117f, 117f)
        btnBack.setOnClickListener(gdxGame.soundUtil) {
            this@SettingsScreen.animHideScreen { gdxGame.navigationManager.back() }
        }
    }

    private fun Group.addBtnStar() {
        addActor(btnStar)
        btnStar.setBounds(236f, 134f, 400f, 112f)
        btnStar.setOnClickListener(gdxGame.soundUtil) { gdxGame.activity.openPlayMarket() }
    }

    private fun Group.addBoxVibro() {
        addActor(boxVibro)
        boxVibro.setBounds(405f, 384f, 62f, 63f)
        boxVibro.setOnCheckListener {
            IS_VIBRO = it.not()
        }
    }

    private fun Group.addAProgress() {
        addActor(progress)
        progress.setBounds(206f, 592f, 463f, 60f)

        progress.progressPercentFlow.value = gdxGame.musicUtil.volumeLevelFlow.value

        coroutine?.launch {
            progress.progressPercentFlow.collect {
                runGDX {
                    gdxGame.musicUtil.volumeLevelFlow.value = it
                }
            }
        }
    }

}