package com.task123.task321.game.manager.util

import com.badlogic.gdx.graphics.g2d.TextureRegion
import com.task123.task321.game.manager.SpriteManager

class SpriteUtil {

    class Loader {
        private fun getRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.LOADER.data.atlas.findRegion(name)

        val loader = getRegion("loader")

        val BACKGROUND = SpriteManager.EnumTexture.BACKGROUND.data.texture
    }

     class All {
         private fun getAllRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.ALL.data.atlas.findRegion(name)
         private fun getItemsRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.ITEMS.data.atlas.findRegion(name)

         // atlas All ------------------------------------------------------------------------------

         val back        = getAllRegion("back")
         val btn_def     = getAllRegion("btn_def")
         val btn_press   = getAllRegion("btn_press")
         val cursor      = getAllRegion("cursor")
         val lbl_block   = getAllRegion("lbl_block")
         val lvl_item    = getAllRegion("lvl_item")
         val play_def    = getAllRegion("play_def")
         val play_press  = getAllRegion("play_press")
         val record      = getAllRegion("record")
         val sett        = getAllRegion("sett")
         val vibro_check = getAllRegion("vibro_check")
         val vibro_def   = getAllRegion("vibro_def")

         // atlas List ------------------------------------------------------------------------------

         val listArchiveItems = List(10) { getAllRegion("${it.inc()}") }
         val listItems        = List(11) { getItemsRegion("${it.inc()}") }

         // textures ------------------------------------------------------------------------------

         val GAME_GRID   = SpriteManager.EnumTexture.GAME_GRID.data.texture
         val GLAZ        = SpriteManager.EnumTexture.GLAZ.data.texture
         val ITEM        = SpriteManager.EnumTexture.ITEM.data.texture
         val LEVELS      = SpriteManager.EnumTexture.LEVELS.data.texture
         val LOSE_PAN    = SpriteManager.EnumTexture.LOSE_PAN.data.texture
         val PANEL       = SpriteManager.EnumTexture.PANEL.data.texture
         val RESULT      = SpriteManager.EnumTexture.RESULT.data.texture
         val SETT_PAN    = SpriteManager.EnumTexture.SETT_PAN.data.texture
         val WELCOME_PAN = SpriteManager.EnumTexture.WELCOME_PAN.data.texture
         val WIN_PAN     = SpriteManager.EnumTexture.WIN_PAN.data.texture
     }

}