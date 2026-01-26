package com.task123.task321.game.actors.progress

import com.badlogic.gdx.scenes.scene2d.InputEvent
import com.badlogic.gdx.scenes.scene2d.InputListener
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.task123.task321.game.actors.mask.AOldMask
import com.task123.task321.game.utils.advanced.AdvancedGroup
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame
import com.task123.task321.game.utils.runGDX
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class AProgress(override val screen: AdvancedScreen): AdvancedGroup() {

    private val LENGTH = 463f

    //private val backgroundImage = Image(gdxGame.assetsAll.progress_background)
    //private val progressImage   = Image(gdxGame.assetsAll.progress_progress)
    private val armImage        = Image(gdxGame.assetsAll.cursor)
    //private val mask            = AOldMask(screen, gdxGame.assetsAll.PROGRESS_MASK, alphaHeight = 700)

    private val onePercentX = LENGTH / 100f

    // 0 .. 100 %
    val progressPercentFlow = MutableStateFlow(0f)


    override fun addActorsOnGroup() {
        addBackground()
        addMask()
        addArm()

        coroutine?.launch {
            progressPercentFlow.collect { percent ->
                runGDX {
                    armImage.x = (percent * onePercentX) - 30f
                }
            }
        }

        addListener(inputListener())
    }

    // ---------------------------------------------------
    // Add Actors
    // ---------------------------------------------------

    private fun AdvancedGroup.addBackground() {
        //addActor(backgroundImage)
        //backgroundImage.setBounds(33f, 0f, 10f, 736f)
    }

    private fun AdvancedGroup.addArm() {
        addActor(armImage)
        armImage.setBounds(0f, 0f, 60f, 60f)
    }

    private fun AdvancedGroup.addMask() {
       // addActor(mask)
       // mask.setBounds(34f, 1f, 8f, 726f)
       // mask.addProgress()
    }

    private fun AdvancedGroup.addProgress() {
        //addActor(progressImage)
        //progressImage.setBounds(0f, 0f, 8f, 726f)
    }

    // ---------------------------------------------------
    // Logic
    // ---------------------------------------------------

    private fun inputListener() = object : InputListener() {
        override fun touchDown(event: InputEvent?, x: Float, y: Float, pointer: Int, button: Int): Boolean {
            touchDragged(event, x, y, pointer)
            return true
        }

        override fun touchDragged(event: InputEvent?, x: Float, y: Float, pointer: Int) {
            progressPercentFlow.value = when {
                x <= 0 -> 0f
                x >= LENGTH -> 100f
                else -> x / onePercentX
            }

            event?.stop()
        }
    }

    fun setProgressPercent(percent: Float) {
        progressPercentFlow.value = percent
    }


}