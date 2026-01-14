package com.kerkabig.runner.dice.game.manager.util

import com.badlogic.gdx.graphics.g2d.TextureRegion
import com.kerkabig.runner.dice.game.manager.SpriteManager

class SpriteUtil {

     class Loader {
          private fun getRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.LOADER.data.atlas.findRegion(name)

          val a    = getRegion("a")
          val b    = getRegion("b")
          val logo = getRegion("logo")
          val up   = getRegion("up")

         val BACKGROUND = SpriteManager.EnumTexture.BACKGROUND.data.texture
     }

     class All {
         private fun getAllRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.ALL.data.atlas.findRegion(name)
         private fun getEggRegion(name: String): TextureRegion = SpriteManager.EnumAtlas.EGG.data.atlas.findRegion(name)

         //private fun getNinePath(name: String): NinePatch = SpriteManager.EnumAtlas.ALL.data.atlas.createPatch(name)

         // atlas All ------------------------------------------------------------------------------

         val a             = getAllRegion("a")
         val ai_turn       = getAllRegion("ai_turn")
         val b             = getAllRegion("b")
         val circle_a      = getAllRegion("circle_a")
         val circle_b      = getAllRegion("circle_b")
         val exit_def      = getAllRegion("exit_def")
         val exit_press    = getAllRegion("exit_press")
         val finish        = getAllRegion("finish")
         val htp_def       = getAllRegion("htp_def")
         val htp_press     = getAllRegion("htp_press")
         val lead_def      = getAllRegion("lead_def")
         val lead_press    = getAllRegion("lead_press")
         val leaderboard_a = getAllRegion("leaderboard_a")
         val leaderboard_b = getAllRegion("leaderboard_b")
         val moving        = getAllRegion("moving")
         val next_def      = getAllRegion("next_def")
         val next_press    = getAllRegion("next_press")
         val point         = getAllRegion("point")
         val pp_def        = getAllRegion("pp_def")
         val pp_press      = getAllRegion("pp_press")
         val restart_def   = getAllRegion("restart_def")
         val restart_press = getAllRegion("restart_press")
         val shake         = getAllRegion("shake")
         val start         = getAllRegion("start")
         val start_def     = getAllRegion("start_def")
         val start_press   = getAllRegion("start_press")
         val to_menu_def   = getAllRegion("to_menu_def")
         val to_menu_press = getAllRegion("to_menu_press")

         // EGG ------------------------------------------------------------------------------
         val listEggA = List(6) { getEggRegion("a${it.inc()}") }
         val listEggB = List(6) { getEggRegion("b${it.inc()}") }

         // textures ------------------------------------------------------------------------------
         val HTP_1       = SpriteManager.EnumTexture.HTP_1.data.texture
         val HTP_2       = SpriteManager.EnumTexture.HTP_2.data.texture
         val LEADERBOARD = SpriteManager.EnumTexture.LEADERBOARD.data.texture

     }

}