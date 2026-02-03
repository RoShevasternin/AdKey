package com.edventgaming.egyptadventgame.game.actors

import com.badlogic.gdx.math.Interpolation
import com.badlogic.gdx.scenes.scene2d.actions.Actions
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.utils.Align
import com.edventgaming.egyptadventgame.game.screens.LoaderScreen
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedGroup
import com.edventgaming.egyptadventgame.game.utils.gdxGame

class AMainLoader(override val screen: LoaderScreen): AdvancedGroup() {

    private val loaderImg = Image(gdxGame.assetsLoader.loader)

    override fun addActorsOnGroup() {
        addLoader()
    }

    // Actors ------------------------------------------------------------------------

    private fun addLoader() {
        addActor(loaderImg)
        loaderImg.apply {
            setBounds(307f, 726f, 467f, 467f)
            setOrigin(Align.center) // Обов'язково для симетричного збільшення

            // Очищуємо попередні екшени, щоб вони не накладалися
            clearActions()

            // Створюємо безкінечну послідовність
            addAction(Actions.forever(
                Actions.sequence(
                    // 1. Збільшення та легке висвітлення
                    Actions.parallel(
                        Actions.scaleTo(1.1f, 1.1f, 1.2f-0.5f, Interpolation.sineOut),
                        Actions.alpha(1f, 1.2f-0.5f, Interpolation.sineOut)
                    ),
                    // 2. Зменшення та легке затухання
                    Actions.parallel(
                        Actions.scaleTo(0.9f, 0.9f, 1.5f-0.5f, Interpolation.sineIn),
                        Actions.alpha(0.7f, 1.5f-0.5f, Interpolation.sineIn)
                    )
                )
            ))
        }
    }

}