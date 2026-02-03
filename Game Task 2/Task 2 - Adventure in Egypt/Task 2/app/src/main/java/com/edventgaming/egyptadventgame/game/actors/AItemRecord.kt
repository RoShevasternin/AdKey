package com.edventgaming.egyptadventgame.game.actors

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.edventgaming.egyptadventgame.game.utils.GameColor
import com.edventgaming.egyptadventgame.game.utils.actor.addActors
import com.edventgaming.egyptadventgame.game.utils.actor.addAndFillActor
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedGroup
import com.edventgaming.egyptadventgame.game.utils.advanced.AdvancedScreen
import com.edventgaming.egyptadventgame.game.utils.font.FontParameter
import com.edventgaming.egyptadventgame.game.utils.gdxGame

class AItemRecord(
    override val screen: AdvancedScreen,
    index: Int,
    val isUnlocked: Boolean // Додаємо цей прапорець
): AdvancedGroup() {

    override fun getPrefHeight() = height
    override fun getPrefWidth() = width


    private val parameter = FontParameter().setCharacters(FontParameter.CharType.ALL)
    private val fontTitle = screen.fontGenerator_Regular.generateFont(parameter.setSize(50).setBorder(2f, GameColor.border))
    private val fontText  = screen.fontGenerator_Regular.generateFont(parameter.setSize(36).setBorder(0f, Color.WHITE))

    private val imgPanel = Image(gdxGame.assetsAll.ITEM)
    private val imgIco   = Image(gdxGame.assetsAll.listArchiveItems[index])
    private val lblTitle = Label(listTitle[index], Label.LabelStyle(fontTitle, Color.WHITE))
    private val lblText  = Label(listText[index], Label.LabelStyle(fontText, Color.WHITE))

    override fun addActorsOnGroup() {
        addAndFillActor(imgPanel)
        addActors(imgIco, lblTitle, lblText)
        imgIco.setBounds(50f, 68f, 158f, 158f)
        lblTitle.setBounds(295f, 174f, 518f, 37f)
        lblText.setBounds(295f, 84f, 518f, 70f)
        lblText.wrap = true

        if (!isUnlocked) {
            color.a = 0.4f // Робимо напівпрозорим, якщо не відкрито

            // Можна ще додати поверх іконку замочка, якщо хочеш
            // addAndFillActor(Image(gdxGame.assetsAll.LOCK_ICON))
        } else {
            color.a = 1f // Повна яскравість для відкритих
        }
    }

    companion object {
        val listTitle = listOf(
            "Apprentice Scribe",
            "Heart of Maat",
            "Breath of Seth",
            "Sphinx's Secret",
            "Eye of Protection",
            "Scarab’s Persistence",
            "Architect of Order",
            "High Priest of Logic",
            "Lord of Two Lands",
            "Eternal Pharaoh"
        )
        val listText = listOf(
            "Completed the first trial of the sands. Your journey toward ancient wisdom begins here.",
            "Perfect sorting! Your soul is as balanced as the sacred feather. Not a single wasted move.",
            "Swift as a desert storm! You cleared the columns before the sands of time could settle.",
            "Halfway through the mysteries. You have solved the riddle of the fourth level.",
            "All pieces of the sacred relic are gathered in one column. Chaos has turned into order.",
            "Like the sacred beetle, you never stopped until the work was perfectly done.",
            "You have built a perfect sequence where others saw only ruins and confusion.",
            "The gods are impressed by your mind. Your sorting skills are truly divine and flawless.",
            "Conquered all 8 trials. You have united the desert under your perfect and absolute order.",
            "Master of the Nile and the Sands. You have achieved legendary status in the ancient valley."
        )
    }

}