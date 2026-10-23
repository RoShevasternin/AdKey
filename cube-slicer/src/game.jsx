/* Cube Slicer — concept landing + playable phone prototype (React, JSX) */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================== DATA ============================== */
// c = reward in hundredths of RBX (1 = 0.01 RBX), k = cubes (soft currency)
const FRUITS = [
  { id: 'apple', c: 1, k: 1, w: 30, rar: 'often', top: '#ff6a5e', left: '#e8382d', right: '#b7241b', juice: '#ff4b3e', flesh: '#fff0c8', stem: 1, leaf: 1 },
  { id: 'orange', c: 1, k: 1, w: 26, rar: 'often', top: '#ffb653', left: '#ff8d1f', right: '#d4690a', juice: '#ff9a2e', flesh: '#ffd38c', dots: '#ffd08a', leaf: 1 },
  { id: 'banana', c: 2, k: 1, w: 16, rar: 'normal', top: '#fff07a', left: '#ffd83b', right: '#deb215', juice: '#ffe36a', flesh: '#fff6cc', sx: 1.45, sy: 0.62, tip: 1 },
  { id: 'grape', c: 2, k: 1, w: 14, rar: 'normal', top: '#be8cff', left: '#8f52f2', right: '#6633c4', juice: '#9b5cff', flesh: '#e2ccff', cluster: 1 },
  { id: 'melon', c: 3, k: 2, w: 9, rar: 'rare', top: '#6ddc76', left: '#2fae4b', right: '#1f8536', juice: '#ff4d6d', flesh: '#ff6f86', stripes: '#13612a', size: 1.22 },
  { id: 'pineapple', c: 5, k: 2, w: 5, rar: 'epic', top: '#ffd650', left: '#f2aa22', right: '#c98512', juice: '#ffd84a', flesh: '#fff1a8', cross: '#9c620b', crown: 1 },
  { id: 'golden', c: 10, k: 5, w: 1.6, rar: 'legend', top: '#fff3a6', left: '#ffd23f', right: '#dfa60e', juice: '#ffe066', flesh: '#fff6c8', stem: 1, leaf: 1, shine: 1 }
];
const ADBOX = { id: 'adbox', c: 25, k: 5, rar: 'surprise', top: '#e2b679', left: '#c88d4b', right: '#9d6a32', juice: '#f2c98f', flesh: '#f6dcb4', ad: 1 };
const ALL_ITEMS = [...FRUITS, ADBOX];
const TIERS = [1, 5, 25, 100, 500];
const BLADES = [
  { id: 'classic', price: 0, colors: ['#ffffff', '#cfe8ff'] },
  { id: 'neon', price: 60, colors: ['#3ef0ff', '#1d8bff'] },
  { id: 'fire', price: 150, colors: ['#ffe066', '#ff4a1c'] },
  { id: 'rainbow', price: 300, colors: ['#ff4545', '#ffc928', '#2fc15a', '#2b6fff', '#8f52f2'] },
  { id: 'gold', iap: '$0.99', colors: ['#fff3a6', '#ffb800'] }
];
const CHARS = [
  { id: 'noob', price: 0, head: '#ffd23f', body: '#2b6fff', legs: '#2fc15a', arms: '#ffd23f' },
  { id: 'ninja', price: 120, head: '#2a2c48', body: '#2a2c48', legs: '#1b1d33', arms: '#2a2c48', band: '#ff4545' },
  { id: 'robot', price: 200, head: '#c3cbe0', body: '#8e99b8', legs: '#69739a', arms: '#c3cbe0', visor: '#3ef0ff' },
  { id: 'cat', price: 350, head: '#ff9c3a', body: '#ffffff', legs: '#ff9c3a', arms: '#ff9c3a', ears: 1 },
  { id: 'goldnoob', iap: '$1.99', head: '#ffe066', body: '#ffbf00', legs: '#e0a100', arms: '#ffe066' }
];
const SAVE_KEY = 'cube-slicer-v1';
const DEFAULT_SAVE = { balanceC: 0, tier: 0, cubes: 0, blade: 'classic', blades: ['classic'], char: 'noob', chars: ['noob'], withdrawnC: 0, best: 0 };
const target = tier => TIERS[Math.min(tier, TIERS.length - 1)];
const rbx = c => (c / 100).toFixed(2);

