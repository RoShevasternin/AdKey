package com.task123.task321.game.actors

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.scenes.scene2d.ui.Image
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener
import com.task123.task321.game.screens.MenuScreen
import com.task123.task321.game.screens.SettingsScreen
import com.task123.task321.game.screens.WinScreen
import com.task123.task321.game.utils.Acts
import com.task123.task321.game.utils.actor.addActorWithConstraints
import com.task123.task321.game.utils.actor.addAndFillActor
import com.task123.task321.game.utils.actor.animDelay
import com.task123.task321.game.utils.actor.disable
import com.task123.task321.game.utils.actor.setOnClickListener
import com.task123.task321.game.utils.advanced.AdvancedGroup
import com.task123.task321.game.utils.advanced.AdvancedScreen
import com.task123.task321.game.utils.gdxGame
import com.task123.task321.util.log
import kotlinx.coroutines.flow.MutableStateFlow

class AGamePanel(
    override val screen: AdvancedScreen,
): AdvancedGroup() {
//    private val listElements = gdxGame.assetsAll.listItems

    companion object {
        val GLOBAL_COST_FLOW = MutableStateFlow(0)
    }

    private val columns = List(8) { AColumn(screen) }
    private var selectedColumn: AColumn? = null

    override fun addActorsOnGroup() {
        addAndFillActor(Image(gdxGame.assetsAll.GAME_GRID))

        setupColumns()
        fillRandomElements()

    }

    private fun setupColumns() {
        var nx = 0f
        var ny = 559f

        columns.forEachIndexed { index, column ->
            addActor(column)
            column.setPosition(nx, ny)
            column.setSize(135f, 511f) // Висота під 4 елементи

            nx += 135f + 48f // (48) - space
            if (index.inc() % 4 == 0) {
                nx = 0f
                ny -= 511f + 48f
            }

            // Клік на колонку
            column.setOnClickListener(gdxGame.soundUtil) {
                handleColumnClick(column)
            }
        }
    }

    private fun handleColumnClick(clickedColumn: AColumn) {
        val selected = selectedColumn

        if (selected == null) {
            // Вибираємо першу колонку (тільки якщо не пуста)
            if (!clickedColumn.isEmpty()) {
                selectedColumn = clickedColumn
                // Можна додати візуальний ефект "вибору" (підняти верхній елемент)
                clickedColumn.items.last().addAction(Acts.moveBy(0f, 20f, 0.15f))
            }
        } else {
            // Намагаємося перемістити
            if (clickedColumn != selected && !clickedColumn.isFull()) {
                val element = selected.popElement()
                if (element != null) {
                    element.clearActions() // Прибрати анімацію вибору
                    clickedColumn.pushElement(element)
                    if (SettingsScreen.IS_VIBRO) Gdx.input.vibrate(25) // Той самий "тук"
                    checkWin()
                }
            } else {
                // Скасувати вибір, якщо клікнули туди ж або в повну
                selected.items.lastOrNull()?.addAction(Acts.moveBy(0f, -20f, 0.15f))
            }
            selectedColumn = null
        }
    }

    private fun fillRandomElements() {
        // Логіка: 6 типів по 4 штуки = 24 елементи
        val types = (0..10).shuffled().take(6)
        val allNeededElements = mutableListOf<Int>()
        types.forEach { type -> repeat(4) { allNeededElements.add(type) } }
        allNeededElements.shuffle()

        // Заповнюємо перші 6 колонок
        for (i in 0 until 6) {
            repeat(4) {
                val type = allNeededElements.removeAt(0)
                columns[i].pushElement(AElement(screen, type))
            }
        }
    }

    private fun checkWin() {
        // 1. Рахуємо кількість "завершених" колонок
        val completedColumns = columns.count { column ->
            column.items.size == 4 && column.items.all { it.typeIndex == column.items[0].typeIndex }
        }

        GLOBAL_COST_FLOW.value = 25 * completedColumns

        // 2. Рахуємо кількість пустих колонок
        val emptyColumns = columns.count { it.isEmpty() }

        // 3. Якщо у нас 6 повних однакових і 2 пустих — це перемога

        log("full = $completedColumns | empty = $emptyColumns")

        if (completedColumns == 6 && emptyColumns == 2) {
            log("Victory! All elements sorted.")
            onLevelComplete()
        }
    }

    private fun onLevelComplete() {
        // Вимикаємо кліки, щоб гравець більше нічого не рухав
        this.disable()

        // Тут можна додати затримку і перехід на інший екран або показ діалогу
        this.animDelay(1f) {
            gdxGame.navigationManager.navigate(WinScreen::class.java.name)
        }
    }

}

class AElement(override val screen: AdvancedScreen, val typeIndex: Int): AdvancedGroup() {
    override fun addActorsOnGroup() {
        // Беремо картинку за індексом зі списку
        addAndFillActor(Image(gdxGame.assetsAll.listItems[typeIndex]))
    }
}

class AColumn(override val screen: AdvancedScreen): AdvancedGroup() {
    val items = mutableListOf<AElement>()
    private val maxItems = 4

    fun isFull() = items.size >= maxItems
    fun isEmpty() = items.isEmpty()

    // Додати елемент візуально і в список
    fun pushElement(element: AElement) {
        items.add(element)
        addActor(element)
        // Встановлюємо позицію (наприклад, знизу вгору)
        // Елементи будуть стояти один на одному: 0, 100, 200, 300 (залежить від висоти)
        element.setSize(100f, 100f) // Підшаманити розмір під твій дизайн
        element.setPosition(18f, 31f + (items.size - 1) * 116f)
    }

    // Забрати верхній елемент
    fun popElement(): AElement? {
        val element = items.removeLastOrNull()
        // Прибирати з екрана не треба, ми його просто перекинемо в іншу групу
        return element
    }

    override fun addActorsOnGroup() {

    }
}