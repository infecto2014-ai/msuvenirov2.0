import type { GarmentInfo } from './types';

/**
 * Дополнительный контент страниц одежды: готовые варианты, цвета, характеристики, размеры, уход.
 * Цены здесь не пишем — готовые варианты считаются из src/data/pricing.ts по options и qty.
 * options — только id опций товара из pricing.ts (garment()): 'color' (white/black/other, только у футболок),
 * 'print1'…'printN' со значениями 'a6' | 'a5' | 'a4' | 'a3' | 'none' в пределах форматов и числа мест товара.
 * todo: true — значение-заглушка, владелец должен подтвердить (на сайте показывается как «уточняйте»).
 */
export const garments: GarmentInfo[] = [
  /* ── Футболка унисекс: color, print1–print3, А6–А3 ── */
  {
    slug: '/pechat-na-futbolkah',
    productId: 'tshirt-unisex',
    silhouette: 'tshirt',
    packages: [
      {
        title: 'Футболка с фото в подарок',
        note: 'белая или чёрная, фото или коллаж А4 на груди',
        qty: 1,
        options: { color: 'black', print1: 'a4', print2: 'none', print3: 'none' },
        img: '/portfolio/portfolio-21.webp',
      },
      {
        title: 'Парные футболки',
        note: 'две футболки с одним дизайном А4 — для пары, свадьбы, друзей',
        qty: 2,
        options: { color: 'white', print1: 'a4', print2: 'none', print3: 'none' },
        img: '/portfolio/wedding-tshirts.webp',
      },
      {
        title: 'Спереди и сзади',
        note: 'небольшой принт А6 на груди и крупный А3 на спине',
        qty: 1,
        options: { color: 'black', print1: 'a6', print2: 'a3', print3: 'none' },
        img: '/portfolio/dtf-bestdad.webp',
      },
      {
        title: 'Для команды или мероприятия',
        note: '20 футболок в цвет команды: логотип А6 на груди, А4 на спине',
        qty: 20,
        options: { color: 'other', print1: 'a6', print2: 'a4', print3: 'none' },
        img: '/portfolio/portfolio-9.webp',
      },
    ],
    colors: [
      { name: 'Белый', hex: '#ffffff', note: 'в наличии' },
      { name: 'Чёрный', hex: '#1b1b1d', note: 'в наличии' },
      { name: 'Серый меланж', hex: '#b7b8bc', order: true },
      { name: 'Тёмно-синий', hex: '#1f2a4d', order: true },
      { name: 'Красный', hex: '#d0262f', order: true },
      { name: 'Бордовый', hex: '#6d1a2a', order: true },
      { name: 'Бутылочный', hex: '#1f4d36', order: true },
      { name: 'Хаки', hex: '#6b6b47', order: true },
      { name: 'Голубой', hex: '#8ec5e6', order: true },
      { name: 'Жёлтый', hex: '#f3cf2c', order: true },
      { name: 'Розовый', hex: '#f2a7c3', order: true },
      { name: 'Песочный', hex: '#d8c3a0', order: true },
    ],
    alsoOrder: ['/pechat-na-kruzhkah', '/pechat-na-hudi', '/znachki', '/pechat-na-kepkah', '/pechat-na-shopperah', '/fotopodarki'],
    specs: [
      { label: 'Модель', value: 'Унисекс' },
      { label: 'Состав', value: '100% хлопок' },
      { label: 'Плотность', value: '160–180 г/м²' },
      { label: 'Размеры', value: 'взрослые — от XS до 3XL' },
      { label: 'Детские размеры', value: 'от 98 до 164 (рост, см)' },
      { label: 'Технология печати', value: 'DTF — на белой и чёрной ткани' },
      { label: 'Места печати', value: 'грудь, спина, рукава' },
      { label: 'Размер принта', value: 'от А6 (10×15 см) до А3 (28×38 см)' },
      { label: 'Стойкость принта', value: '50+ стирок при правильном уходе' },
    ],
    sizes: {
      columns: ['Размер', 'Ширина, см', 'Длина, см'],
      rows: [
        ['XS (42)', '46', '68'],
        ['S (44)', '49', '70'],
        ['M (46)', '52', '72'],
        ['L (48)', '55', '74'],
        ['XL (50)', '58', '76'],
        ['XXL (52)', '61', '78'],
        ['3XL (54)', '64', '80'],
      ],
      todo: true,
    },
    care: [
      'Первую стирку — не раньше чем через сутки после печати.',
      'Стирайте навыворот при 30–40 °C, без отбеливателя.',
      'Гладьте с изнанки, утюгом по принту не проводите.',
      'Не сушите в барабанной сушилке и на батарее.',
      'Без химчистки и агрессивных пятновыводителей на принте.',
    ],
    reviewKeywords: ['футболк'],
  },

  /* ── Худи: без выбора цвета, print1–print3, А6–А3 ── */
  {
    slug: '/pechat-na-hudi',
    productId: 'hoodie',
    silhouette: 'hoodie',
    packages: [
      {
        title: 'Худи с принтом на груди',
        note: 'рисунок или надпись А4 спереди',
        qty: 1,
        options: { print1: 'a4', print2: 'none', print3: 'none' },
        img: '/portfolio/portfolio-5.webp',
      },
      {
        title: 'Большой принт на спине',
        note: 'небольшой принт А6 на груди и крупный А3 на спине',
        qty: 1,
        options: { print1: 'a6', print2: 'a3', print3: 'none' },
        img: '/img/showcase/hoodie.webp',
      },
      {
        title: 'Грудь, спина и рукав',
        note: 'логотип А6 на груди, А3 на спине и надпись А6 на рукаве',
        qty: 1,
        options: { print1: 'a6', print2: 'a3', print3: 'a6' },
        img: '/img/showcase/hoodie.webp',
      },
      {
        title: 'Для класса или команды',
        note: '20 худи: логотип А6 на груди, название или имя А4 на спине',
        qty: 20,
        options: { print1: 'a6', print2: 'a4', print3: 'none' },
        img: '/img/showcase/hoodie.webp',
      },
    ],
    alsoOrder: ['/pechat-na-futbolkah', '/pechat-na-kepkah', '/znachki', '/pechat-na-kruzhkah', '/pechat-na-shopperah'],
    colors: [
      { name: 'Чёрный', hex: '#1b1b1d', note: 'уточняйте наличие' },
      { name: 'Белый', hex: '#ffffff', note: 'уточняйте наличие' },
      { name: 'Серый меланж', hex: '#a7a9ac', note: 'уточняйте наличие' },
    ],
    specs: [
      { label: 'Модель', value: 'Худи унисекс с капюшоном и карманом «кенгуру»', todo: true },
      { label: 'Состав', value: '80% хлопок, 20% полиэстер', todo: true },
      { label: 'Плотность', value: '320 г/м², с начёсом внутри', todo: true },
      { label: 'Размеры', value: 'от S до 3XL', todo: true },
      { label: 'Наличие', value: 'модели, цвета и размеры меняются — уточняйте у менеджера' },
      { label: 'Технология печати', value: 'DTF — на тёмном и светлом трикотаже' },
      { label: 'Места печати', value: 'грудь, спина, рукава, капюшон — до 4 принтов на одном худи' },
      { label: 'Размер принта', value: 'от А6 (10×15 см) до А3 (28×38 см) на спине' },
      { label: 'Стойкость принта', value: '50+ стирок при правильном уходе' },
    ],
    sizes: {
      columns: ['Размер', 'Ширина, см', 'Длина, см', 'Рукав, см'],
      rows: [
        ['S–M (44–46)', '52', '68', '73'],
        ['M–L (46–48)', '54', '70', '74'],
        ['L–XL (48–50)', '56', '72', '76'],
        ['XL–2XL (50–52)', '58', '74', '78'],
        ['2XL–3XL (52–54)', '61', '76', '79'],
      ],
      todo: true,
    },
    care: [
      'Первую стирку — не раньше чем через сутки после печати.',
      'Стирайте навыворот в деликатном режиме при 30 °C, без отбеливателя.',
      'Гладьте с изнанки, утюгом по принту не проводите.',
      'Сушите расправленным на горизонтальной поверхности, не в барабанной сушилке.',
    ],
    reviewKeywords: ['худи'],
  },

  /* ── Шоппер: без выбора цвета, print1–print2, А6–А4 ── */
  {
    slug: '/pechat-na-shopperah',
    productId: 'shopper',
    silhouette: 'shopper',
    packages: [
      {
        title: 'Шоппер в подарок',
        note: 'рисунок, надпись или фото А4 с одной стороны',
        qty: 1,
        options: { print1: 'a4', print2: 'none' },
        img: '/portfolio/shopper-bags.webp',
      },
      {
        title: 'С двух сторон',
        note: 'два принта А4 — одинаковые или разные',
        qty: 1,
        options: { print1: 'a4', print2: 'a4' },
        img: '/img/showcase/shopper.webp',
      },
      {
        title: 'Для мероприятия или магазина',
        note: '20 шопперов с логотипом или афишей А5',
        qty: 20,
        options: { print1: 'a5', print2: 'none' },
        img: '/portfolio/portfolio-7.webp',
      },
    ],
    alsoOrder: ['/pechat-na-futbolkah', '/znachki', '/breloki', '/pechat-na-kruzhkah', '/nakleyki'],
    colors: [
      { name: 'Натуральный', hex: '#e9dfc9', note: 'уточняйте наличие' },
      { name: 'Белый', hex: '#ffffff', note: 'уточняйте наличие' },
      { name: 'Чёрный', hex: '#1b1b1d', note: 'уточняйте наличие' },
    ],
    specs: [
      { label: 'Состав', value: '100% хлопок', todo: true },
      { label: 'Плотность ткани', value: '220 г/м²', todo: true },
      { label: 'Размер сумки', value: '38×42 см', todo: true },
      { label: 'Ручки', value: 'длинные, около 65 см — сумку можно носить на плече', todo: true },
      { label: 'Технология печати', value: 'DTF — на светлой и тёмной ткани' },
      { label: 'Места печати', value: 'две стороны сумки' },
      { label: 'Размер принта', value: 'от А6 (10×15 см) до А4 (21×28 см) с каждой стороны' },
      { label: 'Стойкость принта', value: '50+ стирок при правильном уходе' },
    ],
    care: [
      'Стирайте навыворот вручную или в деликатном режиме до 30 °C.',
      'Без отбеливателя и пятновыводителей на принте.',
      'Гладьте с изнанки — по принту утюгом не проводите.',
      'Сушите расправленной, не в барабанной сушилке.',
    ],
    reviewKeywords: [],
  },

  /* ── Бейсболка: без выбора цвета, print1–print2, только А6 ── */
  {
    slug: '/pechat-na-kepkah',
    productId: 'cap',
    silhouette: 'cap',
    packages: [
      {
        title: 'Именная кепка',
        note: 'имя, надпись или логотип спереди',
        qty: 1,
        options: { print1: 'a6', print2: 'none' },
        img: '/img/showcase/cap.webp',
      },
      {
        title: 'Спереди и сзади',
        note: 'логотип спереди и короткая надпись сзади или сбоку',
        qty: 1,
        options: { print1: 'a6', print2: 'a6' },
        img: '/portfolio/portfolio-8.webp',
      },
      {
        title: 'Для персонала или команды',
        note: '20 кепок с логотипом спереди',
        qty: 20,
        options: { print1: 'a6', print2: 'none' },
        img: '/portfolio/branded-caps.webp',
      },
    ],
    alsoOrder: ['/pechat-na-futbolkah', '/pechat-na-hudi', '/znachki', '/pechat-na-shopperah', '/breloki'],
    colors: [
      { name: 'Чёрный', hex: '#1b1b1d', note: 'уточняйте наличие' },
      { name: 'Белый', hex: '#ffffff', note: 'уточняйте наличие' },
    ],
    specs: [
      { label: 'Модель', value: 'Бейсболка, 5 панелей', todo: true },
      { label: 'Состав', value: '100% хлопок', todo: true },
      { label: 'Размер', value: 'универсальный, 56–60 см', todo: true },
      { label: 'Застёжка', value: 'регулируемая, сзади', todo: true },
      { label: 'Технология печати', value: 'DTF' },
      { label: 'Места печати', value: 'передняя часть и ещё одно место — сзади или сбоку, зависит от модели' },
      { label: 'Размер принта', value: 'до А6 (10×15 см), на деле обычно меньше — по высоте панели' },
    ],
    care: [
      'Не стирайте в машинке — козырёк и передняя часть могут потерять форму.',
      'Чистите вручную: тёплая вода, мягкая губка, без отбеливателя.',
      'Не трите принт щёткой.',
      'Сушите на форме — например, на банке или мяче, а не на батарее.',
    ],
    reviewKeywords: [],
  },
];

export const garmentBySlug = (slug: string) => garments.find((g) => g.slug === slug);