/* ============================== TEXT ============================== */
const TXT = {
  uk: {
    nav: { how: 'Як це працює', road: 'Роадмап', fruits: 'Фрукти', ad: 'Рекламна коробка', money: 'Де бабосік', meta: 'Мета-гра' },
    hero: {
      eyebrow: 'Концепт мобільної гри · інтерактивний прототип',
      title: ['Ріж кубічні фрукти —', 'заробляй RBX'],
      lead: 'Механіка Fruit Ninja у блоковому стилі Roblox. Кожен розрізаний фрукт приносить RBX-копієчки, а коли гравець збирає поріг — виводить їх на свій Roblox-акаунт.',
      chips: ['Від 0.01 RBX за фрукт', 'Перше виведення вже з 1 RBX', 'Реклама замість бомби'],
      hint: 'Грайте прямо тут: натисніть «Грати» і проводьте мишкою з натиснутою кнопкою або пальцем по фруктах.',
      full: 'На весь екран', exit: 'Вийти з повного екрана',
      demo: 'Кнопки для презентації', add: '+0.50 RBX', callAd: 'Викликати рекламну коробку', reset: 'Скинути прогрес'
    },
    how: {
      eyebrow: 'Ігровий цикл', title: 'Як це працює',
      steps: [
        ['Ріж фрукти', 'Свайп по екрану, як у Fruit Ninja. Фрукти кубічні, у стилістиці Roblox, і літають з різною швидкістю.'],
        ['Отримуй RBX-копієчки', 'Кожен фрукт дає від 0.01 до 0.10 RBX. Комбо з трьох і більше фруктів за один свайп дає бонус.'],
        ['Слідкуй за роадмапом', 'Шкала зверху показує, скільки лишилось до виведення. Прогрес видно в кожну секунду гри.'],
        ['Виводь на Roblox', 'Набрав поріг — вводиш нік і забираєш RBX на свій акаунт. Баланс обнуляється, наступна ціль вища.']
      ]
    },
    road: {
      eyebrow: 'Мотивація', title: 'Роадмап виведення',
      text: 'Перше виведення можливе вже з 1 RBX, щоб гравець швидко переконався, що все чесно. Після кожного виведення баланс обнуляється, а наступний поріг вищий: 1 → 5 → 25 → 100 → 500. Гравець бачить усю драбину й знає, скільки може отримати.',
      step: n => 'Крок ' + n, total: 'Разом за п’ять кроків', you: 'Ви тут', done: 'Виведено', now: 'Ваш баланс'
    },
    fruits: {
      eyebrow: 'Економіка', title: 'Скільки дає кожен фрукт',
      text: 'Таблиця доступна гравцю прямо в грі: видно, за що варто полювати. Рідкісні фрукти дорожчі, а рекламна коробка — найщедріша.',
      cols: ['Фрукт', 'RBX', 'Кубики', 'Як часто']
    },
    ad: {
      eyebrow: 'Головний твіст', title: 'Рекламна коробка замість бомби',
      text: 'В оригіналі бомба змушує гравця програти. У нас на її місці коробка з рекламою. Вона так само вилітає несподівано, гравець розрізає її на рефлексі — і отримує 0.25 RBX, у 25 разів більше за яблуко. Натомість він дивиться 5-секундну рекламу. Гравцю приємно, нам — дохід.',
      bomb: 'Бомба в оригіналі', bombText: 'Розрізав — програв. Гравець злиться.',
      box: 'Коробка в Cube Slicer', boxText: 'Розрізав — +0.25 RBX і 5 секунд реклами. Гравець радіє.',
      points: ['Жодного штрафу: коробку можна пропустити', 'Нагорода видна одразу: +0.25 RBX', 'Формат rewarded video: гравець сам обирає подивитися рекламу']
    },
    money: {
      eyebrow: 'Монетизація', title: 'ДЕ ТУТ БАБОСІК',
      lead: 'Гравець отримує справжню цінність — RBX, а ми заробляємо на кожному кроці його шляху до виведення.',
      streams: [
        ['Рекламні коробки', 'Rewarded video — найдорожчий формат мобільної реклами. Кожна розрізана коробка — оплачений показ.'],
        ['Магазин скінів', 'Леза, персонажі й ефекти за кубики або за реальні гроші. Кубики стимулюють грати, гроші — купувати швидше.'],
        ['Ninja Pass', 'Сезонний пропуск з ексклюзивними скінами та щоденними нагородами. Регулярний дохід від найактивніших.'],
        ['Утримання роадмапом', 'Пороги 1 → 5 → 25 → 100 тримають гравця тижнями, а кожна сесія — це нові показ реклами.']
      ],
      win: [['Гравець', 'Більше RBX, жодного програшу через коробку'], ['Рекламодавець', 'Залучена аудиторія, яка сама обрала перегляд'], ['Ми', 'Дохід з кожного показу і покупок']],
      calc: {
        title: 'Калькулятор юніт-економіки',
        note: 'Усі значення — припущення для обговорення. Змініть їх під свої дані — результат перерахується одразу.',
        dau: 'Гравців на день (DAU)', ads: 'Коробок на гравця за день', ecpm: 'eCPM rewarded-реклами, $', rbxAd: 'RBX за одну коробку',
        rbxFruit: 'RBX з фруктів на гравця за день', share: 'Частка RBX, яку реально виводять, %', cost: 'Наша ціна 1 RBX, $', iap: 'Покупки в магазині, $ на гравця за день',
        rev: 'Дохід з реклами', iapRev: 'Дохід з магазину', payout: 'Витрати на виплати RBX', profit: 'Прибуток', day: 'за день', month: 'за 30 днів', margin: 'Маржа'
      }
    },
    meta: {
      eyebrow: 'Навколо механіки', title: 'Повноцінна гра, а не одна механіка',
      items: [
        ['Магазин лез', 'Класичне, неонове, вогняне, веселкове й золоте лезо змінюють слід від свайпу.'],
        ['Персонажі з бонусами', 'Нуб, Ніндзя (+1 життя), Робот (комбо ×2), Котик (кубики ×2) і преміум Золотий нуб.'],
        ['Дві валюти', 'RBX виводяться на Roblox, кубики витрачаються в магазині. Так гравець не «проїдає» виплату.'],
        ['Щоденні нагороди', 'Бонус за вхід кожен день і серії днів (у плані для MVP).'],
        ['Таблиця лідерів', 'Тижневі рейтинги серед друзів і в країні (у плані).'],
        ['Сезонні події', 'Хелловін, Новий рік, тематичні фрукти й леза (у плані).']
      ]
    },
    next: {
      eyebrow: 'Перед запуском', title: 'Наступні кроки',
      items: [
        ['Виплати RBX', 'Перевірити правила Roblox щодо передачі Robux і налаштувати виплати через групу (Group Payouts) або інший дозволений механізм.'],
        ['Вік і реклама', 'Велика частина аудиторії Roblox — діти. Рекламу треба налаштувати з урахуванням COPPA та GDPR-K.'],
        ['Антифрод', 'Денні ліміти, перевірка акаунтів і захист від ботів, щоб виплати отримували живі гравці.'],
        ['MVP', 'Мобільна збірка, підключення рекламної мережі, аналітика утримання й економіки.']
      ]
    },
    foot: 'Cube Slicer — концепт і прототип. Не пов’язано з Roblox Corporation. У прототипі виведення RBX імітується.',
    g: {
      play: 'ГРАТИ', shop: 'Магазин', road: 'Роадмап', fruits: 'Фрукти', chars: 'Персонажі', toW: 'до виведення', withdraw: 'Вивести', ready: 'Можна виводити!',
      balance: 'Баланс', cubes: 'Кубики', back: 'Назад', over: 'Гру завершено', again: 'Ще раз', menu: 'Меню', sliced: 'Розрізано', earned: 'Зароблено', combo: 'Найкраще комбо',
      adLabel: 'РЕКЛАМА', adWait: n => 'Нагорода через ' + n + ' с', adDone: '+0.25 RBX зараховано', adGame: 'BLOCK RACERS', adCta: 'Встанови безкоштовно', adSub: 'Гонки на кубічних тачках',
      wTitle: 'Виведення RBX', wNick: 'Нік у Roblox', wPh: 'наприклад, CoolNinja2014', wSend: n => 'Вивести ' + n + ' RBX', wCheck: 'Перевіряємо акаунт…', wSending: 'Надсилаємо RBX…',
      wOk: (n, nick) => n + ' RBX відправлено гравцю ' + nick, wDemo: 'У прототипі виведення імітується', wNext: n => 'Наступна ціль: ' + n + ' RBX', wClose: 'Чудово', wErr: 'Нік: 3–20 символів, латиниця, цифри або _',
      wNeed: n => 'Потрібно ще ' + n + ' RBX',
      roadText: 'Після кожного виведення баланс обнуляється, а наступна ціль вища.', done: 'Виведено', current: 'Зараз', locked: 'Далі',
      blades: 'Леза', owned: 'Обрати', equipped: 'Обрано', buy: n => n + ' кубиків', iapNote: 'Покупка за гроші — у релізній версії', poor: 'Не вистачає кубиків', bought: 'Куплено!',
      comboTxt: n => 'КОМБО ×' + n, pause: 'Пауза', resume: 'Продовжити', exitGame: 'Вийти в меню', paused: 'Пауза',
      bladeNames: { classic: 'Класичне', neon: 'Неон', fire: 'Вогонь', rainbow: 'Веселка', gold: 'Золоте' },
      charNames: { noob: 'Нуб', ninja: 'Ніндзя', robot: 'Робот', cat: 'Котик', goldnoob: 'Золотий нуб' },
      perks: { noob: 'Без бонусу', ninja: '+1 життя', robot: 'Комбо-бонус ×2', cat: 'Кубики ×2', goldnoob: 'Ексклюзивний вигляд' },
      fruitNames: { apple: 'Яблуко', orange: 'Апельсин', banana: 'Банан', grape: 'Виноград', melon: 'Кавун', pineapple: 'Ананас', golden: 'Золоте яблуко', adbox: 'Рекламна коробка' },
      rar: { often: 'Часто', normal: 'Середньо', rare: 'Рідко', epic: 'Дуже рідко', legend: 'Легенда', surprise: 'Сюрприз' },
      fruitsHint: 'Ріж дорогі фрукти і не пропускай коробки!'
    }
  },
  ru: {
    nav: { how: 'Как это работает', road: 'Роадмап', fruits: 'Фрукты', ad: 'Рекламная коробка', money: 'Где бабосик', meta: 'Мета-игра' },
    hero: {
      eyebrow: 'Концепт мобильной игры · интерактивный прототип',
      title: ['Режь кубические фрукты —', 'зарабатывай RBX'],
      lead: 'Механика Fruit Ninja в блоковом стиле Roblox. Каждый разрезанный фрукт приносит RBX-копеечки, а когда игрок набирает порог — выводит их на свой Roblox-аккаунт.',
      chips: ['От 0.01 RBX за фрукт', 'Первый вывод уже с 1 RBX', 'Реклама вместо бомбы'],
      hint: 'Играйте прямо здесь: нажмите «Играть» и проводите мышкой с зажатой кнопкой или пальцем по фруктам.',
      full: 'На весь экран', exit: 'Выйти из полного экрана',
      demo: 'Кнопки для презентации', add: '+0.50 RBX', callAd: 'Вызвать рекламную коробку', reset: 'Сбросить прогресс'
    },
    how: {
      eyebrow: 'Игровой цикл', title: 'Как это работает',
      steps: [
        ['Режь фрукты', 'Свайп по экрану, как в Fruit Ninja. Фрукты кубические, в стилистике Roblox, и летают с разной скоростью.'],
        ['Получай RBX-копеечки', 'Каждый фрукт даёт от 0.01 до 0.10 RBX. Комбо из трёх и более фруктов за один свайп даёт бонус.'],
        ['Следи за роадмапом', 'Шкала сверху показывает, сколько осталось до вывода. Прогресс виден каждую секунду игры.'],
        ['Выводи на Roblox', 'Набрал порог — вводишь ник и забираешь RBX на свой аккаунт. Баланс обнуляется, следующая цель выше.']
      ]
    },
    road: {
      eyebrow: 'Мотивация', title: 'Роадмап вывода',
      text: 'Первый вывод возможен уже с 1 RBX, чтобы игрок быстро убедился, что всё честно. После каждого вывода баланс обнуляется, а следующий порог выше: 1 → 5 → 25 → 100 → 500. Игрок видит всю лестницу и знает, сколько может получить.',
      step: n => 'Шаг ' + n, total: 'Всего за пять шагов', you: 'Вы здесь', done: 'Выведено', now: 'Ваш баланс'
    },
    fruits: {
      eyebrow: 'Экономика', title: 'Сколько даёт каждый фрукт',
      text: 'Таблица доступна игроку прямо в игре: видно, за чем стоит охотиться. Редкие фрукты дороже, а рекламная коробка — самая щедрая.',
      cols: ['Фрукт', 'RBX', 'Кубики', 'Как часто']
    },
    ad: {
      eyebrow: 'Главный твист', title: 'Рекламная коробка вместо бомбы',
      text: 'В оригинале бомба заставляет игрока проиграть. У нас на её месте коробка с рекламой. Она так же вылетает неожиданно, игрок разрезает её на рефлексе — и получает 0.25 RBX, в 25 раз больше, чем за яблоко. Взамен он смотрит 5-секундную рекламу. Игроку приятно, нам — доход.',
      bomb: 'Бомба в оригинале', bombText: 'Разрезал — проиграл. Игрок злится.',
      box: 'Коробка в Cube Slicer', boxText: 'Разрезал — +0.25 RBX и 5 секунд рекламы. Игрок радуется.',
      points: ['Никакого штрафа: коробку можно пропустить', 'Награда видна сразу: +0.25 RBX', 'Формат rewarded video: игрок сам выбирает посмотреть рекламу']
    },
    money: {
      eyebrow: 'Монетизация', title: 'ГДЕ ТУТ БАБОСИК',
      lead: 'Игрок получает настоящую ценность — RBX, а мы зарабатываем на каждом шаге его пути к выводу.',
      streams: [
        ['Рекламные коробки', 'Rewarded video — самый дорогой формат мобильной рекламы. Каждая разрезанная коробка — оплаченный показ.'],
        ['Магазин скинов', 'Лезвия, персонажи и эффекты за кубики или за реальные деньги. Кубики мотивируют играть, деньги — покупать быстрее.'],
        ['Ninja Pass', 'Сезонный пропуск с эксклюзивными скинами и ежедневными наградами. Регулярный доход от самых активных.'],
        ['Удержание роадмапом', 'Пороги 1 → 5 → 25 → 100 держат игрока неделями, а каждая сессия — это новые показы рекламы.']
      ],
      win: [['Игрок', 'Больше RBX, никакого проигрыша из-за коробки'], ['Рекламодатель', 'Вовлечённая аудитория, которая сама выбрала просмотр'], ['Мы', 'Доход с каждого показа и покупок']],
      calc: {
        title: 'Калькулятор юнит-экономики',
        note: 'Все значения — допущения для обсуждения. Измените их под свои данные — результат пересчитается сразу.',
        dau: 'Игроков в день (DAU)', ads: 'Коробок на игрока в день', ecpm: 'eCPM rewarded-рекламы, $', rbxAd: 'RBX за одну коробку',
        rbxFruit: 'RBX с фруктов на игрока в день', share: 'Доля RBX, которую реально выводят, %', cost: 'Наша цена 1 RBX, $', iap: 'Покупки в магазине, $ на игрока в день',
        rev: 'Доход с рекламы', iapRev: 'Доход с магазина', payout: 'Расходы на выплаты RBX', profit: 'Прибыль', day: 'в день', month: 'за 30 дней', margin: 'Маржа'
      }
    },
    meta: {
      eyebrow: 'Вокруг механики', title: 'Полноценная игра, а не одна механика',
      items: [
        ['Магазин лезвий', 'Классическое, неоновое, огненное, радужное и золотое лезвие меняют след от свайпа.'],
        ['Персонажи с бонусами', 'Нуб, Ниндзя (+1 жизнь), Робот (комбо ×2), Котик (кубики ×2) и премиум Золотой нуб.'],
        ['Две валюты', 'RBX выводятся на Roblox, кубики тратятся в магазине. Так игрок не «проедает» выплату.'],
        ['Ежедневные награды', 'Бонус за вход каждый день и серии дней (в плане для MVP).'],
        ['Таблица лидеров', 'Недельные рейтинги среди друзей и в стране (в плане).'],
        ['Сезонные события', 'Хэллоуин, Новый год, тематические фрукты и лезвия (в плане).']
      ]
    },
    next: {
      eyebrow: 'Перед запуском', title: 'Следующие шаги',
      items: [
        ['Выплаты RBX', 'Проверить правила Roblox о передаче Robux и настроить выплаты через группу (Group Payouts) или другой разрешённый механизм.'],
        ['Возраст и реклама', 'Большая часть аудитории Roblox — дети. Рекламу нужно настроить с учётом COPPA и GDPR-K.'],
        ['Антифрод', 'Дневные лимиты, проверка аккаунтов и защита от ботов, чтобы выплаты получали живые игроки.'],
        ['MVP', 'Мобильная сборка, подключение рекламной сети, аналитика удержания и экономики.']
      ]
    },
    foot: 'Cube Slicer — концепт и прототип. Не связано с Roblox Corporation. В прототипе вывод RBX имитируется.',
    g: {
      play: 'ИГРАТЬ', shop: 'Магазин', road: 'Роадмап', fruits: 'Фрукты', chars: 'Персонажи', toW: 'до вывода', withdraw: 'Вывести', ready: 'Можно выводить!',
      balance: 'Баланс', cubes: 'Кубики', back: 'Назад', over: 'Игра окончена', again: 'Ещё раз', menu: 'Меню', sliced: 'Разрезано', earned: 'Заработано', combo: 'Лучшее комбо',
      adLabel: 'РЕКЛАМА', adWait: n => 'Награда через ' + n + ' с', adDone: '+0.25 RBX зачислено', adGame: 'BLOCK RACERS', adCta: 'Установи бесплатно', adSub: 'Гонки на кубических тачках',
      wTitle: 'Вывод RBX', wNick: 'Ник в Roblox', wPh: 'например, CoolNinja2014', wSend: n => 'Вывести ' + n + ' RBX', wCheck: 'Проверяем аккаунт…', wSending: 'Отправляем RBX…',
      wOk: (n, nick) => n + ' RBX отправлено игроку ' + nick, wDemo: 'В прототипе вывод имитируется', wNext: n => 'Следующая цель: ' + n + ' RBX', wClose: 'Отлично', wErr: 'Ник: 3–20 символов, латиница, цифры или _',
      wNeed: n => 'Нужно ещё ' + n + ' RBX',
      roadText: 'После каждого вывода баланс обнуляется, а следующая цель выше.', done: 'Выведено', current: 'Сейчас', locked: 'Дальше',
      blades: 'Лезвия', owned: 'Выбрать', equipped: 'Выбрано', buy: n => n + ' кубиков', iapNote: 'Покупка за деньги — в релизной версии', poor: 'Не хватает кубиков', bought: 'Куплено!',
      comboTxt: n => 'КОМБО ×' + n, pause: 'Пауза', resume: 'Продолжить', exitGame: 'Выйти в меню', paused: 'Пауза',
      bladeNames: { classic: 'Классическое', neon: 'Неон', fire: 'Огонь', rainbow: 'Радуга', gold: 'Золотое' },
      charNames: { noob: 'Нуб', ninja: 'Ниндзя', robot: 'Робот', cat: 'Котик', goldnoob: 'Золотой нуб' },
      perks: { noob: 'Без бонуса', ninja: '+1 жизнь', robot: 'Комбо-бонус ×2', cat: 'Кубики ×2', goldnoob: 'Эксклюзивный вид' },
      fruitNames: { apple: 'Яблоко', orange: 'Апельсин', banana: 'Банан', grape: 'Виноград', melon: 'Арбуз', pineapple: 'Ананас', golden: 'Золотое яблоко', adbox: 'Рекламная коробка' },
      rar: { often: 'Часто', normal: 'Средне', rare: 'Редко', epic: 'Очень редко', legend: 'Легенда', surprise: 'Сюрприз' },
      fruitsHint: 'Режь дорогие фрукты и не пропускай коробки!'
    }
  },
  en: {
    nav: { how: 'How it works', road: 'Roadmap', fruits: 'Fruits', ad: 'Ad box', money: 'Where’s the money', meta: 'Meta game' },
    hero: {
      eyebrow: 'Mobile game concept · interactive prototype',
      title: ['Slice blocky fruit —', 'earn RBX'],
      lead: 'Fruit Ninja gameplay in a blocky Roblox style. Every sliced fruit earns tiny bits of RBX, and once a player reaches the threshold they withdraw it to their own Roblox account.',
      chips: ['From 0.01 RBX per fruit', 'First withdrawal at just 1 RBX', 'An ad box instead of the bomb'],
      hint: 'Play right here: press “Play”, then drag across the fruit with your mouse button held down or with your finger.',
      full: 'Full screen', exit: 'Exit full screen',
      demo: 'Presenter controls', add: '+0.50 RBX', callAd: 'Launch an ad box', reset: 'Reset progress'
    },
    how: {
      eyebrow: 'Core loop', title: 'How it works',
      steps: [
        ['Slice fruit', 'Swipe across the screen, just like Fruit Ninja. The fruit is blocky, Roblox-style, and flies at different speeds.'],
        ['Earn RBX cents', 'Each fruit gives 0.01 to 0.10 RBX. Slicing three or more in one swipe gives a combo bonus.'],
        ['Follow the roadmap', 'The bar at the top shows how much is left until the next withdrawal, every second of play.'],
        ['Withdraw to Roblox', 'Hit the threshold, enter your username and claim RBX to your account. The balance resets and the next goal is higher.']
      ]
    },
    road: {
      eyebrow: 'Motivation', title: 'Withdrawal roadmap',
      text: 'The first withdrawal unlocks at just 1 RBX, so players quickly see it’s real. After each withdrawal the balance resets and the next threshold is higher: 1 → 5 → 25 → 100 → 500. Players see the whole ladder and know how much they can earn.',
      step: n => 'Step ' + n, total: 'Total across five steps', you: 'You are here', done: 'Withdrawn', now: 'Your balance'
    },
    fruits: {
      eyebrow: 'Economy', title: 'What each fruit is worth',
      text: 'Players can open this table in the game and see what to hunt for. Rare fruit pays more, and the ad box pays the most.',
      cols: ['Fruit', 'RBX', 'Cubes', 'How often']
    },
    ad: {
      eyebrow: 'The key twist', title: 'An ad box instead of the bomb',
      text: 'In the original, slicing a bomb ends the game. We replace it with an ad box. It flies in just as unexpectedly, the player slices it on reflex and gets 0.25 RBX, 25 times more than an apple. In return they watch a 5-second ad. The player is happy, and we earn revenue.',
      bomb: 'Bomb in the original', bombText: 'Slice it and you lose. The player gets annoyed.',
      box: 'Box in Cube Slicer', boxText: 'Slice it: +0.25 RBX and a 5-second ad. The player is delighted.',
      points: ['No penalty: the box can be skipped', 'The reward is instant: +0.25 RBX', 'Rewarded video format: the player chooses to watch']
    },
    money: {
      eyebrow: 'Monetization', title: 'WHERE’S THE MONEY',
      lead: 'Players get something of real value — RBX — and we earn at every step of their path to a withdrawal.',
      streams: [
        ['Ad boxes', 'Rewarded video is the highest-paying mobile ad format. Every sliced box is a paid impression.'],
        ['Skin shop', 'Blades, characters and effects for cubes or real money. Cubes keep players playing, money lets them get there faster.'],
        ['Ninja Pass', 'A season pass with exclusive skins and daily rewards. Recurring revenue from the most engaged players.'],
        ['Roadmap retention', 'Thresholds of 1 → 5 → 25 → 100 keep players coming back for weeks, and every session means more ad impressions.']
      ],
      win: [['Player', 'More RBX, and the box never costs them the game'], ['Advertiser', 'An engaged audience that chose to watch'], ['Us', 'Revenue from every impression and purchase']],
      calc: {
        title: 'Unit economics calculator',
        note: 'All values are assumptions for discussion. Change them to your own numbers and the result updates instantly.',
        dau: 'Daily active players (DAU)', ads: 'Ad boxes per player per day', ecpm: 'Rewarded video eCPM, $', rbxAd: 'RBX per ad box',
        rbxFruit: 'RBX from fruit per player per day', share: 'Share of RBX actually withdrawn, %', cost: 'Our cost of 1 RBX, $', iap: 'Shop purchases, $ per player per day',
        rev: 'Ad revenue', iapRev: 'Shop revenue', payout: 'RBX payout cost', profit: 'Profit', day: 'per day', month: 'per 30 days', margin: 'Margin'
      }
    },
    meta: {
      eyebrow: 'Around the core', title: 'A full game, not a single mechanic',
      items: [
        ['Blade shop', 'Classic, neon, fire, rainbow and gold blades change the swipe trail.'],
        ['Characters with perks', 'Noob, Ninja (+1 life), Robot (combo ×2), Cat (cubes ×2) and the premium Golden Noob.'],
        ['Two currencies', 'RBX is withdrawn to Roblox, cubes are spent in the shop, so players never spend their payout.'],
        ['Daily rewards', 'A login bonus every day plus streaks (planned for the MVP).'],
        ['Leaderboards', 'Weekly rankings among friends and by country (planned).'],
        ['Seasonal events', 'Halloween, New Year, themed fruit and blades (planned).']
      ]
    },
    next: {
      eyebrow: 'Before launch', title: 'Next steps',
      items: [
        ['RBX payouts', 'Check Roblox rules on transferring Robux and set up payouts through a group (Group Payouts) or another permitted mechanism.'],
        ['Age and ads', 'A large share of the Roblox audience is children. Ads must be set up with COPPA and GDPR-K in mind.'],
        ['Anti-fraud', 'Daily limits, account checks and bot protection so payouts go to real players.'],
        ['MVP', 'Mobile build, ad network integration, retention and economy analytics.']
      ]
    },
    foot: 'Cube Slicer is a concept and prototype. Not affiliated with Roblox Corporation. RBX withdrawals are simulated in the prototype.',
    g: {
      play: 'PLAY', shop: 'Shop', road: 'Roadmap', fruits: 'Fruits', chars: 'Characters', toW: 'to withdrawal', withdraw: 'Withdraw', ready: 'Ready to withdraw!',
      balance: 'Balance', cubes: 'Cubes', back: 'Back', over: 'Game over', again: 'Play again', menu: 'Menu', sliced: 'Sliced', earned: 'Earned', combo: 'Best combo',
      adLabel: 'AD', adWait: n => 'Reward in ' + n + ' s', adDone: '+0.25 RBX added', adGame: 'BLOCK RACERS', adCta: 'Install for free', adSub: 'Racing in blocky cars',
      wTitle: 'Withdraw RBX', wNick: 'Roblox username', wPh: 'e.g. CoolNinja2014', wSend: n => 'Withdraw ' + n + ' RBX', wCheck: 'Checking account…', wSending: 'Sending RBX…',
      wOk: (n, nick) => n + ' RBX sent to ' + nick, wDemo: 'Withdrawals are simulated in the prototype', wNext: n => 'Next goal: ' + n + ' RBX', wClose: 'Awesome', wErr: 'Username: 3–20 characters, letters, digits or _',
      wNeed: n => n + ' RBX to go',
      roadText: 'After each withdrawal the balance resets and the next goal is higher.', done: 'Withdrawn', current: 'Now', locked: 'Next',
      blades: 'Blades', owned: 'Equip', equipped: 'Equipped', buy: n => n + ' cubes', iapNote: 'Real-money purchases come in the release version', poor: 'Not enough cubes', bought: 'Purchased!',
      comboTxt: n => 'COMBO ×' + n, pause: 'Pause', resume: 'Resume', exitGame: 'Back to menu', paused: 'Paused',
      bladeNames: { classic: 'Classic', neon: 'Neon', fire: 'Fire', rainbow: 'Rainbow', gold: 'Gold' },
      charNames: { noob: 'Noob', ninja: 'Ninja', robot: 'Robot', cat: 'Cat', goldnoob: 'Golden Noob' },
      perks: { noob: 'No perk', ninja: '+1 life', robot: 'Combo bonus ×2', cat: 'Cubes ×2', goldnoob: 'Exclusive look' },
      fruitNames: { apple: 'Apple', orange: 'Orange', banana: 'Banana', grape: 'Grapes', melon: 'Watermelon', pineapple: 'Pineapple', golden: 'Golden apple', adbox: 'Ad box' },
      rar: { often: 'Often', normal: 'Regular', rare: 'Rare', epic: 'Very rare', legend: 'Legendary', surprise: 'Surprise' },
      fruitsHint: 'Go for pricey fruit and don’t miss the boxes!'
    }
  }
};

