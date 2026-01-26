package com.kerkabig.runner.dice.game.utils

import com.kerkabig.runner.dice.game.screens.GameScreen
import com.kerkabig.runner.dice.util.log

class GameStateMachine(val handler: GameScreen.GameUIHandler ) {

    private var state = GameState.START

    fun change(newState: GameState) {
        state = newState
        log("STATE | Now: $state")

        updateState()
    }

    private fun updateState() {
        when (state) {
            GameState.START -> {
                handler.setButtonAction {
                    handler.showShakeElementA()
                    change(GameState.SHAKE_A)
                }
            }

            GameState.SHAKE_A -> {
                handler.setButtonAction {
                    handler.shake { change(GameState.MOVE_A) }
                }
            }

            GameState.MOVE_A -> {
                handler.moveA {
                    handler.showShakeElementB()
                    change(GameState.SHAKE_B)
                }
            }

            GameState.SHAKE_B -> {
                handler.shakeAI { change(GameState.MOVE_B) }
            }

            GameState.MOVE_B -> {
                handler.moveB {
                    handler.showShakeElementA()
                    change(GameState.SHAKE_A)
                }
            }

        }
    }

}

enum class GameState {
    START,
    SHAKE_A,
    MOVE_A,
    SHAKE_B,
    MOVE_B,
}