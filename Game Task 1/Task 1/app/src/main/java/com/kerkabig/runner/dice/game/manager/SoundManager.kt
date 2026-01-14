package com.kerkabig.runner.dice.game.manager

import com.badlogic.gdx.assets.AssetManager
import com.badlogic.gdx.audio.Sound

class SoundManager(var assetManager: AssetManager) {

    var loadableSoundList = mutableListOf<SoundData>()

    fun load() {
        loadableSoundList.onEach { assetManager.load(it.path, Sound::class.java) }
    }

    fun init() {
        loadableSoundList.onEach { it.sound = assetManager[it.path, Sound::class.java] }
        loadableSoundList.clear()
    }

    enum class EnumSound(val data: SoundData) {
        boom1(SoundData("sound/boom1.mp3")),
        boom2(SoundData("sound/boom2.mp3")),
        boom3(SoundData("sound/boom3.mp3")),
        boom4(SoundData("sound/boom4.mp3")),
        boom5(SoundData("sound/boom5.mp3")),
        boom6(SoundData("sound/boom6.mp3")),
        boom7(SoundData("sound/boom7.mp3")),

        touch(SoundData("sound/touch.mp3")),

        click(SoundData("sound/click.wav")),

    }

    data class SoundData(
        val path: String,
    ) {
        lateinit var sound: Sound
    }

}