/* ============================== SPRITES ============================== */
function poly(ctx, pts, fill) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}
function block(ctx, cx, cy, hw, vh, c, lw) {
  const th = hw * 0.5, top = cy - vh / 2;
  const N = [cx, top - th], E = [cx + hw, top], S = [cx, top + th], W = [cx - hw, top];
  const S2 = [cx, top + th + vh], E2 = [cx + hw, top + vh], W2 = [cx - hw, top + vh];
  const faces = { left: [W, S, S2, W2], right: [S, E, E2, S2], top: [N, E, S, W] };
  poly(ctx, faces.left, c.left); poly(ctx, faces.right, c.right); poly(ctx, faces.top, c.top);
  ctx.lineJoin = 'round';
  ctx.lineWidth = lw || Math.max(1.4, hw * 0.07);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.moveTo(W[0], W[1]); ctx.lineTo(S[0], S[1]); ctx.lineTo(E[0], E[1]); ctx.moveTo(S[0], S[1]); ctx.lineTo(S2[0], S2[1]); ctx.stroke();
  ctx.strokeStyle = 'rgba(25,18,48,.6)';
  poly(ctx, [N, E, E2, S2, W2, W]); ctx.stroke();
  return { faces, top, th, N, S, E, W };
}
function clipTo(ctx, pts, fn) { ctx.save(); poly(ctx, pts); ctx.clip(); fn(); ctx.restore(); }
function sparkle(ctx, x, y, r, col) {
  ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
}
const spriteCache = new Map();
function sprite(f, a) {
  a = Math.max(8, Math.round(a));
  const key = f.id + '_' + a;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const S = Math.ceil(a * 4.4);
  const cv = document.createElement('canvas');
  cv.width = S * dpr; cv.height = S * dpr;
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  const cx = S / 2, cy = S / 2 + a * 0.2;
  const col = { top: f.top, left: f.left, right: f.right };
  if (f.cluster) {
    const s = a * 0.56;
    [[-0.5, 0.2], [0.5, 0.2], [0, -0.42], [0, 0.48]].forEach(([dx, dy]) => block(ctx, cx + dx * a, cy + dy * a, s, s, col));
    block(ctx, cx + a * 0.08, cy - a * 1.05, a * 0.12, a * 0.34, { top: '#8a5a2b', left: '#6b4420', right: '#4f3116' });
    block(ctx, cx + a * 0.36, cy - a * 0.98, a * 0.24, a * 0.09, { top: '#7be37a', left: '#3fb54b', right: '#2b8a37' });
  } else {
    const hw = a * (f.sx || 1), vh = a * (f.sy || 1);
    const b = block(ctx, cx, cy, hw, vh, col);
    const { faces, top, th } = b;
    if (f.stripes) {
      ['left', 'right'].forEach(k => clipTo(ctx, faces[k], () => {
        ctx.strokeStyle = f.stripes; ctx.lineWidth = a * 0.13;
        for (let i = -3; i <= 3; i++) { const x = cx + i * a * 0.33 + (k === 'left' ? -a * 0.05 : a * 0.05); ctx.beginPath(); ctx.moveTo(x, cy - a * 2); ctx.lineTo(x, cy + a * 2); ctx.stroke(); }
      }));
      clipTo(ctx, faces.top, () => {
        ctx.strokeStyle = f.stripes; ctx.lineWidth = a * 0.13;
        for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx - a * 1.2 + i * a * 0.38, top - th * 2); ctx.lineTo(cx + a * 1.2 + i * a * 0.38, top + th * 2); ctx.stroke(); }
      });
    }
    if (f.dots) {
      ['left', 'right', 'top'].forEach((k, j) => clipTo(ctx, faces[k], () => {
        ctx.fillStyle = f.dots;
        for (let i = 0; i < 9; i++) {
          const px = cx - a + ((i * 37 + j * 13) % 100) / 100 * 2 * a, py = cy - a * 1.4 + ((i * 59 + j * 29) % 100) / 100 * 2.6 * a;
          ctx.fillRect(px, py, a * 0.11, a * 0.11);
        }
      }));
    }
    if (f.cross) {
      ['left', 'right', 'top'].forEach(k => clipTo(ctx, faces[k], () => {
        ctx.strokeStyle = f.cross; ctx.lineWidth = Math.max(1.2, a * 0.06);
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath(); ctx.moveTo(cx + i * a * 0.32 - a * 2, cy - a * 2); ctx.lineTo(cx + i * a * 0.32 + a * 2, cy + a * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + i * a * 0.32 + a * 2, cy - a * 2); ctx.lineTo(cx + i * a * 0.32 - a * 2, cy + a * 2); ctx.stroke();
        }
      }));
    }
    if (f.ad) {
      const rib = '#ff4545';
      clipTo(ctx, faces.top, () => {
        ctx.strokeStyle = rib; ctx.lineWidth = a * 0.24;
        ctx.beginPath(); ctx.moveTo(cx - hw / 2, top - th / 2); ctx.lineTo(cx + hw / 2, top + th / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + hw / 2, top - th / 2); ctx.lineTo(cx - hw / 2, top + th / 2); ctx.stroke();
      });
      ctx.save();
      ctx.transform(1, 0.5, 0, 1, cx - hw, top);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#15172e'; ctx.lineWidth = a * 0.08;
      ctx.font = '900 ' + Math.round(a * 0.62) + 'px Unbounded, "Arial Black", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeText('AD', hw / 2, vh / 2); ctx.fillText('AD', hw / 2, vh / 2);
      ctx.restore();
      ctx.save();
      ctx.transform(1, -0.5, 0, 1, cx, top + th);
      ctx.fillStyle = rib; ctx.fillRect(hw * 0.38, 0, a * 0.24, vh);
      ctx.restore();
      block(ctx, cx - a * 0.18, top - a * 0.18, a * 0.2, a * 0.16, { top: '#ff7b7b', left: '#ff4545', right: '#c92c2c' });
      block(ctx, cx + a * 0.18, top - a * 0.18, a * 0.2, a * 0.16, { top: '#ff7b7b', left: '#ff4545', right: '#c92c2c' });
    }
    if (f.stem) block(ctx, cx, top - a * 0.28, a * 0.13, a * 0.34, { top: '#8a5a2b', left: '#6b4420', right: '#4f3116' });
    if (f.leaf) block(ctx, cx + a * 0.34, top - a * 0.2, a * 0.27, a * 0.1, { top: '#7be37a', left: '#3fb54b', right: '#2b8a37' });
    if (f.tip) block(ctx, cx - hw * 0.86, top + a * 0.05, a * 0.12, a * 0.2, { top: '#7a5524', left: '#5c3d17', right: '#43290e' });
    if (f.crown) {
      [[-0.28, -0.42, 0.5], [0.28, -0.42, 0.5], [0, -0.62, 0.7]].forEach(([dx, dy, h]) =>
        block(ctx, cx + dx * a, top + dy * a, a * 0.14, a * h, { top: '#7be37a', left: '#3fb54b', right: '#2b8a37' }));
    }
    if (f.shine) {
      sparkle(ctx, cx - a * 0.5, cy - a * 0.05, a * 0.22, '#ffffff');
      sparkle(ctx, cx + a * 0.55, cy + a * 0.35, a * 0.16, '#ffffff');
      sparkle(ctx, cx + a * 0.1, top - a * 0.05, a * 0.12, '#ffffff');
    }
  }
  const out = { cv, S };
  spriteCache.set(key, out);
  return out;
}
const iconCache = new Map();
function spriteURL(f) {
  if (iconCache.has(f.id)) return iconCache.get(f.id);
  const a = 26, sp = sprite(f, a), dpr = sp.cv.width / sp.S;
  const box = Math.ceil(a * 2.9), c = document.createElement('canvas');
  c.width = box * dpr; c.height = box * dpr;
  c.getContext('2d').drawImage(sp.cv, (box - sp.S) / 2 * dpr, (box - sp.S) / 2 * dpr - a * 0.12 * dpr);
  const url = c.toDataURL();
  iconCache.set(f.id, url);
  return url;
}

