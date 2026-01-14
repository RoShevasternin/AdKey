package com.kerkabig.runner.dice.game.screens

import com.kerkabig.runner.dice.game.utils.Block
import com.kerkabig.runner.dice.game.utils.TIME_ANIM_SCREEN
import com.kerkabig.runner.dice.game.utils.actor.animDelay
import com.kerkabig.runner.dice.game.utils.actor.animHide
import com.kerkabig.runner.dice.game.utils.actor.animShow
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedScreen
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedStage
import com.kerkabig.runner.dice.game.utils.font.FontParameter
import com.kerkabig.runner.dice.game.utils.gdxGame
import com.kerkabig.runner.dice.util.log

class GameScreen(): AdvancedScreen() {

    private val parameter = FontParameter().setCharacters(FontParameter.CharType.ALL)
    private val font30    = fontGenerator_Inter.generateFont(parameter.setSize(30))

//    private val lblFPS   = Label("", LabelStyle(font30, GameColor.white))

    override fun show() {
        stageBackScreen.root.color.a = 0f
        stageUI.root.color.a   = 0f

        setBackBackground(gdxGame.assetsLoader.BACKGROUND)

        super.show()

        animShow {
            log("Hello World")
        }
    }

    override fun animShow(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageBackScreen.root.animShow(TIME_ANIM_SCREEN)
        stageUI.root.animShow(TIME_ANIM_SCREEN)

        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun animHide(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageBackScreen.root.animHide(TIME_ANIM_SCREEN)
        stageUI.root.animHide(TIME_ANIM_SCREEN)

        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun AdvancedStage.addActorsOnStageUI() {

    }

    // Actors ------------------------------------------------------------------------

    private fun AdvancedStage.addMainPanel() {
    }

}