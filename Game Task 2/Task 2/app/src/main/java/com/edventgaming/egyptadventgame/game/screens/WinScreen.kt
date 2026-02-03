package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.scenes.scene2d.Actor
import com.badlogic.gdx.scenes.scene2d.Group
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.edventgaming.egyptadventgame.game.actors.AGamePanel
import com.edventgaming.egyptadventgame.game.actors.ATmpGroup
import com.edventgaming.egyptadventgame.game.utils.Block
import com.edventgaming.egyptadventgame.game.utils.TIME_ANIM_SCREEN
import com.edventgaming.egyptadventgame.game.utils.actor.addActorWithConstraints
import com.edventgaming.egyptadventgame.game.utils.actor.addActors
import com.edventgaming.egyptadventgame.game.utils.actor.addAndFillActor
import com.edventgaming.egyptadventgame.game.utils.actor.animDelay
import com.edventgaming.egyptadventgame.game.utils.actor.animHide
import com.edventgaming.egyptadventgame.game.utils.actor.animShow
import com.edventgaming.egyptadventgame.game.utils.actor.setBounds
import com.edventgaming.egyptadventgame.game.utils.actor.setOnClickListener
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.font.FontParameter
import com.edventgaming.egyptadventgame.game.utils.gdxGame

class WinScreen: AdvancedScreen() {

    private val group = ATmpGroup(this)

    private val parameter = FontParameter().setCharacters(FontParameter.CharType.ALL)
    private val fontTitle = fontGenerator_Regular.generateFont(parameter.setSize(44))

    private val imgPanel = Image(gdxGame.assetsAll.WIN_PAN)
    private val lblTitle = Label("${AGamePanel.GLOBAL_COST_FLOW.value}", Label.LabelStyle(fontTitle, Color.WHITE))

    override fun show() {
        gdxGame.soundUtil.apply { play(win_game) }
        gdxGame.ds_key.update { if (it < 8) it + 1 else it }

        // Отримуємо поточний рівень ДО оновлення
        val currentLevel = gdxGame.ds_key.flow.value

        // --- ЛОГІКА АЧІВОК ---

        // 1. Ачівка за 1-й рівень (Apprentice Scribe)
        if (currentLevel == 1) RecordScreen.unlockAchievement(0)

        // 2. Ачівка за 4-й рівень (Sphinx's Secret)
        if (currentLevel == 4) RecordScreen.unlockAchievement(3)

        // 3. Ачівка за завершення гри (Lord of Two Lands)
        if (currentLevel == 8) RecordScreen.unlockAchievement(8)

        // 4. Ачівка "Eye of Protection" (коли зібрав хоча б одну повну колону)
        // Оскільки ми на WinScreen — гравець точно зібрав 6 колон.
        RecordScreen.unlockAchievement(4)

        // Scarab’s Persistence (індекс 5) - наприклад, за проходження 5 рівня
        if (currentLevel >= 5) RecordScreen.unlockAchievement(5)

        // Eternal Pharaoh (індекс 9) - якщо пройдено всі рівні
        if (gdxGame.ds_key.flow.value >= 8) RecordScreen.unlockAchievement(9)

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
            lblTitle.setBounds(501f, 466f, 32f, 33f)

            val aM = Actor()
            val aR = Actor()
            val aP = Actor()
            addActors(aM, aR, aP)
            aM.setBounds(154f, 67f, 175f, 175f)
            aR.setBounds(377f, 67f, 175f, 175f)
            aP.setBounds(600f, 67f, 175f, 175f)
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
            aP.setOnClickListener(gdxGame.soundUtil) {
                animHideScreen {
                    gdxGame.navigationManager.navigate(GameScreen::class.java.name)
                }
            }
        }

    }

}