/* ============================== ENGINE ============================== */
function makeBackground(W, H, dpr) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
  const x = cv.getContext('2d');
  x.scale(dpr, dpr);
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3fa9ff'); g.addColorStop(0.62, '#9fd6ff'); g.addColorStop(1, '#d6f0ff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const u = W / 24;
  const cloud = (cx, cy, s) => {
    x.fillStyle = 'rgba(255,255,255,.92)';
    x.fillRect(cx - 3 * s, cy, 6 * s, 1.4 * s); x.fillRect(cx - 1.8 * s, cy - 1.1 * s, 3.4 * s, 1.2 * s); x.fillRect(cx + 0.2 * s, cy - 1.7 * s, 1.6 * s, 0.8 * s);
    x.fillStyle = 'rgba(160,200,235,.5)'; x.fillRect(cx - 3 * s, cy + 1.4 * s, 6 * s, 0.3 * s);
  };
  cloud(W * 0.22, H * 0.16, u * 0.9); cloud(W * 0.78, H * 0.1, u * 0.7); cloud(W * 0.65, H * 0.33, u * 0.55); cloud(W * 0.12, H * 0.45, u * 0.45);
  const hillY = H * 0.82;
  x.fillStyle = '#7fd38a';
  for (let i = 0; i < 12; i++) { const hx = i * W / 11 - u; const hh = (2 + ((i * 7) % 5)) * u * 0.8; x.fillRect(hx, hillY - hh, W / 11 + 2, hh + 2); }
  x.fillStyle = '#5cbf6c';
  for (let i = 0; i < 9; i++) { const hx = i * W / 8 - u * 0.5; const hh = (1 + ((i * 5) % 4)) * u * 0.7; x.fillRect(hx, hillY - hh + u, W / 8 + 2, hh + 2); }
  const gy = H * 0.86;
  x.fillStyle = '#3cb853'; x.fillRect(0, gy, W, H - gy);
  x.fillStyle = '#2f9a44'; x.fillRect(0, gy, W, u * 0.25);
  x.fillStyle = 'rgba(255,255,255,.18)';
  for (let yy = gy + u * 0.8; yy < H; yy += u * 1.2) for (let xx = u * 0.6; xx < W; xx += u * 1.2) { x.beginPath(); x.arc(xx, yy, u * 0.3, 0, 6.283); x.fill(); }
  return cv;
}

