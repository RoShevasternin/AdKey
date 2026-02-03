package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.edventgaming.egyptadventgame.game.actors.AItemLevel
import com.edventgaming.egyptadventgame.game.actors.ATmpGroup
import com.edventgaming.egyptadventgame.game.actors.button.AImageButton
import com.edventgaming.egyptadventgame.game.utils.*
import com.edventgaming.egyptadventgame.game.utils.actor.*
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen

class LevelScreen: AdvancedScreen() {

    private val group   = ATmpGroup(this)
    private val btnBack = AImageButton(this, AImageButton.Type.BACK)

    override fun show() {
        stageUI.root.color.a = 0f
        //setBackBackground(drawerUtil.getTexture(com.badlogic.gdx.graphics.Color.valueOf("9A433E")))
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        group.setSize(WIDTH_UI, HEIGHT_UI)
        stageUI2.root.addActorAligned(group, HAlign.CENTER, VAlign.CENTER)
        group.apply {
            addAndFillActor(Image(gdxGame.assetsAll.LEVELS))
            addListLvl()
        }

        stageUI2.root.addBtnBack()
    }

    override fun animHideScreen(blockEnd: Block) {
        stageUI2.root.children.onEach { it.clearActions() }

        stageUI2.root.animHide(TIME_ANIM_SCREEN)
        stageUI2.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun animShowScreen(blockEnd: Block) {
        stageUI2.root.children.onEach { it.clearActions() }

        stageUI2.root.animShow(TIME_ANIM_SCREEN)
        stageUI2.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
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