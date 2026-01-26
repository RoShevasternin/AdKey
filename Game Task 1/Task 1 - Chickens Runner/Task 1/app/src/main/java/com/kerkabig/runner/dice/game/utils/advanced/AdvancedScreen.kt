package com.kerkabig.runner.dice.game.utils.advanced

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Input
import com.badlogic.gdx.InputMultiplexer
import com.badlogic.gdx.ScreenAdapter
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.TextureRegion
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable
import com.badlogic.gdx.utils.Disposable
import com.badlogic.gdx.utils.viewport.FitViewport
import com.badlogic.gdx.utils.viewport.ScreenViewport
import com.kerkabig.runner.dice.game.utils.*
import com.kerkabig.runner.dice.game.utils.font.FontGenerator
import com.kerkabig.runner.dice.game.utils.font.FontGenerator.Companion.FontPath
import com.kerkabig.runner.dice.util.cancelCoroutinesAll
import com.kerkabig.runner.dice.util.currentClassName
import com.kerkabig.runner.dice.util.log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers

abstract class AdvancedScreen(
    val WIDTH : Float = WIDTH_UI,
    val HEIGHT: Float = HEIGHT_UI
) : ScreenAdapter(), IInputAdapter {

    val viewportBackScreen by lazy { ScreenViewport() }
    val stageBackScreen    by lazy { AdvancedStage(viewportBackScreen) }

    val viewportUI by lazy { FitViewport(WIDTH, HEIGHT) }
    val stageUI    by lazy { AdvancedStage(viewportUI) }

    val inputMultiplexer    = InputMultiplexer()

    val backBackgroundImage = Image()
    val uiBackgroundImage   = Image()

    val disposableSet = mutableSetOf<Disposable>()
    var coroutine: CoroutineScope? = CoroutineScope(Dispatchers.Default)
        private set

    val drawerUtil by lazy { ShapeDrawerUtil(stageUI.batch) }

    private val scalerVector = Vector2()
    val scalerUItoScreen     = SizeScaler(SizeScaler.Axis.X, WIDTH_UI)

    val fontGenerator_Inter = FontGenerator(FontPath.Inter)

    override fun resize(width: Int, height: Int) {
        viewportBackScreen.update(width, height, true)
        viewportUI.update(width, height, true)

        scalerUItoScreen.calculateScale(scalerVector.set(width.toFloat(), height.toFloat()))
    }

    override fun show() {
        log("show AdvancedScreen: $currentClassName")
        stageBackScreen.addAndFillActor(backBackgroundImage)
        stageUI.addAndFillActor(uiBackgroundImage)

        stageBackScreen.addActorsOnStageBackScreen()
        stageUI.addActorsOnStageUI()

        Gdx.input.inputProcessor = inputMultiplexer.apply { addProcessors(this@AdvancedScreen, stageUI, stageBackScreen) }
        Gdx.input.setCatchKey(Input.Keys.BACK, true)
    }

    override fun render(delta: Float) {
        stageBackScreen.render()
        stageUI.render()
        drawerUtil.update()
    }

    override fun dispose() {
        log("dispose AdvancedScreen: $currentClassName")
        disposeAll(
            stageBackScreen, stageUI, drawerUtil,
            fontGenerator_Inter
        )
        disposableSet.disposeAll()
        inputMultiplexer.clear()
        cancelCoroutinesAll(coroutine)
        coroutine = null
    }

    override fun keyDown(keycode: Int): Boolean {
        when(keycode) {
            Input.Keys.BACK -> {
                if (gdxGame.navigationManager.isBackStackEmpty()) gdxGame.navigationManager.exit()
                else animHide { gdxGame.navigationManager.back() }
            }
        }
        return true
    }

    abstract fun animShow(blockEnd: Block = {})
    abstract fun animHide(blockEnd: Block = {})

    open fun AdvancedStage.addActorsOnStageBackScreen() {}
    open fun AdvancedStage.addActorsOnStageUI() {}

    fun setBackBackground(region: TextureRegion) {
        backBackgroundImage.drawable = TextureRegionDrawable(region)
    }

    fun setBackBackground(texture: Texture) {
        backBackgroundImage.drawable = TextureRegionDrawable(texture)
    }

    fun setUIBackground(region: TextureRegion) {
        uiBackgroundImage.drawable = TextureRegionDrawable(region)
    }

    fun setUIBackground(texture: Texture) {
        uiBackgroundImage.drawable = TextureRegionDrawable(texture)
    }

    fun setBackgrounds(backRegion: TextureRegion, uiRegion: TextureRegion = backRegion) {
        setBackBackground(backRegion)
        setUIBackground(uiRegion)
    }

    fun setBackgrounds(backTexture: Texture, uiTexture: Texture = backTexture) {
        setBackBackground(backTexture)
        setUIBackground(uiTexture)
    }

}