function createEngine(canvas, hooks) {
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 1, H = 1, dpr = 1, bg = null, a = 24, g = 900;
  let objs = [], halves = [], parts = [], pops = [], trail = [];
  let t = 0, spawnIn = 0.7, adCd = 9, running = false, paused = false, over = false, raf = 0, last = 0;
  let lives = 3, flash = 0, combo = 0, comboT = 0, down = false, adPending = -1, bigText = null;
  let blade = BLADES[0];

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    a = Math.max(16, Math.min(W * 0.075, H * 0.042));
    g = H * 0.95;
    bg = makeBackground(W, H, dpr);
  }
  function pick() {
    const tot = FRUITS.reduce((s, f) => s + f.w, 0);
    let r = Math.random() * tot;
    for (const f of FRUITS) { if ((r -= f.w) <= 0) return f; }
    return FRUITS[0];
  }
  function launch(f) {
    const x = W * (0.14 + Math.random() * 0.72);
    const peak = H * (0.5 + Math.random() * 0.3);
    const vy = -Math.sqrt(2 * g * peak);
    const tPeak = -vy / g;
    const tx = W * (0.25 + Math.random() * 0.5);
    objs.push({ f, x, y: H + a * 1.6, vx: (tx - x) / (tPeak * 1.7), vy, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 4, size: a * (f.size || 1) * (f.ad ? 1.1 : 1) });
  }
  function slice(o, ang) {
    o.dead = true;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    for (const k of [-1, 1]) halves.push({ f: o.f, size: o.size, x: o.x, y: o.y, vx: o.vx * 0.6 + nx * k * a * 3.2, vy: Math.min(o.vy, 0) * 0.3 + ny * k * a * 3.2 - a * 4, rot: o.rot, vr: o.vr + k * 2.5, cut: ang - o.rot, side: k, life: 2.5 });
    const n = reduce ? 6 : 16;
    for (let i = 0; i < n; i++) {
      const sp = a * (2 + Math.random() * 8);
      const an = Math.random() * 6.28;
      parts.push({ x: o.x, y: o.y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp - a * 3, s: a * (0.12 + Math.random() * 0.2), c: Math.random() < 0.6 ? o.f.juice : o.f.flesh, life: 0.7 + Math.random() * 0.5, r: Math.random() * 6 });
    }
    const res = hooks.onSlice(o.f) || { c: o.f.c };
    pops.push({ x: o.x, y: o.y - o.size, text: '+' + rbx(res.c) + ' RBX', col: o.f.ad ? '#ffe14a' : '#ffffff', life: 1, big: !!o.f.ad });
    combo++; comboT = 0.32;
    if (o.f.ad) adPending = 0.45;
  }
  function segDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
    let tt = ((px - x1) * dx + (py - y1) * dy) / l2; tt = Math.max(0, Math.min(1, tt));
    const qx = x1 + tt * dx, qy = y1 + tt * dy;
    return Math.hypot(px - qx, py - qy);
  }
  function cut(x1, y1, x2, y2) {
    if (!running || paused || over) return;
    if (Math.hypot(x2 - x1, y2 - y1) < 3) return;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    for (const o of objs) if (!o.dead && segDist(o.x, o.y, x1, y1, x2, y2) < o.size * 1.3) slice(o, ang);
  }
  function update(dt) {
    t += dt;
    spawnIn -= dt; adCd -= dt;
    if (spawnIn <= 0 && !over) {
      const lvl = Math.min(1, t / 90);
      const n = 1 + Math.floor(Math.random() * (1.6 + lvl * 3));
      for (let i = 0; i < n; i++) setTimeout(() => running && !over && launch(pick()), i * 140);
      if (adCd <= 0 && !objs.some(o => o.f.ad) && Math.random() < 0.32) { launch(ADBOX); adCd = 14 + Math.random() * 10; }
      spawnIn = 1.45 - lvl * 0.6 + Math.random() * 0.5;
    }
    for (const o of objs) {
      o.vy += g * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.vr * dt;
      if (!o.dead && o.vy > 0 && o.y - o.size * 2 > H) {
        o.dead = true;
        if (!o.f.ad) {
          lives--; flash = 0.35; hooks.onMiss(lives);
          if (lives <= 0) { over = true; setTimeout(() => hooks.onOver(), 700); }
        }
      }
    }
    objs = objs.filter(o => !o.dead);
    for (const h of halves) { h.vy += g * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; h.life -= dt; }
    halves = halves.filter(h => h.life > 0 && h.y < H + a * 4);
    for (const p of parts) { p.vy += g * 0.8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; p.r += dt * 6; }
    parts = parts.filter(p => p.life > 0);
    for (const p of pops) { p.y -= a * 1.6 * dt; p.life -= dt * 0.9; }
    pops = pops.filter(p => p.life > 0);
    if (comboT > 0) {
      comboT -= dt;
      if (comboT <= 0) {
        if (combo >= 3) { const bonus = hooks.onCombo(combo); bigText = { text: hooks.comboText(combo), sub: '+' + rbx(bonus) + ' RBX', life: 1.2 }; }
        combo = 0;
      }
    }
    if (bigText) { bigText.life -= dt; if (bigText.life <= 0) bigText = null; }
    if (flash > 0) flash -= dt;
    if (adPending > 0) { adPending -= dt; if (adPending <= 0) { adPending = -1; paused = true; hooks.onAdBox(); } }
  }
  function drawSprite(f, size, x, y, rot, clip) {
    const sp = sprite(f, size);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    if (clip) {
      ctx.rotate(clip.cut); ctx.beginPath(); ctx.rect(-sp.S, clip.side < 0 ? -sp.S : 0, sp.S * 2, sp.S); ctx.clip();
      ctx.rotate(-clip.cut);
    }
    if (f.ad && !clip) { ctx.shadowColor = '#ffe14a'; ctx.shadowBlur = 18 + Math.sin(t * 8) * 8; }
    ctx.drawImage(sp.cv, -sp.S / 2, -sp.S / 2 - size * 0.2, sp.S, sp.S);
    ctx.shadowBlur = 0;
    if (clip) { ctx.rotate(clip.cut); ctx.fillStyle = f.flesh; ctx.fillRect(-size * 0.9, -size * 0.08, size * 1.8, size * 0.16); }
    ctx.restore();
  }
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (bg) ctx.drawImage(bg, 0, 0, W, H);
    for (const h of halves) drawSprite(h.f, h.size, h.x, h.y, h.rot, h);
    for (const o of objs) drawSprite(o.f, o.size, o.x, o.y, o.rot);
    for (const p of parts) { ctx.globalAlpha = Math.min(1, p.life * 1.5); ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore(); }
    ctx.globalAlpha = 1;
    // blade trail
    const now = performance.now();
    trail = trail.filter(p => now - p.t < 130);
    if (trail.length > 1) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowColor = blade.colors[0]; ctx.shadowBlur = 14;
      for (let i = 1; i < trail.length; i++) {
        const k = i / trail.length;
        const cols = blade.colors;
        ctx.strokeStyle = blade.id === 'rainbow' ? cols[i % cols.length] : (k > 0.6 ? cols[0] : cols[cols.length - 1]);
        ctx.lineWidth = Math.max(1, a * 0.32 * k);
        ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const p of pops) {
      ctx.globalAlpha = Math.min(1, p.life * 1.6);
      ctx.font = '800 ' + Math.round(a * (p.big ? 0.95 : 0.62)) + 'px Unbounded, "Arial Black", sans-serif';
      ctx.lineWidth = a * 0.18; ctx.strokeStyle = '#15172e'; ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.col; ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
    if (bigText) {
      const s = 1 + Math.max(0, bigText.life - 0.9) * 1.5;
      ctx.save(); ctx.translate(W / 2, H * 0.38); ctx.scale(s, s);
      ctx.globalAlpha = Math.min(1, bigText.life * 2);
      ctx.font = '900 ' + Math.round(a * 1.25) + 'px Unbounded, "Arial Black", sans-serif';
      ctx.lineWidth = a * 0.3; ctx.strokeStyle = '#15172e'; ctx.strokeText(bigText.text, 0, 0);
      ctx.fillStyle = '#ffc928'; ctx.fillText(bigText.text, 0, 0);
      ctx.font = '800 ' + Math.round(a * 0.7) + 'px Unbounded, "Arial Black", sans-serif';
      ctx.lineWidth = a * 0.2; ctx.strokeText(bigText.sub, 0, a * 1.2); ctx.fillStyle = '#ffffff'; ctx.fillText(bigText.sub, 0, a * 1.2);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    if (flash > 0) { ctx.fillStyle = 'rgba(255,40,40,' + (flash * 0.9).toFixed(2) + ')'; ctx.fillRect(0, 0, W, H); }
  }
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000 || 0);
    last = now;
    if (running && !paused) update(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; }
  function onDown(e) { down = true; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); trail = [pos(e)]; }
  function onMove(e) {
    if (!down) return;
    const p = pos(e), prev = trail[trail.length - 1];
    trail.push(p);
    if (prev) cut(prev.x, prev.y, p.x, p.y);
  }
  function onUp() { down = false; }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas._probe = () => objs.filter(o => !o.dead).map(o => ({ x: o.x, y: o.y, vy: o.vy, ad: !!o.f.ad }));
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  last = performance.now();
  raf = requestAnimationFrame(frame);

  return {
    start(opts) {
      objs = []; halves = []; parts = []; pops = []; trail = []; bigText = null;
      t = 0; spawnIn = 0.6; adCd = 9; over = false; paused = false; running = true; combo = 0; comboT = 0; adPending = -1;
      lives = opts.lives; blade = BLADES.find(b => b.id === opts.blade) || BLADES[0];
    },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    isPaused: () => paused,
    spawnAd() { if (running && !over) { launch(ADBOX); adCd = 14; } },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
    }
  };
}

