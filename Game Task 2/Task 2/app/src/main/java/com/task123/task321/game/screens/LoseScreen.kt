package com.task123.task321.game.screens

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.scenes.scene2d.Actor
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.task123.task321.game.actors.AGamePanel
import com.task123.task321.game.actors.ATmpGroup
import com.task123.task321.game.utils.Block
import com.task123.task321.game.utils.TIME_ANIM_SCREEN
import com.task123.task321.game.utils.actor.addActorWithConstraints
import com.task123.task321.game.utils.actor.addActors
import com.task123.task321.game.utils.actor.addAndFillActor
import com.task123.task321.game.utils.actor.animDelay
import com.task123.task321.game.utils.actor.animHide
import com.task123.task321.game.utils.actor.animShow
import com.task123.task321.game.utils.actor.setBounds
import com.task123.task321.game.utils.actor.setOnClickListener
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.font.FontParameter
import com.task123.task321.game.utils.gdxGame

class LoseScreen: AdvancedScreen() {

    private val group = ATmpGroup(this)

    private val parameter = FontParameter().setCharacters(FontParameter.CharType.ALL)
    private val fontTitle = fontGenerator_Regular.generateFont(parameter.setSize(44))

    private val imgPanel = Image(gdxGame.assetsAll.LOSE_PAN)
    private val lblTitle = Label("0", Label.LabelStyle(fontTitle, Color.WHITE))

    override fun show() {
        gdxGame.soundUtil.apply { play(lose_game) }

        stageUI.root.color.a = 0f
        setBackBackground(gdxGame.assetsAll.RESULT)
        super.show()
        animShowScreen()
    }

    override fun Group.addActorsOnStageUI() {
        addGroup()
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

    private fun Group.addGroup() {
        group.setSize(930f, 1039f)
        addActorWithConstraints(group) {
            startToStartOf   = this@addGroup
            endToEndOf       = this@addGroup
            topToTopOf       = this@addGroup
            bottomToBottomOf = this@addGroup
        }

        group.apply {
            addAndFillActor(imgPanel)

            addActor(lblTitle)
            lblTitle.setBounds(520f, 466f, 32f, 33f)

            val aM = Actor()
            val aR = Actor()
            addActors(aM, aR)
            aM.setBounds(266f, 67f, 175f, 175f)
            aR.setBounds(489f, 67f, 175f, 175f)
            aM.setOnClickListener(gdxGame.soundUtil) {
                animHideScreen {
                    gdxGame.navigationManager.clearBackStack()
                    gdxGame.navigationManager.navigate(MenuScreen::class.java.name)
                }
            }
            aR.setOnClickListener(gdxGame.soundUtil) {
                animHideScreen {
                    gdxGame.navigationManager.navigate(GameScreen::class.java.name)
                }
            }
        }

    }

}