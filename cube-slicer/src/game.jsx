/* Cube Slicer — concept landing + playable phone prototype (React, JSX). Prepared by VELDAN. */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================== DATA ============================== */
// c = reward in hundredths of RBX (1 = 0.01 RBX), d = diamonds
const FRUITS = [
  { id: 'apple', c: 1, w: 30, rar: 'often', top: '#ff6a5e', left: '#e8382d', right: '#b7241b', juice: '#ff4b3e', flesh: '#fff0c8', stem: 1, leaf: 1 },
  { id: 'orange', c: 1, w: 26, rar: 'often', top: '#ffb653', left: '#ff8d1f', right: '#d4690a', juice: '#ff9a2e', flesh: '#ffd38c', dots: '#ffd08a', leaf: 1 },
  { id: 'banana', c: 2, w: 16, rar: 'normal', top: '#fff07a', left: '#ffd83b', right: '#deb215', juice: '#ffe36a', flesh: '#fff6cc', sx: 1.45, sy: 0.62, tip: 1 },
  { id: 'grape', c: 2, w: 14, rar: 'normal', top: '#be8cff', left: '#8f52f2', right: '#6633c4', juice: '#9b5cff', flesh: '#e2ccff', cluster: 1 },
  { id: 'melon', c: 3, w: 9, rar: 'rare', top: '#6ddc76', left: '#2fae4b', right: '#1f8536', juice: '#ff4d6d', flesh: '#ff6f86', stripes: '#13612a', size: 1.22 },
  { id: 'pineapple', c: 5, w: 5, rar: 'epic', top: '#ffd650', left: '#f2aa22', right: '#c98512', juice: '#ffd84a', flesh: '#fff1a8', cross: '#9c620b', crown: 1 },
  { id: 'golden', c: 10, w: 1.6, rar: 'legend', top: '#fff3a6', left: '#ffd23f', right: '#dfa60e', juice: '#ffe066', flesh: '#fff6c8', stem: 1, leaf: 1, shine: 1 }
];
const ADBOX = { id: 'adbox', c: 25, d: 3, rar: 'surprise', top: '#e2b679', left: '#c88d4b', right: '#9d6a32', juice: '#f2c98f', flesh: '#f6dcb4', ad: 1 };
const ALL_ITEMS = [...FRUITS, ADBOX];
const TIERS = [1, 5, 25, 100, 500];
const BLADES = [
  { id: 'classic', price: 0, colors: ['#ffffff', '#cfe8ff'] },
  { id: 'neon', price: 10, colors: ['#3ef0ff', '#1d8bff'] },
  { id: 'fire', price: 25, colors: ['#ffe066', '#ff4a1c'] },
  { id: 'rainbow', price: 50, colors: ['#ff4545', '#ffc928', '#2fc15a', '#2b6fff', '#8f52f2'] },
  { id: 'gold', price: 100, colors: ['#fff3a6', '#ffb800'] }
];
const CHARS = [
  { id: 'noob', price: 0, head: '#ffd23f', body: '#2b6fff', legs: '#2fc15a', arms: '#ffd23f' },
  { id: 'ninja', price: 20, head: '#2a2c48', body: '#2a2c48', legs: '#1b1d33', arms: '#2a2c48', band: '#ff4545' },
  { id: 'robot', price: 35, head: '#c3cbe0', body: '#8e99b8', legs: '#69739a', arms: '#c3cbe0', visor: '#3ef0ff' },
  { id: 'cat', price: 60, head: '#ff9c3a', body: '#ffffff', legs: '#ff9c3a', arms: '#ff9c3a', ears: 1 },
  { id: 'goldnoob', price: 150, head: '#ffe066', body: '#ffbf00', legs: '#e0a100', arms: '#ffe066' }
];
// day rewards: c = RBX hundredths, d = diamonds
const DAILY = [{ d: 3 }, { c: 5 }, { d: 5 }, { c: 10 }, { d: 10 }, { c: 15 }, { c: 25, d: 25 }];
const BOTS = [['BloxMaster', 1840], ['NinjaKid_07', 1522], ['xXSliceXx', 1301], ['MelonLord', 1120], ['PixelPanda', 980], ['CubeQueen', 862], ['FruitFury', 721], ['SwipeGod', 610], ['Noob4Life', 484], ['LemonDrop', 352], ['TinyTitan', 230], ['KiwiKing', 140]];
const FEED = [['MelonLord', 5, 2], ['PixelPanda', 1, 3], ['CubeQueen', 25, 6], ['Noob4Life', 1, 8], ['SwipeGod', 5, 11], ['NinjaKid_07', 1, 14], ['FruitFury', 5, 17], ['BloxMaster', 100, 21], ['LemonDrop', 1, 26], ['xXSliceXx', 25, 32]];
const SAVE_KEY = 'cube-slicer-v2';
const DEFAULT_SAVE = { balanceC: 0, tier: 0, gems: 0, blade: 'classic', blades: ['classic'], char: 'noob', chars: ['noob'], withdrawnC: 0, best: 0, week: 0, dayIdx: 0, lastClaim: null, dayOffset: 0, welcomed: false, nick: 'CoolNinja2014', mine: [] };
const target = tier => TIERS[Math.min(tier, TIERS.length - 1)];
const rbx = c => (c / 100).toFixed(2);
const dayKey = off => { const d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
function dailyState(save) {
  const today = dayKey(save.dayOffset), yest = dayKey(save.dayOffset - 1);
  if (save.lastClaim === today) return { can: false, idx: save.dayIdx, claimedToday: true };
  const cont = save.lastClaim === yest;
  return { can: true, idx: cont ? (save.dayIdx + 1) % 7 : 0, lost: !!save.lastClaim && !cont };
}

/* ============================== TEXT ============================== */
const TXT = {
  uk: {
    nav: { how: 'Як працює', road: 'Роадмап', gems: 'Діаманти', hooks: 'Психологія', money: 'Де бабосік', meta: 'Мета-гра' },
    hero: {
      eyebrow: 'Концепт мобільної гри · інтерактивний прототип', by: 'Підготував VELDAN',
      title: ['Ріж кубічні фрукти —', 'заробляй RBX'],
      lead: 'Механіка Fruit Ninja у блоковому стилі Roblox. Кожен розрізаний фрукт приносить RBX-копієчки, а коли гравець збирає поріг — виводить їх на свій Roblox-акаунт.',
      genre: 'Жанр', genreName: 'Play-to-Earn · аркада · гіперкежуал',
      genreText: 'Play-to-Earn (P2E) — ігри, у яких гравець отримує реальну цінність за час у грі. Ми поєднуємо P2E з простою аркадою на 1 палець, у яку можна грати з першої секунди.',
      chips: ['Від 0.01 RBX за фрукт', 'Перше виведення з 1 RBX', 'Реклама замість бомби', 'Діаманти тільки за рекламу'],
      hint: 'Грайте прямо тут: натисніть «Грати» і проводьте мишкою з натиснутою кнопкою або пальцем по фруктах.',
      full: 'На весь екран', exit: 'Вийти з повного екрана',
      demo: 'Кнопки для презентації', add: '+0.50 RBX', gems: '+20 діамантів', callAd: 'Рекламна коробка', nextDay: 'Наступний день', reset: 'Скинути прогрес'
    },
    how: {
      eyebrow: 'Ігровий цикл', title: 'Як це працює',
      steps: [
        ['Ріж фрукти', 'Свайп по екрану, як у Fruit Ninja. Фрукти кубічні, у стилістиці Roblox, і літають з різною швидкістю.'],
        ['Отримуй RBX-копієчки', 'Кожен фрукт дає від 0.01 до 0.10 RBX. Комбо з трьох і більше фруктів за один свайп дає бонус.'],
        ['Слідкуй за роадмапом', 'Шкала зверху показує, скільки лишилось до виведення. Прогрес видно щосекунди.'],
        ['Виводь на Roblox', 'Набрав поріг — натискаєш «Вивести», і на телефон приходить сповіщення про подарунок від гри.']
      ]
    },
    road: {
      eyebrow: 'Мотивація', title: 'Роадмап виведення',
      text: 'Перше виведення можливе вже з 1 RBX, щоб гравець швидко переконався, що все чесно. Після кожного виведення баланс обнуляється, а наступний поріг вищий: 1 → 5 → 25 → 100 → 500. Гравець бачить усю драбину й знає, скільки може отримати.',
      step: n => 'Крок ' + n, total: 'Разом за п’ять кроків', you: 'Ви тут', done: 'Виведено', now: 'Ваш баланс'
    },
    fruits: {
      eyebrow: 'Економіка', title: 'Скільки дає кожен фрукт',
      text: 'Таблиця доступна гравцю прямо в грі: видно, за чим варто полювати. Рідкісні фрукти дорожчі, а рекламна коробка — найщедріша.',
      cols: ['Фрукт', 'RBX', 'Діаманти', 'Як часто']
    },
    ad: {
      eyebrow: 'Головний твіст', title: 'Рекламна коробка замість бомби',
      text: 'В оригіналі бомба змушує гравця програти. У нас на її місці коробка з рекламою. Вона так само вилітає несподівано, гравець розрізає її на рефлексі — і отримує 0.25 RBX (у 25 разів більше за яблуко) та 3 діаманти. Натомість дивиться 5-секундну рекламу. Гравцю приємно, нам — дохід.',
      bomb: 'Бомба в оригіналі', bombText: 'Розрізав — програв. Гравець злиться.',
      box: 'Коробка в Cube Slicer', boxText: 'Розрізав — +0.25 RBX, +3 діаманти і 5 секунд реклами. Гравець радіє.',
      points: ['Жодного штрафу: коробку можна пропустити', 'Нагорода видна одразу', 'Формат rewarded video: гравець сам обирає подивитися рекламу']
    },
    gems: {
      eyebrow: 'Друга валюта', title: 'Діаманти — тільки за рекламу',
      text: 'RBX гравець виводить, а скіни купує за діаманти. Діаманти не продаються за гроші: їх дає лише реклама. Тому кожен скін у магазині — це кілька рекламних переглядів, на які гравець погоджується сам.',
      flow: [
        ['Розрізав коробку', '+0.25 RBX і +3 діаманти після 5-секундної реклами'],
        ['Кнопка «+» біля балансу', 'Реклама → +5 діамантів'],
        ['«Подвоїти?»', 'Ще одна реклама → ще +5. Нагорода вже «в руках», тому погоджуються майже всі'],
        ['Магазин', 'Скін за 10–150 діамантів = від 2 до 30 переглядів реклами']
      ]
    },
    hooks: {
      eyebrow: 'Психологія утримання', title: 'Хуки, на яких тримається гра',
      lead: 'Ми використовуємо ті самі механізми мотивації, що й казино та найуспішніші мобільні ігри, але в білій формі: без ставок і без ризику. Гравець ніколи не програє гроші, він тільки отримує.',
      source: 'Основа: змінне підкріплення Б. Ф. Скіннера, дослідження ігрових автоматів Наташі Доу Шулл («Addiction by Design», 2012), модель Hook Ніра Еяля («Hooked», 2014) і принципи впливу Роберта Чалдіні («Influence»).',
      loopTitle: 'Цикл звички за моделлю Hook',
      loop: [['Тригер', 'Щоденна нагорода, сповіщення про виплату, стрічка виведень'], ['Дія', 'Один свайп — і вже летить +0.01 RBX'], ['Змінна нагорода', 'Коробка чи золоте яблуко можуть вилетіти будь-якої секунди'], ['Інвестиція', 'Серія днів, скіни, прогрес до наступного виведення']],
      how: 'Як працює', where: 'Де в грі',
      items: [
        ['Перша легка перемога', 'Foot-in-the-door', 'Маленьке «так» відкриває двері до великого. Перша ціль — лише 1 RBX: гравець виводить першу монетку за 10–15 хвилин і починає довіряти грі.', 'Перший поріг роадмапу'],
        ['Ефект градієнта цілі', 'Goal-gradient effect', 'Що ближче ціль, то активніше людина до неї рухається (Kivetz, 2006). Шкала прогресу постійно перед очима.', 'Шкала «0.87 / 1 RBX» зверху'],
        ['Подарований прогрес', 'Endowed progress', 'Шкала, яка вже трохи заповнена, мотивує сильніше за порожню (Nunes & Drèze, 2006). Новачок одразу отримує стартові 0.10 RBX.', 'Вітальний подарунок'],
        ['Змінне підкріплення', 'Variable-ratio reinforcement', 'Несподівана нагорода тримає увагу сильніше за передбачувану. На цьому працюють ігрові автомати. У нас це безкоштовно: ніхто нічого не ставить.', 'Коробки, золоте яблуко, комбо'],
        ['Взаємність', 'Reciprocity', 'Отримавши подарунок, людина охоче віддячує. Коробка спершу дарує RBX і діаманти, тому реклама сприймається як чесний обмін.', 'Рекламна коробка'],
        ['Страх втрати', 'Loss aversion', 'Втрата відчувається приблизно вдвічі сильніше за рівноцінний виграш (Канеман і Тверскі). Пропустиш день — серія щоденних нагород згорає.', '7-денна серія бонусів'],
        ['Соціальний доказ', 'Social proof', 'Люди довіряють тому, що роблять інші. Стрічка реальних виведень і таблиця лідерів показують, що гра справді платить.', 'Стрічка в меню, лідери тижня'],
        ['Ефект незавершеної дії', 'Zeigarnik effect', 'Незакінчена справа не відпускає. Після програшу показуємо «до виведення лишилось 0.12 RBX» — і гравець тисне «Ще раз».', 'Екран кінця гри'],
        ['Послідовність і вкладене', 'Commitment & sunk cost', 'Хто вже вивів 1 RBX і назбирав серію днів, той не кидає. Кожен наступний поріг — продовження вже почато шляху.', 'Пороги 5 → 25 → 100'],
        ['Ефект власності', 'Endowment / IKEA effect', 'Свій персонаж і свої леза цінуються вище. Кастомізація прив’язує гравця до акаунта.', 'Магазин і герої'],
        ['Пропозиція ×2', 'Framing', 'Нагорода вже «в руках», і ще одна реклама подвоює її. Відмовитися важко, а гравець нічого не втрачає.', 'Діаманти, бонуси, кінець гри'],
        ['Миттєвий фідбек', 'Immediate reward', 'Бризки, звук і «+0.01» після кожного розрізу: мозок отримує нагороду в ту ж мить.', 'Кожен свайп']
      ]
    },
    lines: {
      eyebrow: 'Біла зона', title: 'Чого ми принципово не робимо',
      items: [
        ['Без ставок і платної рандомності', 'Гравець ніколи не платить за шанс. Усі випадкові нагороди безкоштовні, тому це не азартна гра.'],
        ['Тільки реальні виплати в стрічці', 'Стрічку виведень і лідерів наповнюють справжні гравці. Вигадані відгуки порушують закони про захист споживачів і ведуть до бану в App Store і Google Play.'],
        ['Чесні пороги', 'Уся драбина виведень видна з першого дня, умови не змінюються заднім числом.'],
        ['Безпека дітей', 'Денні ліміти реклами, вікові налаштування рекламних мереж, без персоналізованої реклами для дітей.']
      ],
      note: 'У прототипі стрічка виведень і таблиця лідерів заповнені прикладами.'
    },
    money: {
      eyebrow: 'Монетизація', title: 'ДЕ ТУТ БАБОСІК',
      lead: 'Уся гра — це воронка до реклами, яку гравець дивиться добровільно, бо щоразу отримує нагороду. Ми заробляємо на кожному кроці його шляху до виведення.',
      streams: [
        ['Рекламні коробки', 'Rewarded video — найдорожчий формат мобільної реклами. Кожна розрізана коробка — оплачений показ.'],
        ['Діаманти за рекламу', 'Кнопка «+» і пропозиція ×2: гравець сам приходить по рекламу, щоб купити скін.'],
        ['Щоденні нагороди ×2', 'Кожен вхід у гру — ще один перегляд за подвоєний бонус.'],
        ['Кінець гри ×2', 'Подвоїти зароблене за гру — найгарячіший момент для реклами.']
      ],
      win: [['Гравець', 'Більше RBX і скінів, жодного програшу через коробку'], ['Рекламодавець', 'Залучена аудиторія, яка сама обрала перегляд'], ['Ми', 'Дохід з кожного показу']],
      calc: {
        title: 'Калькулятор юніт-економіки',
        note: 'Усі значення — припущення для обговорення. Змініть їх під свої дані, і результат перерахується одразу.',
        dau: 'Гравців на день (DAU)', boxes: 'Коробок на гравця за день', extra: 'Інших переглядів на гравця за день (діаманти, ×2, бонуси)', ecpm: 'eCPM rewarded-реклами, $',
        rbxAd: 'RBX за одну коробку', rbxFruit: 'RBX з фруктів на гравця за день', share: 'Частка RBX, яку реально виводять, %', cost: 'Наша ціна 1 RBX, $',
        views: 'Рекламних переглядів', rev: 'Дохід з реклами', payout: 'Витрати на виплати RBX', profit: 'Прибуток', day: 'за день', month: 'за 30 днів', margin: 'Маржа'
      }
    },
    meta: {
      eyebrow: 'Навколо механіки', title: 'Повноцінна гра, а не одна механіка',
      items: [
        ['Магазин лез', 'Класичне, неонове, вогняне, веселкове й золоте лезо змінюють слід від свайпу. Ціна — у діамантах.'],
        ['Герої з бонусами', 'Нуб, Ніндзя (+1 життя), Робот (комбо ×2), Котик (коробки частіше) і Золотий нуб (+2 діаманти з коробки).'],
        ['Щоденні нагороди', '7-денна серія з великим призом на 7-й день і кнопкою «Забрати ×2» за рекламу.'],
        ['Таблиця лідерів', 'Тижневий рейтинг за кількістю розрізаних фруктів. Топ-3 отримують діаманти.'],
        ['Стрічка виведень', 'Біжучий рядок у меню: хто й скільки щойно вивів. Найсильніший доказ, що гра платить.'],
        ['Сповіщення про виплату', 'Після виведення на телефон приходить повідомлення: «Подарунок надійшов! 1 RBX на ваш акаунт».']
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
    foot: 'Cube Slicer — концепт і прототип. Не пов’язано з Roblox Corporation. У прототипі виведення, реклама, стрічка виведень і лідери імітуються.',
    g: {
      play: 'ГРАТИ', shop: 'Магазин', heroes: 'Герої', road: 'Роадмап', fruits: 'Фрукти', daily: 'Бонуси', top: 'Лідери',
      toW: 'до виведення', withdraw: 'Вивести', ready: 'Можна виводити!', back: 'Назад',
      over: 'Гру завершено', again: 'Ще раз', menu: 'Меню', sliced: 'Розрізано', earned: 'Зароблено', combo: 'Найкраще комбо',
      left: n => 'До виведення лишилось ' + n + ' RBX', x2game: 'Подвоїти · реклама', x2done: 'Зароблене подвоєно!',
      adLabel: 'РЕКЛАМА', adWait: n => 'Нагорода через ' + n + ' с', adGot: 'Нагороду зараховано', adGame: 'BLOCK RACERS', adCta: 'Встанови безкоштовно', adSub: 'Гонки на кубічних тачках',
      gemsTitle: 'Безкоштовні діаманти', gemsText: 'Подивись коротку рекламу й отримай 5 діамантів.', gemsBtn: 'Дивитись рекламу',
      doubleTitle: 'Подвоїти?', doubleText: n => 'Ще одна реклама — і ще +' + n + ' діамантів.', doubleYes: 'Так, ×2', doubleNo: 'Ні, дякую',
      noGems: 'Не вистачає діамантів. Натисни «+» біля балансу',
      wTitle: 'Виведення RBX', wNick: 'Акаунт Roblox', wSend: n => 'Вивести ' + n + ' RBX', wCheck: 'Перевіряємо акаунт…', wSending: 'Надсилаємо RBX…',
      wOk: (n, nick) => n + ' RBX відправлено на ' + nick, wDemo: 'У прототипі виведення імітується', wNext: n => 'Наступна ціль: ' + n + ' RBX', wClose: 'Чудово',
      wErr: 'Нік: 3–20 символів, латиниця, цифри або _', wNeed: n => 'Потрібно ще ' + n + ' RBX',
      notifNow: 'зараз', notifTitle: 'Подарунок надійшов!', notifText: (n, nick) => n + ' RBX зараховано на акаунт ' + nick + '. Дякуємо, що граєш!',
      roadText: 'Після кожного виведення баланс обнуляється, а наступна ціль вища.', done: 'Виведено', current: 'Зараз', locked: 'Далі',
      blades: 'Леза', owned: 'Обрати', equipped: 'Обрано', bought: 'Куплено!',
      dailyText: 'Заходь щодня: на 7-й день — велика нагорода. Пропустиш день — серія почнеться спочатку.', day: n => 'День ' + n,
      claim: 'Забрати', claimX2: 'Забрати ×2 · реклама', claimed: 'Вже забрано. Повертайся завтра!', streakLost: 'Серію перервано — починаємо з 1-го дня',
      topText: 'Тижневий рейтинг за розрізаними фруктами. Топ-3 отримують по 50 діамантів.', you: 'Ти', place: n => 'Твоє місце: ' + n, score: 'фруктів', resetIn: 'Скидання через 3 дн. 4 год',
      feed: (nick, n, m) => nick + ' вивів ' + n + ' RBX · ' + m + ' хв тому', feedYou: n => 'Ти вивів ' + n + ' RBX · щойно',
      welTitle: 'Вітаємо в Cube Slicer!', welText: 'Тримай стартовий подарунок, щоб швидше дійти до першого виведення.', welBtn: 'Забрати подарунок',
      comboTxt: n => 'КОМБО ×' + n, pause: 'Пауза', resume: 'Продовжити', exitGame: 'Вийти в меню', paused: 'Пауза',
      bladeNames: { classic: 'Класичне', neon: 'Неон', fire: 'Вогонь', rainbow: 'Веселка', gold: 'Золоте' },
      charNames: { noob: 'Нуб', ninja: 'Ніндзя', robot: 'Робот', cat: 'Котик', goldnoob: 'Золотий нуб' },
      perks: { noob: 'Без бонусу', ninja: '+1 життя', robot: 'Комбо-бонус ×2', cat: 'Коробки вилітають частіше', goldnoob: '+2 діаманти з коробки' },
      fruitNames: { apple: 'Яблуко', orange: 'Апельсин', banana: 'Банан', grape: 'Виноград', melon: 'Кавун', pineapple: 'Ананас', golden: 'Золоте яблуко', adbox: 'Рекламна коробка' },
      rar: { often: 'Часто', normal: 'Середньо', rare: 'Рідко', epic: 'Дуже рідко', legend: 'Легенда', surprise: 'Сюрприз' },
      fruitsHint: 'Ріж дорогі фрукти і не пропускай коробки!'
    }
  },
  ru: {
    nav: { how: 'Как работает', road: 'Роадмап', gems: 'Алмазы', hooks: 'Психология', money: 'Где бабосик', meta: 'Мета-игра' },
    hero: {
      eyebrow: 'Концепт мобильной игры · интерактивный прототип', by: 'Подготовил VELDAN',
      title: ['Режь кубические фрукты —', 'зарабатывай RBX'],
      lead: 'Механика Fruit Ninja в блоковом стиле Roblox. Каждый разрезанный фрукт приносит RBX-копеечки, а когда игрок набирает порог — выводит их на свой Roblox-аккаунт.',
      genre: 'Жанр', genreName: 'Play-to-Earn · аркада · гиперказуал',
      genreText: 'Play-to-Earn (P2E) — игры, в которых игрок получает реальную ценность за время в игре. Мы совмещаем P2E с простой аркадой на 1 палец, в которую можно играть с первой секунды.',
      chips: ['От 0.01 RBX за фрукт', 'Первый вывод с 1 RBX', 'Реклама вместо бомбы', 'Алмазы только за рекламу'],
      hint: 'Играйте прямо здесь: нажмите «Играть» и проводите мышкой с зажатой кнопкой или пальцем по фруктам.',
      full: 'На весь экран', exit: 'Выйти из полного экрана',
      demo: 'Кнопки для презентации', add: '+0.50 RBX', gems: '+20 алмазов', callAd: 'Рекламная коробка', nextDay: 'Следующий день', reset: 'Сбросить прогресс'
    },
    how: {
      eyebrow: 'Игровой цикл', title: 'Как это работает',
      steps: [
        ['Режь фрукты', 'Свайп по экрану, как в Fruit Ninja. Фрукты кубические, в стилистике Roblox, и летают с разной скоростью.'],
        ['Получай RBX-копеечки', 'Каждый фрукт даёт от 0.01 до 0.10 RBX. Комбо из трёх и более фруктов за один свайп даёт бонус.'],
        ['Следи за роадмапом', 'Шкала сверху показывает, сколько осталось до вывода. Прогресс виден каждую секунду.'],
        ['Выводи на Roblox', 'Набрал порог — нажимаешь «Вывести», и на телефон приходит уведомление о подарке от игры.']
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
      cols: ['Фрукт', 'RBX', 'Алмазы', 'Как часто']
    },
    ad: {
      eyebrow: 'Главный твист', title: 'Рекламная коробка вместо бомбы',
      text: 'В оригинале бомба заставляет игрока проиграть. У нас на её месте коробка с рекламой. Она так же вылетает неожиданно, игрок разрезает её на рефлексе — и получает 0.25 RBX (в 25 раз больше, чем за яблоко) и 3 алмаза. Взамен смотрит 5-секундную рекламу. Игроку приятно, нам — доход.',
      bomb: 'Бомба в оригинале', bombText: 'Разрезал — проиграл. Игрок злится.',
      box: 'Коробка в Cube Slicer', boxText: 'Разрезал — +0.25 RBX, +3 алмаза и 5 секунд рекламы. Игрок радуется.',
      points: ['Никакого штрафа: коробку можно пропустить', 'Награда видна сразу', 'Формат rewarded video: игрок сам выбирает посмотреть рекламу']
    },
    gems: {
      eyebrow: 'Вторая валюта', title: 'Алмазы — только за рекламу',
      text: 'RBX игрок выводит, а скины покупает за алмазы. Алмазы не продаются за деньги: их даёт только реклама. Поэтому каждый скин в магазине — это несколько рекламных просмотров, на которые игрок соглашается сам.',
      flow: [
        ['Разрезал коробку', '+0.25 RBX и +3 алмаза после 5-секундной рекламы'],
        ['Кнопка «+» у баланса', 'Реклама → +5 алмазов'],
        ['«Удвоить?»', 'Ещё одна реклама → ещё +5. Награда уже «в руках», поэтому соглашаются почти все'],
        ['Магазин', 'Скин за 10–150 алмазов = от 2 до 30 просмотров рекламы']
      ]
    },
    hooks: {
      eyebrow: 'Психология удержания', title: 'Хуки, на которых держится игра',
      lead: 'Мы используем те же механизмы мотивации, что и казино и самые успешные мобильные игры, но в белой форме: без ставок и без риска. Игрок никогда не проигрывает деньги, он только получает.',
      source: 'Основа: переменное подкрепление Б. Ф. Скиннера, исследование игровых автоматов Наташи Доу Шулл («Addiction by Design», 2012), модель Hook Нира Эяля («Hooked», 2014) и принципы влияния Роберта Чалдини («Influence»).',
      loopTitle: 'Цикл привычки по модели Hook',
      loop: [['Триггер', 'Ежедневная награда, уведомление о выплате, лента выводов'], ['Действие', 'Один свайп — и уже летит +0.01 RBX'], ['Переменная награда', 'Коробка или золотое яблоко могут вылететь в любую секунду'], ['Инвестиция', 'Серия дней, скины, прогресс до следующего вывода']],
      how: 'Как работает', where: 'Где в игре',
      items: [
        ['Первая лёгкая победа', 'Foot-in-the-door', 'Маленькое «да» открывает дверь к большому. Первая цель — всего 1 RBX: игрок выводит первую монетку за 10–15 минут и начинает доверять игре.', 'Первый порог роадмапа'],
        ['Эффект градиента цели', 'Goal-gradient effect', 'Чем ближе цель, тем активнее человек к ней движется (Kivetz, 2006). Шкала прогресса всегда перед глазами.', 'Шкала «0.87 / 1 RBX» сверху'],
        ['Подаренный прогресс', 'Endowed progress', 'Шкала, которая уже немного заполнена, мотивирует сильнее пустой (Nunes & Drèze, 2006). Новичок сразу получает стартовые 0.10 RBX.', 'Приветственный подарок'],
        ['Переменное подкрепление', 'Variable-ratio reinforcement', 'Неожиданная награда держит внимание сильнее предсказуемой. На этом работают игровые автоматы. У нас это бесплатно: никто ничего не ставит.', 'Коробки, золотое яблоко, комбо'],
        ['Взаимность', 'Reciprocity', 'Получив подарок, человек охотно отвечает тем же. Коробка сначала дарит RBX и алмазы, поэтому реклама воспринимается как честный обмен.', 'Рекламная коробка'],
        ['Страх потери', 'Loss aversion', 'Потеря ощущается примерно вдвое сильнее равноценного выигрыша (Канеман и Тверски). Пропустишь день — серия ежедневных наград сгорает.', '7-дневная серия бонусов'],
        ['Социальное доказательство', 'Social proof', 'Люди доверяют тому, что делают другие. Лента реальных выводов и таблица лидеров показывают, что игра действительно платит.', 'Лента в меню, лидеры недели'],
        ['Эффект незавершённого действия', 'Zeigarnik effect', 'Незаконченное дело не отпускает. После проигрыша показываем «до вывода осталось 0.12 RBX» — и игрок жмёт «Ещё раз».', 'Экран конца игры'],
        ['Последовательность и вложенное', 'Commitment & sunk cost', 'Кто уже вывел 1 RBX и собрал серию дней, тот не бросает. Каждый следующий порог — продолжение начатого пути.', 'Пороги 5 → 25 → 100'],
        ['Эффект владения', 'Endowment / IKEA effect', 'Свой персонаж и свои лезвия ценятся выше. Кастомизация привязывает игрока к аккаунту.', 'Магазин и герои'],
        ['Предложение ×2', 'Framing', 'Награда уже «в руках», и ещё одна реклама удваивает её. Отказаться трудно, а игрок ничего не теряет.', 'Алмазы, бонусы, конец игры'],
        ['Мгновенный отклик', 'Immediate reward', 'Брызги, звук и «+0.01» после каждого разреза: мозг получает награду в ту же секунду.', 'Каждый свайп']
      ]
    },
    lines: {
      eyebrow: 'Белая зона', title: 'Чего мы принципиально не делаем',
      items: [
        ['Без ставок и платной случайности', 'Игрок никогда не платит за шанс. Все случайные награды бесплатные, поэтому это не азартная игра.'],
        ['Только реальные выплаты в ленте', 'Ленту выводов и лидеров наполняют настоящие игроки. Выдуманные отзывы нарушают законы о защите потребителей и ведут к бану в App Store и Google Play.'],
        ['Честные пороги', 'Вся лестница выводов видна с первого дня, условия не меняются задним числом.'],
        ['Безопасность детей', 'Дневные лимиты рекламы, возрастные настройки рекламных сетей, без персонализированной рекламы для детей.']
      ],
      note: 'В прототипе лента выводов и таблица лидеров заполнены примерами.'
    },
    money: {
      eyebrow: 'Монетизация', title: 'ГДЕ ТУТ БАБОСИК',
      lead: 'Вся игра — это воронка к рекламе, которую игрок смотрит добровольно, потому что каждый раз получает награду. Мы зарабатываем на каждом шаге его пути к выводу.',
      streams: [
        ['Рекламные коробки', 'Rewarded video — самый дорогой формат мобильной рекламы. Каждая разрезанная коробка — оплаченный показ.'],
        ['Алмазы за рекламу', 'Кнопка «+» и предложение ×2: игрок сам приходит за рекламой, чтобы купить скин.'],
        ['Ежедневные награды ×2', 'Каждый вход в игру — ещё один просмотр за удвоенный бонус.'],
        ['Конец игры ×2', 'Удвоить заработанное за игру — самый горячий момент для рекламы.']
      ],
      win: [['Игрок', 'Больше RBX и скинов, никакого проигрыша из-за коробки'], ['Рекламодатель', 'Вовлечённая аудитория, которая сама выбрала просмотр'], ['Мы', 'Доход с каждого показа']],
      calc: {
        title: 'Калькулятор юнит-экономики',
        note: 'Все значения — допущения для обсуждения. Измените их под свои данные, и результат пересчитается сразу.',
        dau: 'Игроков в день (DAU)', boxes: 'Коробок на игрока в день', extra: 'Других просмотров на игрока в день (алмазы, ×2, бонусы)', ecpm: 'eCPM rewarded-рекламы, $',
        rbxAd: 'RBX за одну коробку', rbxFruit: 'RBX с фруктов на игрока в день', share: 'Доля RBX, которую реально выводят, %', cost: 'Наша цена 1 RBX, $',
        views: 'Рекламных просмотров', rev: 'Доход с рекламы', payout: 'Расходы на выплаты RBX', profit: 'Прибыль', day: 'в день', month: 'за 30 дней', margin: 'Маржа'
      }
    },
    meta: {
      eyebrow: 'Вокруг механики', title: 'Полноценная игра, а не одна механика',
      items: [
        ['Магазин лезвий', 'Классическое, неоновое, огненное, радужное и золотое лезвие меняют след от свайпа. Цена — в алмазах.'],
        ['Герои с бонусами', 'Нуб, Ниндзя (+1 жизнь), Робот (комбо ×2), Котик (коробки чаще) и Золотой нуб (+2 алмаза из коробки).'],
        ['Ежедневные награды', '7-дневная серия с большим призом на 7-й день и кнопкой «Забрать ×2» за рекламу.'],
        ['Таблица лидеров', 'Недельный рейтинг по количеству разрезанных фруктов. Топ-3 получают алмазы.'],
        ['Лента выводов', 'Бегущая строка в меню: кто и сколько только что вывел. Самое сильное доказательство, что игра платит.'],
        ['Уведомление о выплате', 'После вывода на телефон приходит сообщение: «Подарок получен! 1 RBX на ваш аккаунт».']
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
    foot: 'Cube Slicer — концепт и прототип. Не связано с Roblox Corporation. В прототипе вывод, реклама, лента выводов и лидеры имитируются.',
    g: {
      play: 'ИГРАТЬ', shop: 'Магазин', heroes: 'Герои', road: 'Роадмап', fruits: 'Фрукты', daily: 'Бонусы', top: 'Лидеры',
      toW: 'до вывода', withdraw: 'Вывести', ready: 'Можно выводить!', back: 'Назад',
      over: 'Игра окончена', again: 'Ещё раз', menu: 'Меню', sliced: 'Разрезано', earned: 'Заработано', combo: 'Лучшее комбо',
      left: n => 'До вывода осталось ' + n + ' RBX', x2game: 'Удвоить · реклама', x2done: 'Заработанное удвоено!',
      adLabel: 'РЕКЛАМА', adWait: n => 'Награда через ' + n + ' с', adGot: 'Награда зачислена', adGame: 'BLOCK RACERS', adCta: 'Установи бесплатно', adSub: 'Гонки на кубических тачках',
      gemsTitle: 'Бесплатные алмазы', gemsText: 'Посмотри короткую рекламу и получи 5 алмазов.', gemsBtn: 'Смотреть рекламу',
      doubleTitle: 'Удвоить?', doubleText: n => 'Ещё одна реклама — и ещё +' + n + ' алмазов.', doubleYes: 'Да, ×2', doubleNo: 'Нет, спасибо',
      noGems: 'Не хватает алмазов. Нажми «+» у баланса',
      wTitle: 'Вывод RBX', wNick: 'Аккаунт Roblox', wSend: n => 'Вывести ' + n + ' RBX', wCheck: 'Проверяем аккаунт…', wSending: 'Отправляем RBX…',
      wOk: (n, nick) => n + ' RBX отправлено на ' + nick, wDemo: 'В прототипе вывод имитируется', wNext: n => 'Следующая цель: ' + n + ' RBX', wClose: 'Отлично',
      wErr: 'Ник: 3–20 символов, латиница, цифры или _', wNeed: n => 'Нужно ещё ' + n + ' RBX',
      notifNow: 'сейчас', notifTitle: 'Подарок получен!', notifText: (n, nick) => n + ' RBX зачислено на аккаунт ' + nick + '. Спасибо, что играешь!',
      roadText: 'После каждого вывода баланс обнуляется, а следующая цель выше.', done: 'Выведено', current: 'Сейчас', locked: 'Дальше',
      blades: 'Лезвия', owned: 'Выбрать', equipped: 'Выбрано', bought: 'Куплено!',
      dailyText: 'Заходи каждый день: на 7-й день — большая награда. Пропустишь день — серия начнётся сначала.', day: n => 'День ' + n,
      claim: 'Забрать', claimX2: 'Забрать ×2 · реклама', claimed: 'Уже забрано. Возвращайся завтра!', streakLost: 'Серия прервана — начинаем с 1-го дня',
      topText: 'Недельный рейтинг по разрезанным фруктам. Топ-3 получают по 50 алмазов.', you: 'Ты', place: n => 'Твоё место: ' + n, score: 'фруктов', resetIn: 'Сброс через 3 дн. 4 ч',
      feed: (nick, n, m) => nick + ' вывел ' + n + ' RBX · ' + m + ' мин назад', feedYou: n => 'Ты вывел ' + n + ' RBX · только что',
      welTitle: 'Добро пожаловать в Cube Slicer!', welText: 'Держи стартовый подарок, чтобы быстрее дойти до первого вывода.', welBtn: 'Забрать подарок',
      comboTxt: n => 'КОМБО ×' + n, pause: 'Пауза', resume: 'Продолжить', exitGame: 'Выйти в меню', paused: 'Пауза',
      bladeNames: { classic: 'Классическое', neon: 'Неон', fire: 'Огонь', rainbow: 'Радуга', gold: 'Золотое' },
      charNames: { noob: 'Нуб', ninja: 'Ниндзя', robot: 'Робот', cat: 'Котик', goldnoob: 'Золотой нуб' },
      perks: { noob: 'Без бонуса', ninja: '+1 жизнь', robot: 'Комбо-бонус ×2', cat: 'Коробки вылетают чаще', goldnoob: '+2 алмаза из коробки' },
      fruitNames: { apple: 'Яблоко', orange: 'Апельсин', banana: 'Банан', grape: 'Виноград', melon: 'Арбуз', pineapple: 'Ананас', golden: 'Золотое яблоко', adbox: 'Рекламная коробка' },
      rar: { often: 'Часто', normal: 'Средне', rare: 'Редко', epic: 'Очень редко', legend: 'Легенда', surprise: 'Сюрприз' },
      fruitsHint: 'Режь дорогие фрукты и не пропускай коробки!'
    }
  },
  en: {
    nav: { how: 'How it works', road: 'Roadmap', gems: 'Diamonds', hooks: 'Psychology', money: 'Where’s the money', meta: 'Meta game' },
    hero: {
      eyebrow: 'Mobile game concept · interactive prototype', by: 'Prepared by VELDAN',
      title: ['Slice blocky fruit —', 'earn RBX'],
      lead: 'Fruit Ninja gameplay in a blocky Roblox style. Every sliced fruit earns tiny bits of RBX, and once a player reaches the threshold they withdraw it to their own Roblox account.',
      genre: 'Genre', genreName: 'Play-to-Earn · arcade · hyper-casual',
      genreText: 'Play-to-Earn (P2E) games reward players with real value for their time in the game. We combine P2E with a simple one-finger arcade that is fun from the very first second.',
      chips: ['From 0.01 RBX per fruit', 'First withdrawal at 1 RBX', 'An ad box instead of the bomb', 'Diamonds come only from ads'],
      hint: 'Play right here: press “Play”, then drag across the fruit with your mouse button held down or with your finger.',
      full: 'Full screen', exit: 'Exit full screen',
      demo: 'Presenter controls', add: '+0.50 RBX', gems: '+20 diamonds', callAd: 'Ad box', nextDay: 'Next day', reset: 'Reset progress'
    },
    how: {
      eyebrow: 'Core loop', title: 'How it works',
      steps: [
        ['Slice fruit', 'Swipe across the screen, just like Fruit Ninja. The fruit is blocky, Roblox-style, and flies at different speeds.'],
        ['Earn RBX cents', 'Each fruit gives 0.01 to 0.10 RBX. Slicing three or more in one swipe gives a combo bonus.'],
        ['Follow the roadmap', 'The bar at the top shows how much is left until the next withdrawal, every second of play.'],
        ['Withdraw to Roblox', 'Hit the threshold, press “Withdraw” and a gift notification from the game lands on the phone.']
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
      cols: ['Fruit', 'RBX', 'Diamonds', 'How often']
    },
    ad: {
      eyebrow: 'The key twist', title: 'An ad box instead of the bomb',
      text: 'In the original, slicing a bomb ends the game. We replace it with an ad box. It flies in just as unexpectedly, the player slices it on reflex and gets 0.25 RBX (25 times more than an apple) plus 3 diamonds. In return they watch a 5-second ad. The player is happy, and we earn revenue.',
      bomb: 'Bomb in the original', bombText: 'Slice it and you lose. The player gets annoyed.',
      box: 'Box in Cube Slicer', boxText: 'Slice it: +0.25 RBX, +3 diamonds and a 5-second ad. The player is delighted.',
      points: ['No penalty: the box can be skipped', 'The reward is instant', 'Rewarded video format: the player chooses to watch']
    },
    gems: {
      eyebrow: 'Second currency', title: 'Diamonds come only from ads',
      text: 'Players withdraw RBX and buy skins with diamonds. Diamonds are never sold for money: only ads give them. So every skin in the shop equals several ad views that the player agrees to on their own.',
      flow: [
        ['Sliced an ad box', '+0.25 RBX and +3 diamonds after a 5-second ad'],
        ['“+” next to the balance', 'Watch an ad → +5 diamonds'],
        ['“Double it?”', 'One more ad → another +5. The reward is already “in hand”, so almost everyone says yes'],
        ['Shop', 'A skin for 10–150 diamonds = 2 to 30 ad views']
      ]
    },
    hooks: {
      eyebrow: 'Retention psychology', title: 'The hooks that keep players playing',
      lead: 'We use the same motivation mechanics as casinos and the most successful mobile games, but in a white-hat form: no bets and no risk. Players never lose money, they only receive.',
      source: 'Based on B. F. Skinner’s variable reinforcement, Natasha Dow Schüll’s research on slot machines (“Addiction by Design”, 2012), Nir Eyal’s Hook model (“Hooked”, 2014) and Robert Cialdini’s principles of influence (“Influence”).',
      loopTitle: 'The habit loop (Hook model)',
      loop: [['Trigger', 'Daily reward, payout notification, withdrawals feed'], ['Action', 'One swipe and +0.01 RBX is already flying'], ['Variable reward', 'An ad box or a golden apple can appear at any second'], ['Investment', 'Daily streak, skins, progress to the next withdrawal']],
      how: 'How it works', where: 'In the game',
      items: [
        ['An easy first win', 'Foot-in-the-door', 'A small “yes” opens the door to a bigger one. The first goal is just 1 RBX: players withdraw their first coin in 10–15 minutes and start trusting the game.', 'First roadmap threshold'],
        ['Goal-gradient effect', 'Goal-gradient effect', 'The closer the goal, the harder people push toward it (Kivetz, 2006). The progress bar is always in sight.', 'The “0.87 / 1 RBX” bar on top'],
        ['Endowed progress', 'Endowed progress', 'A bar that is already partly filled motivates more than an empty one (Nunes & Drèze, 2006). New players get a 0.10 RBX head start.', 'Welcome gift'],
        ['Variable reinforcement', 'Variable-ratio reinforcement', 'Unexpected rewards hold attention better than predictable ones. Slot machines run on this. Ours is free: nobody bets anything.', 'Ad boxes, golden apple, combos'],
        ['Reciprocity', 'Reciprocity', 'People like to return a favour. The box gives RBX and diamonds first, so the ad feels like a fair exchange.', 'Ad box'],
        ['Loss aversion', 'Loss aversion', 'Losses feel about twice as strong as equal gains (Kahneman & Tversky). Miss a day and the daily streak is gone.', '7-day reward streak'],
        ['Social proof', 'Social proof', 'People trust what others do. The live withdrawals feed and the leaderboard show the game really pays.', 'Feed in the menu, weekly top'],
        ['Unfinished-task effect', 'Zeigarnik effect', 'Unfinished business sticks in the mind. After a loss we show “0.12 RBX to your withdrawal”, and the player taps “Play again”.', 'Game over screen'],
        ['Commitment and sunk cost', 'Commitment & sunk cost', 'Someone who has already withdrawn 1 RBX and built a streak doesn’t quit. Each next threshold continues a path already started.', 'Thresholds 5 → 25 → 100'],
        ['Ownership effect', 'Endowment / IKEA effect', 'Your own character and blades feel more valuable. Customization ties the player to the account.', 'Shop and heroes'],
        ['The ×2 offer', 'Framing', 'The reward is already “in hand”, and one more ad doubles it. It’s hard to say no, and the player loses nothing.', 'Diamonds, daily bonus, game over'],
        ['Instant feedback', 'Immediate reward', 'Juice, sound and “+0.01” after every slice: the brain gets its reward in the same moment.', 'Every swipe']
      ]
    },
    lines: {
      eyebrow: 'White-hat zone', title: 'What we never do',
      items: [
        ['No bets, no paid randomness', 'Players never pay for a chance. All random rewards are free, so this is not gambling.'],
        ['Only real payouts in the feed', 'The withdrawals feed and leaderboard are filled by real players. Fake reviews break consumer protection laws and lead to bans from the App Store and Google Play.'],
        ['Honest thresholds', 'The whole withdrawal ladder is visible from day one, and rules never change retroactively.'],
        ['Child safety', 'Daily ad limits, age settings in ad networks, no personalized ads for children.']
      ],
      note: 'In the prototype the withdrawals feed and leaderboard are filled with examples.'
    },
    money: {
      eyebrow: 'Monetization', title: 'WHERE’S THE MONEY',
      lead: 'The whole game is a funnel to ads that players watch voluntarily, because every view gives them a reward. We earn at every step of their path to a withdrawal.',
      streams: [
        ['Ad boxes', 'Rewarded video is the highest-paying mobile ad format. Every sliced box is a paid impression.'],
        ['Diamonds for ads', 'The “+” button and the ×2 offer: players come for ads on their own to buy skins.'],
        ['Daily rewards ×2', 'Every login is one more view for a doubled bonus.'],
        ['Game over ×2', 'Doubling the run’s earnings is the hottest moment for an ad.']
      ],
      win: [['Player', 'More RBX and skins, and the box never costs them the game'], ['Advertiser', 'An engaged audience that chose to watch'], ['Us', 'Revenue from every impression']],
      calc: {
        title: 'Unit economics calculator',
        note: 'All values are assumptions for discussion. Change them to your own numbers and the result updates instantly.',
        dau: 'Daily active players (DAU)', boxes: 'Ad boxes per player per day', extra: 'Other ad views per player per day (diamonds, ×2, bonuses)', ecpm: 'Rewarded video eCPM, $',
        rbxAd: 'RBX per ad box', rbxFruit: 'RBX from fruit per player per day', share: 'Share of RBX actually withdrawn, %', cost: 'Our cost of 1 RBX, $',
        views: 'Ad views', rev: 'Ad revenue', payout: 'RBX payout cost', profit: 'Profit', day: 'per day', month: 'per 30 days', margin: 'Margin'
      }
    },
    meta: {
      eyebrow: 'Around the core', title: 'A full game, not a single mechanic',
      items: [
        ['Blade shop', 'Classic, neon, fire, rainbow and gold blades change the swipe trail. Prices are in diamonds.'],
        ['Heroes with perks', 'Noob, Ninja (+1 life), Robot (combo ×2), Cat (more ad boxes) and Golden Noob (+2 diamonds per box).'],
        ['Daily rewards', 'A 7-day streak with a big prize on day 7 and a “Claim ×2” button for an ad.'],
        ['Leaderboard', 'A weekly ranking by fruit sliced. The top 3 win diamonds.'],
        ['Withdrawals feed', 'A ticker in the menu: who just withdrew and how much. The strongest proof that the game pays.'],
        ['Payout notification', 'After a withdrawal the phone shows a message: “Gift received! 1 RBX added to your account”.']
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
    foot: 'Cube Slicer is a concept and prototype. Not affiliated with Roblox Corporation. Withdrawals, ads, the withdrawals feed and the leaderboard are simulated in the prototype.',
    g: {
      play: 'PLAY', shop: 'Shop', heroes: 'Heroes', road: 'Roadmap', fruits: 'Fruits', daily: 'Daily', top: 'Top',
      toW: 'to withdrawal', withdraw: 'Withdraw', ready: 'Ready to withdraw!', back: 'Back',
      over: 'Game over', again: 'Play again', menu: 'Menu', sliced: 'Sliced', earned: 'Earned', combo: 'Best combo',
      left: n => n + ' RBX to your withdrawal', x2game: 'Double it · ad', x2done: 'Earnings doubled!',
      adLabel: 'AD', adWait: n => 'Reward in ' + n + ' s', adGot: 'Reward added', adGame: 'BLOCK RACERS', adCta: 'Install for free', adSub: 'Racing in blocky cars',
      gemsTitle: 'Free diamonds', gemsText: 'Watch a short ad and get 5 diamonds.', gemsBtn: 'Watch ad',
      doubleTitle: 'Double it?', doubleText: n => 'One more ad for another +' + n + ' diamonds.', doubleYes: 'Yes, ×2', doubleNo: 'No, thanks',
      noGems: 'Not enough diamonds. Tap “+” next to your balance',
      wTitle: 'Withdraw RBX', wNick: 'Roblox account', wSend: n => 'Withdraw ' + n + ' RBX', wCheck: 'Checking account…', wSending: 'Sending RBX…',
      wOk: (n, nick) => n + ' RBX sent to ' + nick, wDemo: 'Withdrawals are simulated in the prototype', wNext: n => 'Next goal: ' + n + ' RBX', wClose: 'Awesome',
      wErr: 'Username: 3–20 characters, letters, digits or _', wNeed: n => n + ' RBX to go',
      notifNow: 'now', notifTitle: 'Gift received!', notifText: (n, nick) => n + ' RBX added to ' + nick + '. Thanks for playing!',
      roadText: 'After each withdrawal the balance resets and the next goal is higher.', done: 'Withdrawn', current: 'Now', locked: 'Next',
      blades: 'Blades', owned: 'Equip', equipped: 'Equipped', bought: 'Purchased!',
      dailyText: 'Come back every day: day 7 brings a big prize. Miss a day and the streak starts over.', day: n => 'Day ' + n,
      claim: 'Claim', claimX2: 'Claim ×2 · ad', claimed: 'Already claimed. Come back tomorrow!', streakLost: 'Streak broken — starting again from day 1',
      topText: 'Weekly ranking by fruit sliced. The top 3 get 50 diamonds each.', you: 'You', place: n => 'Your rank: ' + n, score: 'fruit', resetIn: 'Resets in 3 d 4 h',
      feed: (nick, n, m) => nick + ' withdrew ' + n + ' RBX · ' + m + ' min ago', feedYou: n => 'You withdrew ' + n + ' RBX · just now',
      welTitle: 'Welcome to Cube Slicer!', welText: 'Here’s a starter gift to get you to your first withdrawal faster.', welBtn: 'Claim gift',
      comboTxt: n => 'COMBO ×' + n, pause: 'Pause', resume: 'Resume', exitGame: 'Back to menu', paused: 'Paused',
      bladeNames: { classic: 'Classic', neon: 'Neon', fire: 'Fire', rainbow: 'Rainbow', gold: 'Gold' },
      charNames: { noob: 'Noob', ninja: 'Ninja', robot: 'Robot', cat: 'Cat', goldnoob: 'Golden Noob' },
      perks: { noob: 'No perk', ninja: '+1 life', robot: 'Combo bonus ×2', cat: 'Ad boxes appear more often', goldnoob: '+2 diamonds per box' },
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
  let adRate = 1, lives = 3, flash = 0, combo = 0, comboT = 0, down = false, adPending = -1, bigText = null;
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
      if (adCd <= 0 && !objs.some(o => o.f.ad) && Math.random() < 0.32 * adRate) { launch(ADBOX); adCd = (14 + Math.random() * 10) / adRate; }
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
      lives = opts.lives; adRate = opts.adRate || 1; blade = BLADES.find(b => b.id === opts.blade) || BLADES[0];
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
function Gem({ size = 16 }) {
  return (
    <svg className="gem" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h12l4 6-10 13L2 9Z" fill="#45d8ff" stroke="#15172e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 9h20M8 3l4 6 4-6M12 9v13" fill="none" stroke="#15172e" strokeWidth="1.4" strokeLinejoin="round" opacity=".55" />
      <path d="M6 3 8 9 2 9Z" fill="#b5f2ff" />
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
function GemPill({ gems, onPlus, label }) {
  return (
    <span className="g-pill g-gempill">
      <Gem /> {gems}
      <button type="button" className="g-plus" onClick={onPlus} aria-label={label}>+</button>
    </span>
  );
}
function Reward({ r, size = 16 }) {
  return (
    <span className="g-reward">
      {r.c ? <span><Coin size={size} /> +{rbx(r.c)}</span> : null}
      {r.d ? <span><Gem size={size} /> +{r.d}</span> : null}
    </span>
  );
}
function Ticker({ t, save }) {
  const items = [...save.mine.map(n => t.feedYou(n)), ...FEED.map(([n, a, m]) => t.feed(n, a, m))];
  const row = items.map((x, i) => <span key={i} className={i < save.mine.length ? 'mine' : ''}><Coin size={13} /> {x}</span>);
  return (
    <div className="g-ticker" aria-label="feed">
      <div className="g-ticker-track">{row}{row}</div>
    </div>
  );
}

/* ============================== PHONE SCREENS ============================== */
function MenuScreen({ t, save, go, openWithdraw, onGems }) {
  const goal = target(save.tier) * 100;
  const ds = dailyState(save);
  const tiles = [['shop', t.shop, 'g-ico-shop'], ['chars', t.heroes, 'g-ico-char'], ['road', t.road, 'g-ico-road'], ['fruits', t.fruits, 'g-ico-fruit'], ['daily', t.daily, 'g-ico-daily'], ['top', t.top, 'g-ico-top']];
  return (
    <div className="g-screen g-menu">
      <div className="g-top">
        <GemPill gems={save.gems} onPlus={onGems} label={t.gemsTitle} />
        <span className="g-pill"><Coin size={16} /> {rbx(save.balanceC)}</span>
      </div>
      <div className="g-logo"><span>CUBE</span><span>SLICER</span></div>
      <Ticker t={t} save={save} />
      <div className="g-hero">
        <div className="g-podium"><Avatar id={save.char} size={58} /></div>
        <div className="g-fruit-orbit">
          <img src={spriteURL(FRUITS[0])} alt="" /><img src={spriteURL(FRUITS[4])} alt="" /><img src={spriteURL(ADBOX)} alt="" />
        </div>
      </div>
      <button type="button" className="g-btn g-play" onClick={() => go('game')}>{t.play}</button>
      <div className="g-grid">
        {tiles.map(([k, label, ico]) => (
          <button key={k} type="button" className="g-btn g-tile" onClick={() => go(k)}>
            <span className={'g-ico ' + ico} />{label}
            {k === 'daily' && ds.can && <i className="g-dot" />}
          </button>
        ))}
      </div>
      <div className="g-menu-bar"><Bar value={save.balanceC} max={target(save.tier)} ready={save.balanceC >= goal} t={t} onClick={() => (save.balanceC >= goal ? openWithdraw() : go('road'))} /></div>
    </div>
  );
}

function Header({ title, onBack, t, save, onGems }) {
  return (
    <div className="g-head">
      <button type="button" className="g-btn g-back" onClick={onBack} aria-label={t.back}>‹</button>
      <h3>{title}</h3>
      <GemPill gems={save.gems} onPlus={onGems} label={t.gemsTitle} />
    </div>
  );
}

function RoadScreen({ t, save, back, openWithdraw, onGems }) {
  const goal = target(save.tier);
  const ready = save.balanceC >= goal * 100;
  return (
    <div className="g-screen g-list">
      <Header title={t.road} onBack={back} t={t} save={save} onGems={onGems} />
      <p className="g-note">{t.roadText}</p>
      <ol className="g-road">
        {TIERS.map((v, i) => {
          const st = i < save.tier ? 'done' : i === Math.min(save.tier, TIERS.length - 1) ? 'cur' : 'lock';
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
      <button type="button" className="g-btn g-play g-small" disabled={!ready} onClick={() => openWithdraw()}>{ready ? t.withdraw + ' ' + goal + ' RBX' : t.wNeed(rbx(goal * 100 - save.balanceC))}</button>
    </div>
  );
}

function FruitsScreen({ t, save, back, onGems }) {
  return (
    <div className="g-screen g-list">
      <Header title={t.fruits} onBack={back} t={t} save={save} onGems={onGems} />
      <p className="g-note">{t.fruitsHint}</p>
      <ul className="g-fruits">
        {ALL_ITEMS.map(f => (
          <li key={f.id} className={f.ad ? 'is-ad' : ''}>
            <img src={spriteURL(f)} alt="" />
            <span className="g-fn"><b>{t.fruitNames[f.id]}</b><small>{t.rar[f.rar]}</small></span>
            <Reward r={{ c: f.c, d: f.d }} size={14} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShopScreen({ t, save, setSave, back, initialTab, toast, onGems }) {
  const [tab, setTab] = useState(initialTab || 'blades');
  const list = tab === 'blades' ? BLADES : CHARS;
  const ownedKey = tab === 'blades' ? 'blades' : 'chars';
  const curKey = tab === 'blades' ? 'blade' : 'char';
  function act(item) {
    if (save[ownedKey].includes(item.id)) { setSave(s => ({ ...s, [curKey]: item.id })); return; }
    if (save.gems < item.price) { toast(t.noGems); return; }
    setSave(s => ({ ...s, gems: s.gems - item.price, [ownedKey]: [...s[ownedKey], item.id], [curKey]: item.id }));
    toast(t.bought);
  }
  return (
    <div className="g-screen g-list">
      <Header title={tab === 'blades' ? t.shop : t.heroes} onBack={back} t={t} save={save} onGems={onGems} />
      <div className="g-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'blades'} onClick={() => setTab('blades')}>{t.blades}</button>
        <button type="button" role="tab" aria-selected={tab === 'chars'} onClick={() => setTab('chars')}>{t.heroes}</button>
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
              <button type="button" className={'g-btn g-buy' + (eq ? ' on' : '')} onClick={() => act(item)}>
                {eq ? t.equipped : owned ? t.owned : <><Gem size={13} /> {item.price}</>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DailyScreen({ t, save, setSave, back, showAd, toast, onGems }) {
  const ds = dailyState(save);
  const r = DAILY[ds.idx];
  function claim(x2) {
    const add = s => ({ ...s, balanceC: s.balanceC + (r.c || 0), gems: s.gems + (r.d || 0) });
    setSave(s => ({ ...add(s), dayIdx: ds.idx, lastClaim: dayKey(s.dayOffset) }));
    if (x2) showAd({ c: r.c, d: r.d });
  }
  return (
    <div className="g-screen g-list">
      <Header title={t.daily} onBack={back} t={t} save={save} onGems={onGems} />
      <p className="g-note">{t.dailyText}</p>
      {ds.lost && <p className="g-warn">{t.streakLost}</p>}
      <ol className="g-days">
        {DAILY.map((d, i) => {
          const st = ds.claimedToday ? (i <= ds.idx ? 'got' : 'lock') : i < ds.idx ? 'got' : i === ds.idx ? 'now' : 'lock';
          return (
            <li key={i} className={'g-day ' + st + (i === 6 ? ' big' : '')}>
              <span className="g-day-n">{t.day(i + 1)}</span>
              <Reward r={d} size={14} />
              {st === 'got' && <span className="g-day-ok">✓</span>}
            </li>
          );
        })}
      </ol>
      <div className="g-actions">
        {ds.can ? (
          <>
            <button type="button" className="g-btn g-play g-small" onClick={() => claim(true)}>{t.claimX2}</button>
            <button type="button" className="g-btn g-ghost" onClick={() => { claim(false); toast(t.adGot); }}>{t.claim}</button>
          </>
        ) : <p className="g-note g-center">{t.claimed}</p>}
      </div>
    </div>
  );
}

function TopScreen({ t, save, back, onGems }) {
  const rows = [...BOTS.map(([n, s]) => ({ n, s })), { n: save.nick, s: save.week, me: true }].sort((a, b) => b.s - a.s);
  return (
    <div className="g-screen g-list">
      <Header title={t.top} onBack={back} t={t} save={save} onGems={onGems} />
      <p className="g-note">{t.topText}<br /><b>{t.resetIn}</b> · <b>{t.place(rows.findIndex(r => r.me) + 1)}</b></p>
      <ol className="g-top-list">
        {rows.map((r, i) => (
          <li key={r.n + i} className={(r.me ? 'me ' : '') + (i < 3 ? 'p' + (i + 1) : '')}>
            <span className="g-rank">{i + 1}</span>
            <span className="g-ava" style={{ background: ['#ff4545', '#2b6fff', '#2fc15a', '#ffc928', '#8f52f2', '#ff9c3a'][r.n.length % 6] }} />
            <span className="g-fn"><b>{r.me ? t.you + ' · ' + r.n : r.n}</b></span>
            <span className="g-score">{r.s} <small>{t.score}</small></span>
            {i < 3 && <span className="g-prize"><Gem size={12} />50</span>}
          </li>
        ))}
      </ol>
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
        if (!f.ad) {
          setSave(s => ({ ...s, balanceC: s.balanceC + f.c, week: s.week + 1 }));
          setSession(s => ({ ...s, c: s.c + f.c, n: s.n + 1 }));
        } else setSession(s => ({ ...s, c: s.c + f.c }));
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
      onAdBox() { onAd({ c: ADBOX.c, d: ADBOX.d + (saveRef.current.char === 'goldnoob' ? 2 : 0) }); },
      onOver() { onOver(sessRef.current); }
    });
    engRef.current = eng;
    engineApi.current = eng;
    eng.start({ lives: startLives, blade: saveRef.current.blade, adRate: saveRef.current.char === 'cat' ? 1.7 : 1 });
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
          <span className="g-pill"><Gem size={14} /> {save.gems}</span>
          <button type="button" className="g-btn g-pause" onClick={() => setPaused(true)} aria-label={t.pause}>II</button>
        </div>
      </div>
      {paused && !overlayOpen && (
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

function OverScreen({ t, stats, save, go, showAd }) {
  const [doubled, setDoubled] = useState(false);
  const goal = target(save.tier) * 100;
  const left = Math.max(0, goal - save.balanceC);
  return (
    <div className="g-screen g-menu g-over">
      <div className="g-logo g-logo-sm"><span>{t.over}</span></div>
      <div className="g-card g-stats">
        <div><span>{t.earned}</span><b><Coin size={18} /> {rbx(stats.c * (doubled ? 2 : 1))} RBX</b></div>
        <div><span>{t.sliced}</span><b>{stats.n}</b></div>
        <div><span>{t.combo}</span><b>{stats.best ? '×' + stats.best : '—'}</b></div>
      </div>
      {left > 0 && <p className="g-left">{t.left(rbx(left))}</p>}
      {stats.c > 0 && !doubled && (
        <button type="button" className="g-btn g-x2" onClick={() => showAd({ c: stats.c }, () => setDoubled(true))}>×2 · {t.x2game}</button>
      )}
      {doubled && <p className="g-left ok">{t.x2done}</p>}
      <button type="button" className="g-btn g-play" onClick={() => go('game')}>{t.again}</button>
      <button type="button" className="g-btn g-ghost" onClick={() => go('menu')}>{t.menu}</button>
    </div>
  );
}

function AdOverlay({ t, reward, onDone }) {
  const DUR = 5;
  const [left, setLeft] = useState(DUR);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    let raf, to;
    const tick = now => {
      const l = Math.max(0, DUR - (now - start) / 1000);
      setLeft(l);
      if (l > 0) raf = requestAnimationFrame(tick);
      else { setDone(true); to = setTimeout(onDone, 1100); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(to); };
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
      {done && <div className="g-ad-reward"><Reward r={reward} size={30} /><b>{t.adGot}</b></div>}
    </div>
  );
}

function WithdrawModal({ t, save, setSave, onClose, onSent }) {
  const [amount] = useState(() => target(save.tier));
  const [nick, setNick] = useState(save.nick || '');
  const [err, setErr] = useState('');
  const [stage, setStage] = useState('form');
  function submit(e) {
    e.preventDefault();
    const n = nick.trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(n)) { setErr(t.wErr); return; }
    setErr(''); setStage('check');
    setTimeout(() => setStage('send'), 1000);
    setTimeout(() => {
      setStage('ok');
      setSave(s => ({ ...s, balanceC: 0, tier: s.tier + 1, withdrawnC: s.withdrawnC + amount * 100, nick: n, mine: [amount, ...s.mine].slice(0, 5) }));
      onSent(amount, n);
    }, 2100);
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
            <div className="g-nick">
              <Avatar id={save.char} size={18} />
              <input id="wd-nick" className="g-input" value={nick} onChange={e => setNick(e.target.value)} autoComplete="off" disabled={stage !== 'form'} />
            </div>
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

function Notification({ t, data, onClose }) {
  useEffect(() => { const id = setTimeout(onClose, 6000); return () => clearTimeout(id); }, [data]);
  return (
    <button type="button" className="g-notif" onClick={onClose}>
      <span className="g-notif-ico"><img src={spriteURL(FRUITS[4])} alt="" /></span>
      <span className="g-notif-body">
        <span className="g-notif-app">CUBE SLICER · {t.notifNow}</span>
        <b>{t.notifTitle}</b>
        <span>{t.notifText(data.n, data.nick)}</span>
      </span>
    </button>
  );
}

function PhoneApp({ t, save, setSave, api }) {
  const [screen, setScreen] = useState('menu');
  const [runId, setRunId] = useState(0);
  const [stats, setStats] = useState(null);
  const [ad, setAd] = useState(null);
  const [wd, setWd] = useState(null);
  const [gemOffer, setGemOffer] = useState(null);
  const [notif, setNotif] = useState(null);
  const [msg, setMsg] = useState('');
  const engineApi = useRef(null);
  const pendingAd = useRef(false);
  const msgT = useRef(0);
  const toast = m => { setMsg(m); clearTimeout(msgT.current); msgT.current = setTimeout(() => setMsg(''), 2400); };

  const go = s => { if (s === 'game') setRunId(r => r + 1); setScreen(s); };
  const openWithdraw = after => setWd({ after: typeof after === 'function' ? after : null });
  const showAd = (reward, after) => setAd({ reward, after });
  const onGems = () => setGemOffer('ask');

  useEffect(() => {
    api.current = {
      spawnAd() {
        if (screen === 'game' && engineApi.current) engineApi.current.spawnAd();
        else { pendingAd.current = true; go('game'); }
      },
      menu() { setScreen('menu'); setAd(null); setWd(null); setGemOffer(null); setNotif(null); }
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
    const { reward, after } = ad;
    setSave(s => ({ ...s, balanceC: s.balanceC + (reward.c || 0), gems: s.gems + (reward.d || 0) }));
    setAd(null);
    if (after) after();
  }
  const back = () => setScreen('menu');
  const common = { t, save, onGems };
  return (
    <div className="g-app">
      {screen === 'menu' && <MenuScreen {...common} go={go} openWithdraw={openWithdraw} />}
      {screen === 'game' && (
        <GameScreen key={runId} t={t} save={save} setSave={setSave} engineApi={engineApi}
          openWithdraw={openWithdraw} onAd={reward => showAd(reward)} overlayOpen={!!ad || !!wd}
          onOver={(s, quit) => { setSave(v => ({ ...v, best: Math.max(v.best, s.n) })); if (quit) setScreen('menu'); else { setStats(s); setScreen('over'); } }} />
      )}
      {screen === 'over' && stats && <OverScreen t={t} stats={stats} save={save} go={go} showAd={showAd} />}
      {screen === 'road' && <RoadScreen {...common} back={back} openWithdraw={openWithdraw} />}
      {screen === 'fruits' && <FruitsScreen {...common} back={back} />}
      {screen === 'daily' && <DailyScreen {...common} setSave={setSave} back={back} showAd={showAd} toast={toast} />}
      {screen === 'top' && <TopScreen {...common} back={back} />}
      {(screen === 'shop' || screen === 'chars') && <ShopScreen key={screen} {...common} setSave={setSave} back={back} initialTab={screen === 'chars' ? 'chars' : 'blades'} toast={toast} />}
      {screen === 'menu' && !save.welcomed && !ad && (
        <div className="g-modal">
          <div className="g-card g-welcome">
            <div className="g-burst"><img src={spriteURL(FRUITS[6])} alt="" width="76" height="76" /></div>
            <h3>{t.welTitle}</h3>
            <p className="g-note g-center">{t.welText}</p>
            <Reward r={{ c: 10, d: 5 }} size={22} />
            <button type="button" className="g-btn g-play g-small" onClick={() => setSave(s => ({ ...s, welcomed: true, balanceC: s.balanceC + 10, gems: s.gems + 5 }))}>{t.welBtn}</button>
          </div>
        </div>
      )}
      {gemOffer && !ad && (
        <div className="g-modal">
          <div className="g-card">
            <div className="g-burst"><Gem size={56} /></div>
            <h3>{gemOffer === 'ask' ? t.gemsTitle : t.doubleTitle}</h3>
            <p className="g-note g-center">{gemOffer === 'ask' ? t.gemsText : t.doubleText(5)}</p>
            <button type="button" className="g-btn g-play g-small" onClick={() => showAd({ d: 5 }, () => setGemOffer(gemOffer === 'ask' ? 'double' : null))}>{gemOffer === 'ask' ? t.gemsBtn : t.doubleYes}</button>
            <button type="button" className="g-btn g-ghost" onClick={() => setGemOffer(null)}>{gemOffer === 'ask' ? t.back : t.doubleNo}</button>
          </div>
        </div>
      )}
      {ad && <AdOverlay t={t} reward={ad.reward} onDone={adDone} />}
      {wd && <WithdrawModal t={t} save={save} setSave={setSave} onSent={(n, nick) => setTimeout(() => setNotif({ n, nick, k: Date.now() }), 700)} onClose={() => { const a = wd.after; setWd(null); if (a) a(); }} />}
      {notif && <Notification key={notif.k} t={t} data={notif} onClose={() => setNotif(null)} />}
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
            <button type="button" className="btn btn-sm" onClick={() => setSave(s => ({ ...s, gems: s.gems + 20 }))}>{T.hero.gems}</button>
            <button type="button" className="btn btn-sm" onClick={() => phoneApi.current && phoneApi.current.spawnAd()}>{T.hero.callAd}</button>
            <button type="button" className="btn btn-sm" onClick={() => setSave(s => ({ ...s, dayOffset: s.dayOffset + 1 }))}>{T.hero.nextDay}</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setSave({ ...DEFAULT_SAVE }); phoneApi.current && phoneApi.current.menu(); }}>{T.hero.reset}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== LANDING ============================== */
function SecHead({ eyebrow, title, children }) {
  return (
    <div className="sec-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function Calc({ L }) {
  const [v, setV] = useState({ dau: 10000, boxes: 4, extra: 3, ecpm: 8, rbxAd: 0.25, rbxFruit: 0.3, share: 40, cost: 0.0125 });
  const set = k => e => { const n = parseFloat(e.target.value); setV(s => ({ ...s, [k]: isNaN(n) ? 0 : n })); };
  const views = v.dau * (v.boxes + v.extra);
  const rev = views * v.ecpm / 1000;
  const rbxDay = v.dau * (v.boxes * v.rbxAd + v.rbxFruit);
  const payout = rbxDay * (v.share / 100) * v.cost;
  const profit = rev - payout;
  const margin = rev > 0 ? profit / rev : 0;
  const money = n => (n < 0 ? '−$' : '$') + Math.round(Math.abs(n)).toLocaleString('en-US');
  const fields = [['dau', 1000], ['boxes', 0.5], ['extra', 0.5], ['ecpm', 0.5], ['rbxAd', 0.05], ['rbxFruit', 0.05], ['share', 5], ['cost', 0.001]];
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
          <div className="calc-row"><span>{L.views}</span><b>{Math.round(views).toLocaleString('en-US')}</b><small>{L.day}</small></div>
          <div className="calc-row"><span>{L.rev}</span><b>{money(rev)}</b><small>{L.day}</small></div>
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
            <a href="#money" className="nav-money">{T.nav.money}</a><a href="#how">{T.nav.how}</a><a href="#roadmap">{T.nav.road}</a><a href="#gems">{T.nav.gems}</a><a href="#hooks">{T.nav.hooks}</a><a href="#meta">{T.nav.meta}</a>
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
              <div className="hero-tags"><span className="eyebrow">{T.hero.eyebrow}</span><span className="by">{T.hero.by}</span></div>
              <h1>{T.hero.title[0]} <span className="hl">{T.hero.title[1]}</span></h1>
              <p className="lead">{T.hero.lead}</p>
              <div className="genre">
                <span className="genre-k">{T.hero.genre}</span>
                <b>{T.hero.genreName}</b>
                <p>{T.hero.genreText}</p>
              </div>
              <ul className="chips">{T.hero.chips.map((c, i) => <li key={i} className={'chip c' + i}>{c}</li>)}</ul>
              <p className="hint">{T.hero.hint}</p>
            </div>
            <Stage T={T} save={save} setSave={setSave} phoneApi={phoneApi} />
          </div>
        </section>

        <section className="money" id="money">
          <div className="wrap">
            <div className="money-head">
              <span className="eyebrow">{T.money.eyebrow}</span>
              <h2 className="money-title">{T.money.title}<span className="money-coins" aria-hidden="true"><Coin size={46} /><Gem size={36} /><Coin size={28} /></span></h2>
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

        <section className="sec" id="how">
          <div className="wrap">
            <SecHead eyebrow={T.how.eyebrow} title={T.how.title} />
            <ol className="steps">
              {T.how.steps.map(([h, p], i) => (
                <li key={i} className="card step">
                  <span className="step-n">{i + 1}</span>
                  <img src={spriteURL([FRUITS[0], FRUITS[6], FRUITS[5], FRUITS[3]][i])} alt="" width="56" height="56" />
                  <h3>{h}</h3><p>{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec sec-alt" id="roadmap">
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
          <div className="wrap">
            <SecHead eyebrow={T.fruits.eyebrow} title={T.fruits.title}>{T.fruits.text}</SecHead>
            <div className="card table-wrap">
              <table className="ftable">
                <thead><tr>{T.fruits.cols.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>
                  {ALL_ITEMS.map(f => (
                    <tr key={f.id} className={f.ad ? 'is-ad' : ''}>
                      <td><span className="fcell"><img src={spriteURL(f)} alt="" width="40" height="40" />{G.fruitNames[f.id]}</span></td>
                      <td className="num"><Coin size={15} /> {rbx(f.c)}</td>
                      <td className="num">{f.d ? <><Gem size={15} /> {f.d}</> : '—'}</td>
                      <td><span className={'rar rar-' + f.rar}>{G.rar[f.rar]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="sec sec-alt" id="adbox">
          <div className="wrap ad-in">
            <div>
              <SecHead eyebrow={T.ad.eyebrow} title={T.ad.title}>{T.ad.text}</SecHead>
              <ul className="ticks">{T.ad.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="versus">
              <div className="card vs bad">
                <span className="vs-ico bomb" aria-hidden="true"><i /></span>
                <b>{T.ad.bomb}</b><p>{T.ad.bombText}</p>
              </div>
              <span className="vs-mid">VS</span>
              <div className="card vs good">
                <img src={spriteURL(ADBOX)} alt="" width="84" height="84" />
                <b>{T.ad.box}</b><p>{T.ad.boxText}</p>
                <span className="vs-reward"><Coin size={18} /> +0.25 <Gem size={18} /> +3</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="gems">
          <div className="wrap">
            <SecHead eyebrow={T.gems.eyebrow} title={T.gems.title}>{T.gems.text}</SecHead>
            <ol className="flow">
              {T.gems.flow.map(([h, p], i) => (
                <li key={i} className="card flow-step">
                  <span className="flow-ico">{i === 0 ? <img src={spriteURL(ADBOX)} alt="" width="40" height="40" /> : i === 1 ? <span className="flow-plus"><Gem size={22} />+</span> : i === 2 ? <span className="flow-x2">×2</span> : <span className="meta-blade" />}</span>
                  <b>{h}</b><p>{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec sec-hooks" id="hooks">
          <div className="wrap">
            <SecHead eyebrow={T.hooks.eyebrow} title={T.hooks.title}>{T.hooks.lead}</SecHead>
            <p className="source">{T.hooks.source}</p>
            <div className="loop">
              <h3>{T.hooks.loopTitle}</h3>
              <ol className="loop-row">
                {T.hooks.loop.map(([h, p], i) => <li key={i} className="loop-step"><span className="loop-n">{i + 1}</span><b>{h}</b><p>{p}</p></li>)}
              </ol>
              <span className="loop-back" aria-hidden="true">↺</span>
            </div>
            <div className="hooks-grid">
              {T.hooks.items.map(([name, sci, how, where], i) => (
                <article key={i} className="hook">
                  <header><span className="hook-sci">{sci}</span><h3>{name}</h3></header>
                  <p>{how}</p>
                  <span className="hook-where"><b>{T.hooks.where}:</b> {where}</span>
                </article>
              ))}
            </div>
          </div>
        </section>



        <section className="sec" id="meta">
          <div className="wrap">
            <SecHead eyebrow={T.meta.eyebrow} title={T.meta.title} />
            <div className="meta-grid">
              {T.meta.items.map(([h, p], i) => (
                <div key={i} className="card meta">
                  <span className="meta-ico">
                    {i === 0 ? <span className="meta-blade" /> : i === 1 ? <Avatar id="noob" size={26} /> : i === 2 ? <span className="meta-cal">7</span> : i === 3 ? <span className="meta-cup">1</span> : i === 4 ? <Coin size={30} /> : <span className="meta-bell" />}
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
        <section className="sec sec-lines" id="lines">
          <div className="wrap">
            <SecHead eyebrow={T.lines.eyebrow} title={T.lines.title} />
            <div className="lines-grid">
              {T.lines.items.map(([h, p], i) => <div key={i} className="line-item"><span className="line-ico" aria-hidden="true">✓</span><b>{h}</b><p>{p}</p></div>)}
            </div>
            <p className="source">{T.lines.note}</p>
          </div>
        </section>
      </main>
      <footer className="foot">
        <div className="wrap">
          <div className="foot-brand"><b>CUBE SLICER</b><span className="by">{T.hero.by}</span></div>
          <p>{T.foot}</p>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