/* ============================== SMALL UI ============================== */
function Coin({ size = 18 }) {
  return (
    <svg className="coin" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#ffc928" stroke="#15172e" strokeWidth="2.4" />
      <rect x="6" y="6" width="12" height="12" rx="2" fill="#ffe27a" transform="rotate(12 12 12)" />
      <text x="12" y="16" textAnchor="middle" fontFamily="Unbounded, Arial Black, sans-serif" fontWeight="900" fontSize="10" fill="#15172e">R</text>
    </svg>
  );
}
function CubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 21 7 12 12 3 7Z" fill="#7fd0ff" stroke="#15172e" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 7 12 12 12 22 3 17Z" fill="#2b9bff" stroke="#15172e" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M21 7 12 12 12 22 21 17Z" fill="#1e6fd1" stroke="#15172e" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function Avatar({ id, size = 60 }) {
  const c = CHARS.find(x => x.id === id) || CHARS[0];
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" aria-hidden="true" className="avatar">
      {c.ears && <g fill={c.head} stroke="#15172e" strokeWidth="2"><path d="M18 8 22 0 27 6Z" /><path d="M42 8 38 0 33 6Z" /></g>}
      <rect x="17" y="4" width="26" height="22" rx="4" fill={c.head} stroke="#15172e" strokeWidth="2.4" />
      {c.band && <rect x="16" y="9" width="28" height="5" fill={c.band} stroke="#15172e" strokeWidth="1.6" />}
      {c.visor ? <rect x="21" y="12" width="18" height="6" rx="2" fill={c.visor} stroke="#15172e" strokeWidth="1.6" /> : <g fill="#15172e"><rect x="23" y="13" width="4" height="5" rx="1" /><rect x="33" y="13" width="4" height="5" rx="1" /></g>}
      {!c.visor && <path d="M24 21 Q30 25 36 21" fill="none" stroke="#15172e" strokeWidth="2" strokeLinecap="round" />}
      {c.visor && <g><rect x="28.5" y="-2" width="3" height="7" fill="#69739a" /><circle cx="30" cy="-2" r="2.6" fill="#ff4545" stroke="#15172e" strokeWidth="1.2" /></g>}
      {c.ears && <g stroke="#15172e" strokeWidth="1.2"><path d="M14 19h7M14 22h7M39 19h7M39 22h7" /></g>}
      <rect x="13" y="28" width="34" height="30" rx="3" fill={c.body} stroke="#15172e" strokeWidth="2.4" />
      <rect x="2" y="28" width="10" height="28" rx="3" fill={c.arms} stroke="#15172e" strokeWidth="2.4" />
      <rect x="48" y="28" width="10" height="28" rx="3" fill={c.arms} stroke="#15172e" strokeWidth="2.4" />
      <rect x="14" y="58" width="15" height="30" rx="3" fill={c.legs} stroke="#15172e" strokeWidth="2.4" />
      <rect x="31" y="58" width="15" height="30" rx="3" fill={c.legs} stroke="#15172e" strokeWidth="2.4" />
    </svg>
  );
}
function Bar({ value, max, ready, t, onClick }) {
  const pct = Math.min(1, value / max);
  return (
    <button type="button" className={'g-bar' + (ready ? ' ready' : '')} onClick={onClick}>
      <span className="g-bar-top">
        <Coin size={16} />
        <b>{rbx(value)}</b><span className="g-bar-of">/ {max} RBX</span>
        <span className="g-bar-lbl">{ready ? t.ready : t.toW}</span>
      </span>
      <span className="g-bar-track"><span className="g-bar-fill" style={{ width: (pct * 100).toFixed(1) + '%' }} /></span>
    </button>
  );
}

/* ============================== PHONE SCREENS ============================== */
function MenuScreen({ t, save, go, openWithdraw }) {
  const goal = target(save.tier) * 100;
  return (
    <div className="g-screen g-menu">
      <div className="g-top">
        <span className="g-pill"><CubeIcon /> {save.cubes}</span>
        <span className="g-pill"><Coin size={16} /> {rbx(save.balanceC)}</span>
      </div>
      <div className="g-logo"><span>CUBE</span><span>SLICER</span></div>
      <div className="g-hero">
        <div className="g-podium"><Avatar id={save.char} size={66} /></div>
        <div className="g-fruit-orbit">
          <img src={spriteURL(FRUITS[0])} alt="" /><img src={spriteURL(FRUITS[4])} alt="" /><img src={spriteURL(FRUITS[2])} alt="" />
        </div>
      </div>
      <button type="button" className="g-btn g-play" onClick={() => go('game')}>{t.play}</button>
      <div className="g-grid">
        <button type="button" className="g-btn g-tile" onClick={() => go('shop')}><span className="g-ico g-ico-shop" />{t.shop}</button>
        <button type="button" className="g-btn g-tile" onClick={() => go('road')}><span className="g-ico g-ico-road" />{t.road}</button>
        <button type="button" className="g-btn g-tile" onClick={() => go('fruits')}><span className="g-ico g-ico-fruit" />{t.fruits}</button>
        <button type="button" className="g-btn g-tile" onClick={() => go('chars')}><span className="g-ico g-ico-char" />{t.chars}</button>
      </div>
      <div className="g-menu-bar"><Bar value={save.balanceC} max={target(save.tier)} ready={save.balanceC >= goal} t={t} onClick={() => (save.balanceC >= goal ? openWithdraw() : go('road'))} /></div>
    </div>
  );
}

function Header({ title, onBack, t, save }) {
  return (
    <div className="g-head">
      <button type="button" className="g-btn g-back" onClick={onBack} aria-label={t.back}>‹</button>
      <h3>{title}</h3>
      <span className="g-pill"><CubeIcon /> {save.cubes}</span>
    </div>
  );
}

function RoadScreen({ t, save, back, openWithdraw }) {
  const goal = target(save.tier);
  const ready = save.balanceC >= goal * 100;
  return (
    <div className="g-screen g-list">
      <Header title={t.road} onBack={back} t={t} save={save} />
      <p className="g-note">{t.roadText}</p>
      <ol className="g-road">
        {TIERS.map((v, i) => {
          const st = i < save.tier ? 'done' : i === save.tier ? 'cur' : 'lock';
          const pct = st === 'cur' ? Math.min(1, save.balanceC / (v * 100)) : st === 'done' ? 1 : 0;
          return (
            <li key={v} className={'g-node ' + st}>
              <span className="g-node-dot">{st === 'done' ? '✓' : i + 1}</span>
              <div className="g-node-body">
                <b><Coin size={16} /> {v} RBX</b>
                <span>{st === 'done' ? t.done : st === 'cur' ? t.current + ' · ' + rbx(save.balanceC) + ' / ' + v : t.locked}</span>
                {st === 'cur' && <span className="g-node-track"><span style={{ width: pct * 100 + '%' }} /></span>}
              </div>
            </li>
          );
        })}
      </ol>
      <button type="button" className="g-btn g-play g-small" disabled={!ready} onClick={openWithdraw}>{ready ? t.withdraw + ' ' + goal + ' RBX' : t.wNeed(rbx(goal * 100 - save.balanceC))}</button>
    </div>
  );
}

