package com.task123.task321.game.actors

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.ui.Label
import com.task123.task321.game.utils.GameColor
import com.task123.task321.game.utils.actor.addActors
import com.task123.task321.game.utils.actor.addAndFillActor
import com.task123.task321.game.utils.advanced.AdvancedGroup
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.font.FontParameter
import com.task123.task321.game.utils.gdxGame

class AItemRecord(
    override val screen: AdvancedScreen,
    index: Int,
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
    }

    companion object {
        val listTitle = listOf(
            "Golden Scarab",
            "Eye of Ra",
            "Ankh of Life",
            "Feather of Maat",
            "Royal Uraeus",
            "Sacred Lotus",
            "Crook and Flail",
            "Golden Sarcophagus",
            "Canopic Jar",
            "Bastet Statue",
        )
        val listText = listOf(
            "A sacred beetle rolling the sun across the sky. Symbol of rebirth and eternal luck.",
            "The all-seeing eye of the sun god. Protects from evil spirits and grants power over sands.",
            "The key of the Nile that opens the gates to eternity. Grants life force to its bearer.",
            "The symbol of truth and cosmic harmony. Measures the purity of a heart before Osiris.",
            "A royal cobra ready to strike. Guards the secrets of pharaohs and punishes intruders.",
            "A flower born from the mud. Symbol of purity, sun, and the awakening of ancient magic.",
            "Regalia of the great kings. Represents the right to lead people through desert storms.",
            "A vessel for the soul and treasures. Preserves the peace of rulers in the afterlife.",
            "A ritual jar with a god's head. Guards pieces of the soul for future reincarnation.",
            "The graceful protector of the home. Brings joy and guards against night terrors.",
        )
    }

}