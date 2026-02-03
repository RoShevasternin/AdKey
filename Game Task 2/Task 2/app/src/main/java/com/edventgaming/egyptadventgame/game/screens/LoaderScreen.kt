package com.edventgaming.egyptadventgame.game.screens

import com.badlogic.gdx.scenes.scene2d.Group
import com.edventgaming.egyptadventgame.game.GDX_GLOBAL_isGame
import com.edventgaming.egyptadventgame.game.actors.AMainLoader
import com.edventgaming.egyptadventgame.game.manager.MusicManager
import com.edventgaming.egyptadventgame.game.manager.SoundManager
import com.edventgaming.egyptadventgame.game.manager.SpriteManager
import com.edventgaming.egyptadventgame.game.utils.Block
import com.edventgaming.egyptadventgame.game.utils.HEIGHT_UI
import com.edventgaming.egyptadventgame.game.utils.TIME_ANIM_SCREEN
import com.edventgaming.egyptadventgame.game.utils.WIDTH_UI
import com.edventgaming.egyptadventgame.game.utils.actor.HAlign
import com.edventgaming.egyptadventgame.game.utils.actor.VAlign
import com.edventgaming.egyptadventgame.game.utils.actor.addActorAligned
import com.edventgaming.egyptadventgame.game.utils.actor.animHide
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.gdxGame
import com.edventgaming.egyptadventgame.util.log
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class LoaderScreen : AdvancedScreen() {

    private val progressFlow     = MutableStateFlow(0f)
    private var isFinishLoading  = false
    private var isFinishProgress = false

    val aMain by lazy { AMainLoader(this) }

    override fun show() {
        loadSplashAssets()
        setBackBackground(gdxGame.assetsLoader.BACKGROUND)
        super.show()
        loadAssets()
        collectProgress()
    }

    override fun render(delta: Float) {
        super.render(delta)
        loadingAssets()
        isFinish()
    }

    override fun Group.addActorsOnStageUI() {
        //aMain.debug()
        aMain.setSize(WIDTH_UI, HEIGHT_UI)
        addActorAligned(aMain, HAlign.CENTER, VAlign.CENTER)
    }

    override fun animHideScreen(blockEnd: Block) {
        aMain.animHide(TIME_ANIM_SCREEN) { blockEnd() }
    }

    override fun animShowScreen(blockEnd: Block) {}

    // Logic ------------------------------------------------------------------------

    private fun loadSplashAssets() {
        with(gdxGame.spriteManager) {
            loadableAtlasList = mutableListOf(SpriteManager.EnumAtlas.LOADER.data)
            loadAtlas()
            loadableTexturesList = mutableListOf(SpriteManager.EnumTexture.BACKGROUND.data)
            loadTexture()
        }
        gdxGame.assetManager.finishLoading()
        gdxGame.spriteManager.initAtlasAndTexture()
    }

    private fun loadAssets() {
        with(gdxGame.spriteManager) {
            loadableAtlasList = SpriteManager.EnumAtlas.entries.map { it.data }.toMutableList()
            loadAtlas()
            loadableTexturesList = SpriteManager.EnumTexture.entries.map { it.data }.toMutableList()
            loadTexture()
        }
        with(gdxGame.musicManager) {
            loadableMusicList = MusicManager.EnumMusic.entries.map { it.data }.toMutableList()
            load()
        }
        with(gdxGame.soundManager) {
            loadableSoundList = SoundManager.EnumSound.entries.map { it.data }.toMutableList()
            load()
        }
    }

    private fun initAssets() {
        gdxGame.spriteManager.initAtlasAndTexture()
        gdxGame.musicManager.init()
        gdxGame.soundManager.init()
    }

    private fun loadingAssets() {
        if (isFinishLoading.not()) {
            if (gdxGame.assetManager.update(16)) {
                isFinishLoading = true
                initAssets()
            }
            progressFlow.value = gdxGame.assetManager.progress
        }
    }

    private fun collectProgress() {
        coroutine?.launch {
            var progress = 0
            progressFlow.collect { p ->
                while (progress < (p * 100)) {
                    progress += 1
                    //runGDX { aMain.progressLbl.setText("$progress%") }
                    if (progress % 50 == 0) log("progress = $progress%")
                    if (progress == 100) isFinishProgress = true

                    //delay((5..10).shuffled().first().toLong())
                }
            }
        }
    }

    private fun isFinish() {
        if (isFinishProgress && GDX_GLOBAL_isGame) {
            isFinishProgress = false

            gdxGame.musicUtil.apply { currentMusic = moses.apply {
                isLooping = true
                coff      = 0.65f
            } }

            animHideScreen { gdxGame.navigationManager.navigate(WelcomeScreen::class.java.name) }

        }
    }


}