package com.task123.task321.game.actors.button

import com.badlogic.gdx.graphics.g2d.TextureRegion
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.utils.Align
import com.task123.task321.game.utils.actor.HAlign
import com.task123.task321.game.utils.actor.VAlign
import com.task123.task321.game.utils.actor.addActorAligned
import com.task123.task321.game.utils.actor.addAndFillActor
import com.task123.task321.game.utils.actor.disable
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame

open class AImageButton(
    override val screen: AdvancedScreen,
    type: Type,
) : AButton(screen, AButton.Type.DEF) {

    private val dataType = getDataType(type)
    private val img      = Image(dataType.region).apply { setSize(dataType.size.x, dataType.size.y) }

    override fun addActorsOnGroup() {
        super.addActorsOnGroup()

        img.disable()
        addActorAligned(img, HAlign.CENTER, VAlign.CENTER)
    }

    private fun getDataType(type: Type) = when(type) {
        Type.SETTINGS -> DataType(
            region = gdxGame.assetsAll.sett,
            size   = Vector2(90f, 96f)
        )
        Type.RECORD -> DataType(
            region = gdxGame.assetsAll.record,
            size   = Vector2(96f, 96f)
        )
        Type.BACK -> DataType(
            region = gdxGame.assetsAll.back,
            size   = Vector2(140f, 140f)
        )
    }

    data class DataType(
        val region: TextureRegion,
        val size  : Vector2
    )

    enum class Type {
        SETTINGS, RECORD, BACK
    }

}