function FruitsScreen({ t, save, back }) {
  return (
    <div className="g-screen g-list">
      <Header title={t.fruits} onBack={back} t={t} save={save} />
      <p className="g-note">{t.fruitsHint}</p>
      <ul className="g-fruits">
        {ALL_ITEMS.map(f => (
          <li key={f.id} className={f.ad ? 'is-ad' : ''}>
            <img src={spriteURL(f)} alt="" />
            <span className="g-fn"><b>{t.fruitNames[f.id]}</b><small>{t.rar[f.rar]}</small></span>
            <span className="g-fv"><Coin size={14} /> {rbx(f.c)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShopScreen({ t, save, setSave, back, initialTab, toast }) {
  const [tab, setTab] = useState(initialTab || 'blades');
  const list = tab === 'blades' ? BLADES : CHARS;
  const ownedKey = tab === 'blades' ? 'blades' : 'chars';
  const curKey = tab === 'blades' ? 'blade' : 'char';
  function act(item) {
    if (save[ownedKey].includes(item.id)) { setSave(s => ({ ...s, [curKey]: item.id })); return; }
    if (item.iap) { toast(t.iapNote); return; }
    if (save.cubes < item.price) { toast(t.poor); return; }
    setSave(s => ({ ...s, cubes: s.cubes - item.price, [ownedKey]: [...s[ownedKey], item.id], [curKey]: item.id }));
    toast(t.bought);
  }
  return (
    <div className="g-screen g-list">
      <Header title={tab === 'blades' ? t.shop : t.chars} onBack={back} t={t} save={save} />
      <div className="g-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'blades'} onClick={() => setTab('blades')}>{t.blades}</button>
        <button type="button" role="tab" aria-selected={tab === 'chars'} onClick={() => setTab('chars')}>{t.chars}</button>
      </div>
      <ul className="g-shop">
        {list.map(item => {
          const owned = save[ownedKey].includes(item.id);
          const eq = save[curKey] === item.id;
          return (
            <li key={item.id} className={eq ? 'eq' : ''}>
              <span className="g-prev">
                {tab === 'blades'
                  ? <span className="g-blade" style={{ background: 'linear-gradient(90deg,' + item.colors.join(',') + ')' }} />
                  : <Avatar id={item.id} size={30} />}
              </span>
              <span className="g-fn"><b>{tab === 'blades' ? t.bladeNames[item.id] : t.charNames[item.id]}</b>{tab === 'chars' && <small>{t.perks[item.id]}</small>}</span>
              <button type="button" className={'g-btn g-buy' + (eq ? ' on' : '') + (item.iap && !owned ? ' iap' : '')} onClick={() => act(item)}>
                {eq ? t.equipped : owned ? t.owned : item.iap ? item.iap : <><CubeIcon size={13} /> {item.price}</>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GameScreen({ t, save, setSave, onOver, engineApi, openWithdraw, onAd, overlayOpen }) {
  const canvasRef = useRef(null);
  const engRef = useRef(null);
  const saveRef = useRef(save);
  saveRef.current = save;
  const char = CHARS.find(c => c.id === save.char) || CHARS[0];
  const startLives = char.id === 'ninja' ? 4 : 3;
  const [lives, setLives] = useState(startLives);
  const [session, setSession] = useState({ c: 0, n: 0, best: 0 });
  const [paused, setPaused] = useState(false);
  const sessRef = useRef(session);
  sessRef.current = session;
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    const eng = createEngine(canvasRef.current, {
      onSlice(f) {
        const k = f.k * (saveRef.current.char === 'cat' ? 2 : 1);
        setSave(s => ({ ...s, balanceC: s.balanceC + (f.ad ? 0 : f.c), cubes: s.cubes + k }));
        setSession(s => ({ ...s, c: s.c + f.c, n: s.n + 1 }));
        return { c: f.c };
      },
      onCombo(n) {
        const bonus = (n - 2) * (saveRef.current.char === 'robot' ? 2 : 1);
        setSave(s => ({ ...s, balanceC: s.balanceC + bonus }));
        setSession(s => ({ ...s, c: s.c + bonus, best: Math.max(s.best, n) }));
        return bonus;
      },
      comboText: n => tRef.current.comboTxt(n),
      onMiss(l) { setLives(l); },
      onAdBox() { onAd(); },
      onOver() { onOver(sessRef.current); }
    });
    engRef.current = eng;
    engineApi.current = eng;
    eng.start({ lives: startLives, blade: saveRef.current.blade });
    return () => { eng.destroy(); engineApi.current = null; };
  }, []);

  useEffect(() => {
    const e = engRef.current;
    if (!e) return;
    if (paused || overlayOpen) e.pause(); else e.resume();
  }, [paused, overlayOpen]);

  const goal = target(save.tier);
  const ready = save.balanceC >= goal * 100;
  return (
    <div className="g-screen g-game">
      <canvas ref={canvasRef} className="g-canvas" aria-label="Cube Slicer" />
      <div className="g-hud">
        <Bar value={save.balanceC} max={goal} ready={ready} t={t} onClick={() => { if (ready) { setPaused(true); openWithdraw(() => setPaused(false)); } }} />
        <div className="g-hud-row">
          <span className="g-lives" aria-label={'lives ' + lives}>
            {Array.from({ length: startLives }).map((_, i) => <i key={i} className={i < lives ? 'on' : ''} />)}
          </span>
          <span className="g-pill g-sess">+{rbx(session.c)}</span>
          <button type="button" className="g-btn g-pause" onClick={() => setPaused(true)} aria-label={t.pause}>II</button>
        </div>
      </div>
      {paused && (
        <div className="g-modal">
          <div className="g-card">
            <h3>{t.paused}</h3>
            <button type="button" className="g-btn g-play g-small" onClick={() => setPaused(false)}>{t.resume}</button>
            <button type="button" className="g-btn g-ghost" onClick={() => onOver(session, true)}>{t.exitGame}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function OverScreen({ t, stats, go }) {
  return (
    <div className="g-screen g-menu g-over">
      <div className="g-logo g-logo-sm"><span>{t.over}</span></div>
      <div className="g-card g-stats">
        <div><span>{t.earned}</span><b><Coin size={18} /> {rbx(stats.c)} RBX</b></div>
        <div><span>{t.sliced}</span><b>{stats.n}</b></div>
        <div><span>{t.combo}</span><b>{stats.best ? '×' + stats.best : '—'}</b></div>
      </div>
      <button type="button" className="g-btn g-play" onClick={() => go('game')}>{t.again}</button>
      <button type="button" className="g-btn g-ghost" onClick={() => go('menu')}>{t.menu}</button>
    </div>
  );
}

function AdOverlay({ t, onDone }) {
  const DUR = 5;
  const [left, setLeft] = useState(DUR);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = now => {
      const l = Math.max(0, DUR - (now - start) / 1000);
      setLeft(l);
      if (l > 0) raf = requestAnimationFrame(tick);
      else { setDone(true); setTimeout(onDone, 1000); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="g-ad" role="dialog" aria-label={t.adLabel}>
      <div className="g-ad-top"><span className="g-ad-tag">{t.adLabel}</span><span>{done ? '' : t.adWait(Math.ceil(left))}</span></div>
      <div className="g-ad-creative">
        <div className="g-ad-road"><span className="g-car"><i /><i /></span></div>
        <b>{t.adGame}</b>
        <span>{t.adSub}</span>
        <span className="g-btn g-play g-small g-ad-cta">{t.adCta}</span>
      </div>
      <div className="g-ad-track"><span style={{ width: ((1 - left / DUR) * 100).toFixed(1) + '%' }} /></div>
      {done && <div className="g-ad-reward"><Coin size={34} /><b>{t.adDone}</b></div>}
    </div>
  );
}

function WithdrawModal({ t, save, setSave, onClose }) {
  const [amount] = useState(() => target(save.tier));
  const [nick, setNick] = useState('');
  const [err, setErr] = useState('');
  const [stage, setStage] = useState('form');
  function submit(e) {
    e.preventDefault();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(nick.trim())) { setErr(t.wErr); return; }
    setErr(''); setStage('check');
    setTimeout(() => setStage('send'), 1100);
    setTimeout(() => {
      setStage('ok');
      setSave(s => ({ ...s, balanceC: 0, tier: s.tier + 1, withdrawnC: s.withdrawnC + amount * 100 }));
    }, 2300);
  }
  return (
    <div className="g-modal">
      <form className="g-card g-wd" onSubmit={submit} noValidate>
        {stage === 'ok' ? (
          <>
            <div className="g-burst"><Coin size={54} /></div>
            <h3>{t.wOk(amount, nick.trim())}</h3>
            <p className="g-note">{t.wNext(target(save.tier))}</p>
            <p className="g-tiny">{t.wDemo}</p>
            <button type="button" className="g-btn g-play g-small" onClick={onClose}>{t.wClose}</button>
          </>
        ) : (
          <>
            <h3>{t.wTitle}</h3>
            <div className="g-amount"><Coin size={30} /> {amount} RBX</div>
            <label htmlFor="wd-nick">{t.wNick}</label>
            <input id="wd-nick" className="g-input" value={nick} onChange={e => setNick(e.target.value)} placeholder={t.wPh} autoComplete="off" disabled={stage !== 'form'} />
            {err && <span className="g-err">{err}</span>}
            {stage === 'form'
              ? <button type="submit" className="g-btn g-play g-small">{t.wSend(amount)}</button>
              : <div className="g-loading"><span className="g-spin" />{stage === 'check' ? t.wCheck : t.wSending}</div>}
            {stage === 'form' && <button type="button" className="g-btn g-ghost" onClick={onClose}>{t.back}</button>}
            <p className="g-tiny">{t.wDemo}</p>
          </>
        )}
      </form>
    </div>
  );
}

function PhoneApp({ t, save, setSave, api }) {
  const [screen, setScreen] = useState('menu');
  const [runId, setRunId] = useState(0);
  const [stats, setStats] = useState(null);
  const [ad, setAd] = useState(false);
  const [wd, setWd] = useState(null);
  const [msg, setMsg] = useState('');
  const engineApi = useRef(null);
  const pendingAd = useRef(false);
  const msgT = useRef(0);
  const toast = m => { setMsg(m); clearTimeout(msgT.current); msgT.current = setTimeout(() => setMsg(''), 2200); };

  const go = s => { if (s === 'game') setRunId(r => r + 1); setScreen(s); };
  const openWithdraw = (after) => setWd({ after: typeof after === 'function' ? after : null });

  useEffect(() => {
    api.current = {
      spawnAd() {
        if (screen === 'game' && engineApi.current) engineApi.current.spawnAd();
        else { pendingAd.current = true; go('game'); }
      },
      menu() { setScreen('menu'); setAd(false); setWd(null); }
    };
  });
  useEffect(() => {
    if (screen === 'game' && pendingAd.current) {
      pendingAd.current = false;
      const id = setTimeout(() => engineApi.current && engineApi.current.spawnAd(), 700);
      return () => clearTimeout(id);
    }
  }, [screen, runId]);

  function adDone() {
    setSave(s => ({ ...s, balanceC: s.balanceC + ADBOX.c }));
    setAd(false);
  }
  return (
    <div className="g-app">
      {screen === 'menu' && <MenuScreen t={t} save={save} go={go} openWithdraw={openWithdraw} />}
      {screen === 'game' && (
        <GameScreen key={runId} t={t} save={save} setSave={setSave} engineApi={engineApi}
          openWithdraw={openWithdraw} onAd={() => setAd(true)} overlayOpen={ad || !!wd}
          onOver={(s, quit) => { setSave(v => ({ ...v, best: Math.max(v.best, s.n) })); if (quit) setScreen('menu'); else { setStats(s); setScreen('over'); } }} />
      )}
      {screen === 'over' && stats && <OverScreen t={t} stats={stats} go={go} />}
      {screen === 'road' && <RoadScreen t={t} save={save} back={() => setScreen('menu')} openWithdraw={openWithdraw} />}
      {screen === 'fruits' && <FruitsScreen t={t} save={save} back={() => setScreen('menu')} />}
      {(screen === 'shop' || screen === 'chars') && <ShopScreen key={screen} t={t} save={save} setSave={setSave} back={() => setScreen('menu')} initialTab={screen === 'chars' ? 'chars' : 'blades'} toast={toast} />}
      {ad && <AdOverlay t={t} onDone={adDone} />}
      {wd && <WithdrawModal t={t} save={save} setSave={setSave} onClose={() => { const a = wd.after; setWd(null); if (a) a(); }} />}
      {msg && <div className="g-toast">{msg}</div>}
    </div>
  );
}

/* ============================== PHONE STAGE ============================== */
function Stage({ T, save, setSave, phoneApi }) {
  const [full, setFull] = useState(false);
  const [dims, setDims] = useState(null);
  const stageRef = useRef(null);
  const native = useRef(false);
  const exit = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }, []);
  function enter() {
    setFull(true);
    try {
      const el = stageRef.current;
      if (el.requestFullscreen) el.requestFullscreen().then(() => { native.current = true; }).catch(() => {});
    } catch (e) {}
  }
  useEffect(() => {
    if (!full) { setDims(null); return; }
    const fit = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (vw < 560) { setDims({ w: vw, h: vh, bare: true }); return; }
      let h = Math.min(vh - 48, 940), w = h / 2.165;
      if (w > vw - 48) { w = vw - 48; h = w * 2.165; }
      setDims({ w, h });
    };
    fit();
    const onKey = e => { if (e.key === 'Escape') exit(); };
    const onFs = () => { if (!document.fullscreenElement && native.current) { native.current = false; setFull(false); } };
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFs); };
  }, [full]);
  const style = dims ? { '--pw': dims.w + 'px', '--ph': dims.h + 'px' } : undefined;
  return (
    <div className="stage-wrap">
      <div ref={stageRef} className={'stage' + (full ? ' full' : '') + (dims && dims.bare ? ' bare' : '')}>
        {full && <button type="button" className="exit-full" onClick={exit}>✕ <span>{T.hero.exit}</span></button>}
        <div className="phone" style={style}>
          <div className="screen">
            <span className="notch" aria-hidden="true" />
            <PhoneApp t={T.g} save={save} setSave={setSave} api={phoneApi} />
          </div>
        </div>
      </div>
      <div className="stage-tools">
        <button type="button" className="btn btn-main" onClick={enter}>⛶ {T.hero.full}</button>
        <div className="demo-box">
          <span className="demo-lbl">{T.hero.demo}</span>
          <div className="demo-row">
            <button type="button" className="btn btn-sm" onClick={() => setSave(s => ({ ...s, balanceC: s.balanceC + 50 }))}>{T.hero.add}</button>
            <button type="button" className="btn btn-sm" onClick={() => phoneApi.current && phoneApi.current.spawnAd()}>{T.hero.callAd}</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setSave({ ...DEFAULT_SAVE }); phoneApi.current && phoneApi.current.menu(); }}>{T.hero.reset}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== LANDING ============================== */
function SecHead({ eyebrow, title, children, dark }) {
  return (
    <div className={'sec-head' + (dark ? ' dark' : '')}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function Calc({ L }) {
  const [v, setV] = useState({ dau: 10000, ads: 4, ecpm: 8, rbxAd: 0.25, rbxFruit: 0.3, share: 40, cost: 0.0125, iap: 0.01 });
  const set = k => e => { const n = parseFloat(e.target.value); setV(s => ({ ...s, [k]: isNaN(n) ? 0 : n })); };
  const rev = v.dau * v.ads * v.ecpm / 1000;
  const iapRev = v.dau * v.iap;
  const rbxDay = v.dau * (v.ads * v.rbxAd + v.rbxFruit);
  const payout = rbxDay * (v.share / 100) * v.cost;
  const profit = rev + iapRev - payout;
  const margin = rev + iapRev > 0 ? profit / (rev + iapRev) : 0;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const fields = [['dau', 1000, 1], ['ads', 0.5, 2], ['ecpm', 0.5, 2], ['rbxAd', 0.05, 3], ['rbxFruit', 0.05, 3], ['share', 5, 1], ['cost', 0.001, 4], ['iap', 0.005, 3]];
  return (
    <div className="calc">
      <h3>{L.title}</h3>
      <p className="calc-note">{L.note}</p>
      <div className="calc-grid">
        <div className="calc-in">
          {fields.map(([k, step]) => (
            <label key={k} className="calc-field" htmlFor={'calc-' + k}>
              <span>{L[k]}</span>
              <input id={'calc-' + k} type="number" min="0" step={step} value={v[k]} onChange={set(k)} />
            </label>
          ))}
        </div>
        <div className="calc-out">
          <div className="calc-row"><span>{L.rev}</span><b>{money(rev)}</b><small>{L.day}</small></div>
          <div className="calc-row"><span>{L.iapRev}</span><b>{money(iapRev)}</b><small>{L.day}</small></div>
          <div className="calc-row neg"><span>{L.payout}</span><b>−{money(payout)}</b><small>{L.day}</small></div>
          <div className="calc-total">
            <span>{L.profit}</span>
            <b>{money(profit)} <small>{L.day}</small></b>
            <b className="calc-month">{money(profit * 30)} <small>{L.month}</small></b>
            <span className="calc-margin">{L.margin}: {(margin * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(() => {
    try { const s = localStorage.getItem('cube-slicer-lang'); if (s && TXT[s]) return s; } catch (e) {}
    const n = (navigator.language || '').toLowerCase();
    return n.startsWith('ru') ? 'ru' : 'uk';
  });
  const [save, setSave] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) return { ...DEFAULT_SAVE, ...s }; } catch (e) {}
    return { ...DEFAULT_SAVE };
  });
  useEffect(() => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }, [save]);
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('cube-slicer-lang', lang); } catch (e) {} }, [lang]);
  const phoneApi = useRef(null);
  const T = TXT[lang];
  const G = T.g;
  const total = TIERS.reduce((s, x) => s + x, 0);
  const maxTier = TIERS[TIERS.length - 1];

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" aria-label="Cube Slicer">
            <img src={spriteURL(FRUITS[4])} alt="" width="34" height="34" />
            <span>CUBE<br />SLICER</span>
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#how">{T.nav.how}</a><a href="#roadmap">{T.nav.road}</a><a href="#adbox">{T.nav.ad}</a><a href="#money" className="nav-money">{T.nav.money}</a><a href="#meta">{T.nav.meta}</a>
          </nav>
          <div className="lang" role="group" aria-label="Language">
            {[['uk', 'UA'], ['ru', 'RU'], ['en', 'EN']].map(([k, l]) => (
              <button key={k} type="button" aria-pressed={lang === k} onClick={() => setLang(k)}>{l}</button>
            ))}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-in">
            <div className="hero-copy">
              <span className="eyebrow">{T.hero.eyebrow}</span>
              <h1>{T.hero.title[0]} <span className="hl">{T.hero.title[1]}</span></h1>
              <p className="lead">{T.hero.lead}</p>
              <ul className="chips">{T.hero.chips.map((c, i) => <li key={i} className={'chip c' + i}>{c}</li>)}</ul>
              <p className="hint">{T.hero.hint}</p>
            </div>
            <Stage T={T} save={save} setSave={setSave} phoneApi={phoneApi} />
          </div>
        </section>

        <section className="sec" id="how">
          <div className="wrap">
            <SecHead eyebrow={T.how.eyebrow} title={T.how.title} />
            <ol className="steps">
              {T.how.steps.map(([h, p], i) => (
                <li key={i} className="blk step">
                  <span className="step-n">{i + 1}</span>
                  <img src={spriteURL(i === 0 ? FRUITS[0] : i === 1 ? FRUITS[6] : i === 2 ? FRUITS[5] : FRUITS[3])} alt="" width="56" height="56" />
                  <h3>{h}</h3><p>{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec sec-road" id="roadmap">
          <div className="wrap">
            <SecHead eyebrow={T.road.eyebrow} title={T.road.title}>{T.road.text}</SecHead>
            <div className="ladder">
              {TIERS.map((v, i) => {
                const st = i < save.tier ? 'done' : i === Math.min(save.tier, TIERS.length - 1) ? 'cur' : 'lock';
                const pct = st === 'cur' ? Math.min(1, save.balanceC / (v * 100)) : st === 'done' ? 1 : 0;
                return (
                  <div key={v} className={'rung ' + st} style={{ '--h': (34 + Math.log(v) / Math.log(maxTier) * 66).toFixed(0) + '%' }}>
                    {st === 'cur' && <span className="you">{T.road.you}</span>}
                    <div className="rung-col">
                      <span className="rung-fill" style={{ height: (pct * 100).toFixed(0) + '%' }} />
                      <b><Coin size={22} /> {v}</b>
                      <small>RBX</small>
                    </div>
                    <span className="rung-lbl">{st === 'done' ? '✓ ' + T.road.done : T.road.step(i + 1)}</span>
                  </div>
                );
              })}
            </div>
            <div className="road-foot">
              <span>{T.road.total}: <b>{total} RBX</b></span>
              <span>{T.road.now}: <b>{rbx(save.balanceC)} / {target(save.tier)} RBX</b></span>
            </div>
          </div>
        </section>

        <section className="sec" id="fruits">
          <div className="wrap fruits-in">
            <SecHead eyebrow={T.fruits.eyebrow} title={T.fruits.title}>{T.fruits.text}</SecHead>
            <div className="blk table-wrap">
              <table className="ftable">
                <thead><tr>{T.fruits.cols.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>
                  {ALL_ITEMS.map(f => (
                    <tr key={f.id} className={f.ad ? 'is-ad' : ''}>
                      <td><span className="fcell"><img src={spriteURL(f)} alt="" width="40" height="40" />{G.fruitNames[f.id]}</span></td>
                      <td className="num"><Coin size={15} /> {rbx(f.c)}</td>
                      <td className="num">{f.k}</td>
                      <td><span className={'rar rar-' + f.rar}>{G.rar[f.rar]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="sec" id="adbox">
          <div className="wrap ad-in">
            <div>
              <SecHead eyebrow={T.ad.eyebrow} title={T.ad.title}>{T.ad.text}</SecHead>
              <ul className="ticks">{T.ad.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="versus">
              <div className="blk vs bad">
                <span className="vs-ico bomb" aria-hidden="true"><i /></span>
                <b>{T.ad.bomb}</b><p>{T.ad.bombText}</p>
              </div>
              <span className="vs-mid">VS</span>
              <div className="blk vs good">
                <img src={spriteURL(ADBOX)} alt="" width="84" height="84" />
                <b>{T.ad.box}</b><p>{T.ad.boxText}</p>
                <span className="vs-reward"><Coin size={20} /> +0.25 RBX</span>
              </div>
            </div>
          </div>
        </section>

        <section className="money" id="money">
          <div className="wrap">
            <div className="money-head">
              <span className="eyebrow">{T.money.eyebrow}</span>
              <h2 className="money-title">{T.money.title}<span className="money-coins" aria-hidden="true"><Coin size={46} /><Coin size={34} /><Coin size={26} /></span></h2>
              <p>{T.money.lead}</p>
            </div>
            <div className="streams">
              {T.money.streams.map(([h, p], i) => (
                <div key={i} className="stream"><span className="stream-n">${i + 1}</span><h3>{h}</h3><p>{p}</p></div>
              ))}
            </div>
            <div className="winwin">
              {T.money.win.map(([h, p], i) => <div key={i} className="ww"><b>{h}</b><span>{p}</span></div>)}
            </div>
            <Calc L={T.money.calc} />
          </div>
        </section>

        <section className="sec" id="meta">
          <div className="wrap">
            <SecHead eyebrow={T.meta.eyebrow} title={T.meta.title} />
            <div className="meta-grid">
              {T.meta.items.map(([h, p], i) => (
                <div key={i} className="blk meta">
                  <span className="meta-ico">
                    {i === 1 ? <Avatar id="ninja" size={26} /> : i === 0 ? <span className="meta-blade" /> : i === 2 ? <><Coin size={22} /><CubeIcon size={22} /></> : <img src={spriteURL(FRUITS[[0, 0, 0, 6, 5, 4][i]])} alt="" width="34" height="34" />}
                  </span>
                  <h3>{h}</h3><p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec sec-next" id="next">
          <div className="wrap">
            <SecHead eyebrow={T.next.eyebrow} title={T.next.title} />
            <div className="next-grid">
              {T.next.items.map(([h, p], i) => <div key={i} className="next"><b>{h}</b><p>{p}</p></div>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="foot"><div className="wrap"><b>CUBE SLICER</b><p>{T.foot}</p></div></footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
