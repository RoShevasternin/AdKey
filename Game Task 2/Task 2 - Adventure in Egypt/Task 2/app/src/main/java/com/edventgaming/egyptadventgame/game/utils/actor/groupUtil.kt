package com.edventgaming.egyptadventgame.game.utils.actor

import com.badlogic.gdx.scenes.scene2d.Actor
import com.badlogic.gdx.scenes.scene2d.Group

enum class HAlign { START, CENTER, END }
enum class VAlign { BOTTOM, CENTER, TOP }

fun Group.addAndFillActor(actor: Actor) {
    addActor(actor)
    actor.setSize(width, height)
}

fun Group.addAndFillActors(actors: List<Actor>) {
    actors.forEach { addAndFillActor(it) }
}

fun Group.addAndFillActors(vararg actors: Actor) {
    actors.forEach { addAndFillActor(it) }
}

fun Group.addActors(vararg actors: Actor) {
    actors.forEach { addActor(it) }
}

fun Group.addActors(actors: List<Actor>) {
    actors.forEach { addActor(it) }
}

fun Group.addActorAligned(
    actor: Actor,
    h: HAlign = HAlign.START,
    v: VAlign = VAlign.BOTTOM,
) {
    addActor(actor)

    val x = when (h) {
        HAlign.START  -> 0f
        HAlign.CENTER -> (width - actor.width) / 2f
        HAlign.END    -> width - actor.width
    }

    val y = when (v) {
        VAlign.BOTTOM -> 0f
        VAlign.CENTER -> (height - actor.height) / 2f
        VAlign.TOP    -> height - actor.height
    }

    actor.setPosition(x, y)
}

fun Group.addActorWithConstraints(actor: Actor, block: ConstraintLayoutParams.() -> Unit) {
    val lp = ConstraintLayoutParams().apply(block)
    addActor(actor)

    val w = actor.width
    val h = actor.height

    require(w > 0 && h > 0) { "Спочатку встанови width and height!" }

    fun getLeft(t: Actor): Float = if (t == this) 0f else t.x
    fun getRight(t: Actor): Float = if (t == this) width else t.x + t.width
    fun getBottom(t: Actor): Float = if (t == this) 0f else t.y
    fun getTop(t: Actor): Float = if (t == this) height else t.y + t.height

    // ---------- HORIZONTAL LOGIC ----------
    val startBound = when {
        lp.startToStartOf != null -> getLeft(lp.startToStartOf!!) + lp.marginStart
        lp.startToEndOf   != null -> getRight(lp.startToEndOf!!) + lp.marginStart
        else -> null
    }

    val endBound = when {
        lp.endToStartOf != null -> getLeft(lp.endToStartOf!!) - lp.marginEnd
        lp.endToEndOf   != null -> getRight(lp.endToEndOf!!) - lp.marginEnd
        else -> null
    }

    val x = when {
        startBound != null && endBound != null -> {
            // Центрування між двома межами
            startBound + (endBound - startBound - w) * lp.horizontalBias
        }
        startBound != null -> startBound
        endBound   != null -> endBound - w
        else -> lp.marginStart
    }

    // ---------- VERTICAL LOGIC ----------
    val topBound = when {
        lp.topToTopOf    != null -> getTop(lp.topToTopOf!!) - lp.marginTop
        lp.topToBottomOf != null -> getBottom(lp.topToBottomOf!!) - lp.marginTop
        else -> null
    }

    val bottomBound = when {
        lp.bottomToTopOf    != null -> getTop(lp.bottomToTopOf!!) + lp.marginBottom
        lp.bottomToBottomOf != null -> getBottom(lp.bottomToBottomOf!!) + lp.marginBottom
        else -> null
    }

    val y = when {
        topBound != null && bottomBound != null -> {
            // Центрування між двома межами (враховуй, що y в LibGDX йде знизу вгору)
            bottomBound + (topBound - bottomBound - h) * lp.verticalBias
        }
        topBound    != null -> topBound - h
        bottomBound != null -> bottomBound
        else -> lp.marginBottom
    }

    actor.setPosition(x, y)
}




class ConstraintLayoutParams {
    // ---------- HORIZONTAL ----------
    var startToStartOf: Actor? = null
    var startToEndOf  : Actor? = null
    var endToStartOf  : Actor? = null
    var endToEndOf    : Actor? = null

    var horizontalBias: Float = 0.5f // 0 = start, 1 = end, 0.5 = center
        set(value) { field = value.coerceIn(0f,1f) }

    var marginStart: Float = 0f
    var marginEnd  : Float = 0f

    // ---------- VERTICAL ----------
    var topToTopOf      : Actor? = null
    var topToBottomOf   : Actor? = null
    var bottomToTopOf   : Actor? = null
    var bottomToBottomOf: Actor? = null

    var verticalBias: Float = 0.5f // 0 = bottom, 1 = top, 0.5 = center
        set(value) { field = value.coerceIn(0f,1f) }

    var marginTop   : Float = 0f
    var marginBottom: Float = 0f
}
