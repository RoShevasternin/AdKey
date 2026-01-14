package com.kerkabig.runner.dice.game.actors

import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.utils.Align
import com.kerkabig.runner.dice.game.screens.LoaderScreen
import com.kerkabig.runner.dice.game.utils.Acts
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedGroup
import com.kerkabig.runner.dice.game.utils.gdxGame

class AMainLoader(override val screen: LoaderScreen): AdvancedGroup() {

    private val imgLogo = Image(gdxGame.assetsLoader.logo)
    private val imgA    = Image(gdxGame.assetsLoader.a)
    private val imgB    = Image(gdxGame.assetsLoader.b)
    private val imgUp   = Image(gdxGame.assetsLoader.up)

    override fun addActorsOnGroup() {
        addLogo()
        addUp()
        addAB()
    }

    // Actors ------------------------------------------------------------------------

    private fun addLogo() {
        addActor(imgLogo)
        imgLogo.apply {
            setBounds(105f, 992f, 877f, 781f)
            setOrigin(Align.center)
            addAction(Acts.forever(Acts.sequence(
                Acts.scaleTo(1.1f, 0.25f),
                Acts.scaleTo(1.0f, 0.25f),
            )))
        }
    }

    private fun addUp() {
        addActor(imgUp)
        imgUp.apply {
            setBounds(421f, 367f, 238f, 507f)
            setOrigin(Align.center or Align.bottom)
            addAction(Acts.forever(Acts.sequence(
                Acts.scaleTo(0.85f, 0.25f),
                Acts.scaleTo(1.0f, 0.25f),
            )))
        }
    }

    private fun addAB() {
        addActors(imgA, imgB)
        imgA.setBounds(-62f, -116f, 763f, 945f)
        imgB.setBounds(505f, -63f, 640f, 780f)
    }

}