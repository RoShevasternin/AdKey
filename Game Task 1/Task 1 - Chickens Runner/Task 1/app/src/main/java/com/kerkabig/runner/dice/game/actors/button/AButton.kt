package com.kerkabig.runner.dice.game.actors.button

import com.badlogic.gdx.scenes.scene2d.Actor
import com.badlogic.gdx.scenes.scene2d.InputEvent
import com.badlogic.gdx.scenes.scene2d.InputListener
import com.badlogic.gdx.scenes.scene2d.Touchable
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.utils.Drawable
import com.badlogic.gdx.scenes.scene2d.utils.NinePatchDrawable
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable
import com.kerkabig.runner.dice.game.utils.TextureEmpty
import com.kerkabig.runner.dice.game.utils.actor.animHide
import com.kerkabig.runner.dice.game.utils.actor.animShow
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedGroup
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedScreen
import com.kerkabig.runner.dice.game.utils.gdxGame
import com.kerkabig.runner.dice.game.utils.region

open class AButton(
    override val screen: AdvancedScreen,
    type: Type
) : AdvancedGroup() {

    private val defaultImage  = Image(getStyleByType(type).default)
    private val pressedImage  = Image(getStyleByType(type).pressed).apply { color.a = 0f }
    private val disabledImage = Image(getStyleByType(type).disabled).apply { color.a = 0f }

    private var onClickBlock: () -> Unit = { }

    var touchDownBlock   : AButton.(x: Float, y: Float) -> Unit = { _, _ -> }
    var touchDraggedBlock: AButton.(x: Float, y: Float) -> Unit = { _, _ -> }
    var touchUpBlock     : AButton.(x: Float, y: Float) -> Unit = { _, _ -> }

    private var area: Actor? = null

    private val animShowTime = 0.050f
    private val animHideTime = 0.400f


    override fun addActorsOnGroup() {
        addAndFillActors(getActors())
        addListener(getListener())
    }


    private fun getActors() = listOf<Actor>(
        defaultImage,
        pressedImage,
        disabledImage,
    )



    private fun getListener() = object : InputListener() {
        var isWithin     = false
        var isWithinArea = false

        override fun touchDown(event: InputEvent?, x: Float, y: Float, pointer: Int, button: Int): Boolean {
            touchDownBlock(x, y)
            touchDragged(event, x, y, pointer)

            gdxGame.soundUtil.apply { play(click) }

            event?.stop()
            return true
        }

        override fun touchDragged(event: InputEvent?, x: Float, y: Float, pointer: Int) {
            touchDraggedBlock(x, y)

            isWithin = x in 0f..width && y in 0f..height
            area?.let { isWithinArea = x in 0f..it.width && y in 0f..it.height }


            if (isWithin || isWithinArea) press() else unpress()
        }

        override fun touchUp(event: InputEvent?, x: Float, y: Float, pointer: Int, button: Int) {
            touchUpBlock(x, y)

            if (isWithin || isWithinArea) {
                unpress()
                onClickBlock()
            }
        }
    }

    fun press() {
        defaultImage.clearActions()
        pressedImage.clearActions()

        defaultImage.animHide(animShowTime)
        pressedImage.animShow(animShowTime)
    }

    fun unpress() {
        defaultImage.clearActions()
        pressedImage.clearActions()

        defaultImage.animShow(animHideTime)
        pressedImage.animHide(animHideTime)
    }

    fun disable(useDisabledStyle: Boolean = true) {
        touchable = Touchable.disabled

        if (useDisabledStyle) {
            defaultImage.clearActions()
            pressedImage.clearActions()
            disabledImage.clearActions()

            defaultImage.animHide()
            pressedImage.animHide()
            disabledImage.animShow()
        }

    }

    fun enable() {
        touchable = Touchable.enabled

        defaultImage.clearActions()
        pressedImage.clearActions()
        disabledImage.clearActions()

        defaultImage.animShow()
        pressedImage.animHide()
        disabledImage.animHide()

    }

    fun pressAndDisable(useDisabledStyle: Boolean = false) {
        press()
        disable(useDisabledStyle)
    }

    fun unpressAndEnable() {
        unpress()
        enable()
    }

    fun setStyle(style: AButtonStyle) {
        defaultImage.drawable  = style.default
        pressedImage.drawable  = style.pressed
        disabledImage.drawable = style.disabled
    }

    fun setOnClickListener(block: () -> Unit) {
        onClickBlock = block
    }

    fun addArea(actor: Actor) {
        area = actor
        actor.addListener(getListener())
    }

    private fun getStyleByType(type: Type) = when(type) {
        Type.None -> AButtonStyle(
            default = TextureRegionDrawable(TextureEmpty.region),
            pressed = TextureRegionDrawable(TextureEmpty.region),
            disabled = TextureRegionDrawable(TextureEmpty.region),
        )
        Type.Exit -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.exit_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.exit_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.exit_press),
        )
        Type.Start -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.start_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.start_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.start_press),
        )
        Type.HTP -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.htp_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.htp_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.htp_press),
        )
        Type.PP -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.pp_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.pp_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.pp_press),
        )
        Type.LEADERBOARD -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.lead_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.lead_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.lead_press),
        )
        Type.NEXT -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.next_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.next_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.next_press),
        )
        Type.MENU -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.to_menu_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.to_menu_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.to_menu_press),
        )
        Type.RESTART -> AButtonStyle(
            default = TextureRegionDrawable(gdxGame.assetsAll.restart_def),
            pressed = TextureRegionDrawable(gdxGame.assetsAll.restart_press),
            disabled = TextureRegionDrawable(gdxGame.assetsAll.restart_press),
        )
    }

    // ---------------------------------------------------
    // Style
    // ---------------------------------------------------

    data class AButtonStyle(
        var default: Drawable,
        var pressed: Drawable,
        var disabled: Drawable,
    )

    enum class Type {
        None, Exit, Start, HTP, PP, LEADERBOARD, NEXT, MENU, RESTART
    }

}