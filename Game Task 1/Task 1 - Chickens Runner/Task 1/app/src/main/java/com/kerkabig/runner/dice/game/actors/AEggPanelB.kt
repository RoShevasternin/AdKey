package com.kerkabig.runner.dice.game.actors

import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable
import com.badlogic.gdx.utils.Align
import com.kerkabig.runner.dice.game.utils.Acts
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedGroup
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedScreen
import com.kerkabig.runner.dice.game.utils.gdxGame

class AEggPanelB(override val screen: AdvancedScreen): AdvancedGroup() {

    // Список текстур для цифр від 1 до 6
    private val eggTextures = gdxGame.assetsAll.listEggB
    private val listIndex = (0..eggTextures.lastIndex)

    private val imgPanel = Image(gdxGame.assetsAll.circle_b)
    private val imgEgg = Image(eggTextures.first())

    private var randomIndex = 0

    override fun addActorsOnGroup() {
        addAndFillActor(imgPanel)
        addImgEgg()
    }

    private fun addImgEgg() {
        addActor(imgEgg)
        imgEgg.setBounds(136f, 115f, 208f, 251f)
        imgEgg.setOrigin(Align.center) // Важливо для обертання або масштабування
    }

    fun shakeEgg(endBlock: (Int) -> Unit) {
        // 1. Очищуємо попередні дії, якщо вони є
        imgEgg.clearActions()

        randomIndex = listIndex.random()

        // Початкова позиція
        val startX = 136f
        val duration = 2f
        val shakeIntensity = 5f // Сила трясіння в пікселях

        // 2. Анімація трясіння (Shake Action)
        val shakeAction = Acts.repeat(
            20, Acts.sequence(
                Acts.moveTo(startX - shakeIntensity, 115f, 0.05f),
                Acts.moveTo(startX + shakeIntensity, 115f, 0.05f)
            )
        )

        // 3. Анімація зміни цифр (Runnable Action)
        // Змінюємо текстуру кожні 0.3 секунди протягом 2 секунд
        val changeTextureAction = Acts.repeat(
            6, Acts.sequence(
            Acts.delay(0.3f),
            Acts.run {
                val randomTexture = eggTextures.random()
                imgEgg.drawable = TextureRegionDrawable(randomTexture)
            }
        ))

        // 4. Повернення в центр після завершення
        val resetAction = Acts.moveTo(startX, 115f, 0.1f)

        // Запускаємо все паралельно
        imgEgg.addAction(
            Acts.sequence(
                Acts.parallel(shakeAction, changeTextureAction),
                resetAction,
                Acts.run {
                    imgEgg.drawable = TextureRegionDrawable(eggTextures[randomIndex])
                    endBlock(randomIndex + 1)
                }
            )
        )
    }


}