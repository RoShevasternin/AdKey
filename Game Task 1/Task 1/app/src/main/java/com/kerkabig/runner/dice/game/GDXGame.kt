package com.kerkabig.runner.dice.game

import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import com.badlogic.gdx.assets.AssetManager
import com.badlogic.gdx.utils.Disposable
import com.badlogic.gdx.utils.ScreenUtils
import com.kerkabig.runner.dice.MainActivity
import com.kerkabig.runner.dice.appContext
import com.kerkabig.runner.dice.game.manager.*
import com.kerkabig.runner.dice.game.manager.util.MusicUtil
import com.kerkabig.runner.dice.game.manager.util.SoundUtil
import com.kerkabig.runner.dice.game.manager.util.SpriteUtil
import com.kerkabig.runner.dice.game.screens.LoaderScreen
import com.kerkabig.runner.dice.game.utils.GameColor
import com.kerkabig.runner.dice.game.utils.advanced.AdvancedGame
import com.kerkabig.runner.dice.game.dataStore.DS_Record
import com.kerkabig.runner.dice.game.utils.disposeAll
import com.kerkabig.runner.dice.util.currentClassName
import com.kerkabig.runner.dice.util.log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancel

var GDX_GLOBAL_isGame = false

class GDXGame(val activity: MainActivity) : AdvancedGame() {

    lateinit var assetManager     : AssetManager      private set
    lateinit var navigationManager: NavigationManager private set
    lateinit var spriteManager    : SpriteManager     private set
    lateinit var musicManager     : MusicManager      private set
    lateinit var soundManager     : SoundManager      private set

    val assetsLoader by lazy { SpriteUtil.Loader() }
    val assetsAll    by lazy { SpriteUtil.All() }

    val musicUtil by lazy { MusicUtil()    }
    val soundUtil by lazy { SoundUtil()    }

    var backgroundColor = GameColor.background
    val disposableSet   = mutableSetOf<Disposable>()

    val coroutine = CoroutineScope(Dispatchers.Default)

    val ds_Record = DS_Record(coroutine)

    override fun create() {
        navigationManager = NavigationManager(this)
        assetManager      = AssetManager()
        spriteManager     = SpriteManager(assetManager)

        musicManager      = MusicManager(assetManager)
        soundManager      = SoundManager(assetManager)

        navigationManager.navigate(LoaderScreen::class.java.name)
    }

    override fun render() {
        ScreenUtils.clear(backgroundColor)
        super.render()
    }

    override fun dispose() {
        try {
            coroutine.cancel()
            disposableSet.disposeAll()
            disposeAll(assetManager, musicUtil)

            log("dispose $currentClassName")
            super.dispose()
        } catch (e: Exception) { log("exception: ${e.message}") }
    }

}