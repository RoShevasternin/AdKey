package com.kerkabig.runner.dice.game.screens

import com.kerkabig.runner.dice.game.utils.Block
import com.kerkabig.runner.dice.game.utils.TIME_ANIM_SCREEN
import com.kerkabig.runner.dice.game.utils.actor.animDelay
import com.kerkabig.runner.dice.game.utils.actor.animHide
import com.kerkabig.runner.dice.game.utils.actor.animShow
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedScreen
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedStage

class MenuScreen: AdvancedScreen() {

    override fun AdvancedStage.addActorsOnStageUI() {
        root.color.a = 0f

        addTableGroup()

        animShow {
            //coroutine?.launch { addLevels() }
        }
    }

    override fun animHide(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageUI.root.animHide(TIME_ANIM_SCREEN)
        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun animShow(blockEnd: Block) {
        stageUI.root.children.onEach { it.clearActions() }

        stageUI.root.animShow(TIME_ANIM_SCREEN)
        stageUI.root.animDelay(TIME_ANIM_SCREEN) { blockEnd() }
    }

    // Actors ------------------------------------------------------------------------

    private fun AdvancedStage.addTableGroup() {
        //addActor(tableGroup)
        //tableGroup.setBounds(0f, 0f, 1765f, 1080f)
    }

}