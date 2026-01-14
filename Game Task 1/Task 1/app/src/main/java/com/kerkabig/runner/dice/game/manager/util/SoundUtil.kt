package com.kerkabig.runner.dice.game.manager.util

import com.badlogic.gdx.audio.Sound
import com.kerkabig.runner.dice.game.manager.AudioManager
import com.kerkabig.runner.dice.game.utils.runGDX
import com.kerkabig.runner.dice.game.manager.SoundManager
import kotlin.compareTo
import kotlin.div
import kotlin.times

class SoundUtil {

    val click = AdvancedSound(SoundManager.EnumSound.click.data.sound, 1f)
    val touch = SoundManager.EnumSound.touch.data.sound

    private val boom1 = SoundManager.EnumSound.boom1.data.sound
    private val boom2 = SoundManager.EnumSound.boom2.data.sound
    private val boom3 = SoundManager.EnumSound.boom3.data.sound
    private val boom4 = SoundManager.EnumSound.boom4.data.sound
    private val boom5 = SoundManager.EnumSound.boom5.data.sound
    private val boom6 = SoundManager.EnumSound.boom6.data.sound
    private val boom7 = SoundManager.EnumSound.boom7.data.sound

    val boomList = listOf(boom1, boom2, boom3, boom4, boom5, boom6, boom7)

    // 0..100
    var volumeLevel = AudioManager.volumeLevelPercent

    var isPause = (volumeLevel <= 0f)

    fun play(advancedSound: AdvancedSound) {
        if (isPause.not()) {
            advancedSound.apply {
                sound.play((volumeLevel / 100f) * coff)
            }
        }
    }

    data class AdvancedSound(val sound: Sound, val coff: Float)
}