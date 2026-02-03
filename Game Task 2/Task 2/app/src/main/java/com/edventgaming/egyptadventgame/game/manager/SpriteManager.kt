package com.edventgaming.egyptadventgame.game.manager

import com.badlogic.gdx.assets.AssetManager
import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.TextureAtlas

class SpriteManager(var assetManager: AssetManager) {

    var loadableAtlasList   = mutableListOf<AtlasData>()
    var loadableTexturesList   = mutableListOf<TextureData>()

    fun loadAtlas() {
        loadableAtlasList.onEach { assetManager.load(it.path, TextureAtlas::class.java) }
    }

    fun initAtlas() {
        loadableAtlasList.onEach { it.atlas = assetManager[it.path, TextureAtlas::class.java] }
        loadableAtlasList.clear()
    }

    // Texture
    fun loadTexture() {
        loadableTexturesList.onEach { assetManager.load(it.path, Texture::class.java) }
    }

    fun initTexture() {
        loadableTexturesList.onEach { it.texture = assetManager[it.path, Texture::class.java] }
        loadableTexturesList.clear()
    }

    fun initAtlasAndTexture() {
        initAtlas()
        initTexture()
    }


    enum class EnumAtlas(val data: AtlasData) {
        LOADER   (AtlasData("atlas/loader.atlas")   ),
        ALL      (AtlasData("atlas/all.atlas")      ),
        ITEMS    (AtlasData("atlas/items.atlas")),
    }

    enum class EnumTexture(val data: TextureData) {
        BACKGROUND(TextureData("textures/loader/background.png")),

        GAME_GRID  (TextureData("textures/all/game_grid.png")),
        GLAZ       (TextureData("textures/all/glaz.png")),
        ITEM       (TextureData("textures/all/item.png")),
        LEVELS     (TextureData("textures/all/levels.png")),
        LOSE_PAN   (TextureData("textures/all/lose_pan.png")),
        PANEL      (TextureData("textures/all/panel.png")),
        RESULT     (TextureData("textures/all/result.png")),
        SETT_PAN   (TextureData("textures/all/sett_pan.png")),
        WELCOME_PAN(TextureData("textures/all/welcome_pan.png")),
        WIN_PAN    (TextureData("textures/all/win_pan.png")),
    }

    data class AtlasData(val path: String) {
        lateinit var atlas: TextureAtlas
    }

    data class TextureData(val path: String) {
        lateinit var texture: Texture
    }

}