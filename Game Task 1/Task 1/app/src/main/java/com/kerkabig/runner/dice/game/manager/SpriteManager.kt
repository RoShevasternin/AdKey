package com.kerkabig.runner.dice.game.manager

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
        LOADER(AtlasData("atlas/loader.atlas")),

        ALL(AtlasData("atlas/all.atlas")),
        EGG(AtlasData("atlas/egg.atlas")),
    }

    enum class EnumTexture(val data: TextureData) {
        BACKGROUND(TextureData("textures/loader/background.png")),

        // ALL
        HTP_1      (TextureData("textures/all/htp_1.png")),
        HTP_2      (TextureData("textures/all/htp_2.png")),
        LEADERBOARD(TextureData("textures/all/leaderboard.png")),
        PANEL      (TextureData("textures/all/panel.png")),
        ARROW      (TextureData("textures/all/arrow.png")),
        WIN        (TextureData("textures/all/win.png")),
        LOSE       (TextureData("textures/all/lose.png")),
    }

    data class AtlasData(val path: String) {
        lateinit var atlas: TextureAtlas
    }

    data class TextureData(val path: String) {
        lateinit var texture: Texture
    }

}