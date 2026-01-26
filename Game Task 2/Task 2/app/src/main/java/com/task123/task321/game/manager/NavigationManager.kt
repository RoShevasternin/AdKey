package com.task123.task321.game.manager

import com.badlogic.gdx.Gdx
import com.task123.task321.game.GDXGame
import com.task123.task321.game.screens.GameScreen
import com.task123.task321.game.screens.LevelScreen
import com.task123.task321.game.screens.LoaderScreen
import com.task123.task321.game.screens.LoseScreen
import com.task123.task321.game.screens.MenuScreen
import com.task123.task321.game.screens.RecordScreen
import com.task123.task321.game.screens.SettingsScreen
import com.task123.task321.game.screens.WelcomeScreen
import com.task123.task321.game.screens.WinScreen
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.runGDX

class NavigationManager(val game: GDXGame) {

    private val backStack = mutableListOf<String>()
    var key: Int? = null
        private set

    fun navigate(toScreenName: String, fromScreenName: String? = null, key: Int? = null) = runGDX {
        this.key = key

        game.updateScreen(getScreenByName(toScreenName))
        backStack.filter { name -> name == toScreenName }.onEach { name -> backStack.remove(name) }
        fromScreenName?.let { fromName ->
            backStack.filter { name -> name == fromName }.onEach { name -> backStack.remove(name) }
            backStack.add(fromName)
        }
    }

    fun back(key: Int? = null) = runGDX {
        this.key = key

        if (isBackStackEmpty()) exit() else game.updateScreen(getScreenByName(backStack.removeAt(backStack.lastIndex)))
    }


    fun exit() = runGDX { Gdx.app.exit() }

    fun clearBackStack() = backStack.clear()

    fun isBackStackEmpty() = backStack.isEmpty()

    private fun getScreenByName(name: String): AdvancedScreen = when(name) {
        LoaderScreen  ::class.java.name -> LoaderScreen()
        WelcomeScreen ::class.java.name -> WelcomeScreen()
        MenuScreen    ::class.java.name -> MenuScreen()
        SettingsScreen::class.java.name -> SettingsScreen()
        RecordScreen  ::class.java.name -> RecordScreen()
        LevelScreen   ::class.java.name -> LevelScreen()
        GameScreen    ::class.java.name -> GameScreen()
        WinScreen     ::class.java.name -> WinScreen()
        LoseScreen    ::class.java.name -> LoseScreen()

        else -> MenuScreen()
    }

}