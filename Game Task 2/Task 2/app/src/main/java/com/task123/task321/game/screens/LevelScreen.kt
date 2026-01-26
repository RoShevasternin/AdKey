package com.task123.task321.game.screens

import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.task123.task321.game.actors.AItemLevel
import com.task123.task321.game.actors.ATmpGroup
import com.task123.task321.game.actors.button.AImageButton
import com.task123.task321.game.utils.Block
import com.task123.task321.game.utils.HEIGHT_UI
import com.task123.task321.game.utils.TIME_ANIM_SCREEN
import com.task123.task321.game.utils.WIDTH_UI
import com.task123.task321.game.utils.actor.HAlign
import com.task123.task321.game.utils.actor.VAlign
import com.task123.task321.game.utils.actor.addActorAligned
import com.task123.task321.game.utils.actor.addActorWithConstraints
import com.task123.task321.game.utils.actor.addAndFillActor
import com.task123.task321.game.utils.actor.animDelay
import com.task123.task321.game.utils.actor.animHide
import com.task123.task321.game.utils.actor.animShow
import com.task123.task321.game.utils.actor.setOnClickListener
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame

class LevelScreen: AdvancedScreen() {

    companion object {
        val GLOBAL_SELECTED_LVL = 0
    }

    private val group   = ATmpGroup(this)
    private val btnBack = AImageButton(this, AImageButton.Type.BACK)

    override fun show() {
        stageUI.root.color.a = 0f
        setBackBackground(gdxGame.assetsAll.LEVELS)
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        group.setSize(WIDTH_UI, HEIGHT_UI)
        addActorAligned(group, HAlign.CENTER, VAlign.CENTER)
        group.apply {
            addAndFillActor(Image(gdxGame.assetsAll.LEVELS))
            addListLvl()
        }

        addBtnBack()
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
            this@LevelScreen.animHideScreen { gdxGame.navigationManager.back() }
        }

    }

    private fun Group.addListLvl() {
        val lvl = gdxGame.ds_key.flow.value

        repeat(8) { index ->
            val item = AItemLevel(this@LevelScreen, index)
            item.setBounds(listPos[index].x, listPos[index].y, 167f, 167f)
            addActor(item)

            if (index.inc() > lvl) item.closed()

            item.setOnClickListener(gdxGame.soundUtil) {
                this@LevelScreen.animHideScreen { gdxGame.navigationManager.navigate(GameScreen::class.java.name, LevelScreen::class.java.name) }
            }
        }
    }

    private val listPos = listOf(
        Vector2(424f, 1644f),
        Vector2(527f, 1446f),
        Vector2(496f, 1225f),
        Vector2(349f, 1003f),
        Vector2(605f, 776f),
        Vector2(433f, 537f),
        Vector2(569f, 296f),
        Vector2(491f, 37f),
    )


}