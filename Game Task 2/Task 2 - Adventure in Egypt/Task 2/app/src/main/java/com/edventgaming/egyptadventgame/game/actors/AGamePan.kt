package com.edventgaming.egyptadventgame.game.actors

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.badlogic.gdx.utils.Align
import com.edventgaming.egyptadventgame.game.utils.GameColor
import com.edventgaming.egyptadventgame.game.utils.actor.HAlign
import com.edventgaming.egyptadventgame.game.utils.actor.VAlign
import com.edventgaming.egyptadventgame.game.utils.actor.addActorAligned
import com.edventgaming.egyptadventgame.game.utils.actor.addActors
import com.edventgaming.egyptadventgame.game.utils.actor.addAndFillActor
import com.edventgaming.egyptadventgame.game.utils.actor.addAndFillActors
import com.edventgaming.egyptadventgame.game.utils.actor.disable
import com.edventgaming.egyptadventgame.game.utils.actor.setBounds
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedGroup
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.font.FontParameter
import com.edventgaming.egyptadventgame.game.utils.gdxGame
import com.edventgaming.egyptadventgame.game.utils.runGDX
import kotlinx.coroutines.launch

class AGamePan(override val screen: AdvancedScreen): AdvancedGroup() {

    private val parameter = FontParameter().setCharacters(FontParameter.CharType.ALL)
    private val fontTitle = screen.fontGenerator_Regular.generateFont(parameter.setSize(44))

    private val imgPanel = Image(gdxGame.assetsAll.PANEL)
    private val lblTitle = Label("0", Label.LabelStyle(fontTitle, Color.WHITE))

    val timer = ATimer(screen)

    override fun addActorsOnGroup() {
        addAndFillActors(imgPanel)

        addActor(lblTitle)
        lblTitle.setAlignment(Align.center)
        lblTitle.setBounds(499f, 76f, 32f, 33f)

        addActor(timer)
        timer.setBounds(156f, 77f, 74f, 33f)

        coroutine?.launch {
            AGamePanel.GLOBAL_COST_FLOW.collect {
                runGDX { lblTitle.setText(it) }
            }
        }

    }

}