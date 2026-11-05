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
      // owner's list (02.11.2026): white and black first, the rest in one row, no «под заказ» marks
      { name: 'Белый', hex: '#ffffff' },
      { name: 'Чёрный', hex: '#1b1b1d' },
      { name: 'Жёлтый', hex: '#ffe000' },
      { name: 'Зелёный', hex: '#0a7d4a' },
      { name: 'Коричневый', hex: '#7e4e2a' },
      { name: 'Красный', hex: '#e31e36' },
      { name: 'Оранжевый', hex: '#ff6a2a' },
      { name: 'Розовый', hex: '#f2bccb' },
      { name: 'Серый', hex: '#8c8c8c' },
      { name: 'Синий', hex: '#2e5fd8' },
      { name: 'Сиреневый', hex: '#6a64a8' },
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

  // Шоппер: own page src/pages/pechat-na-shopperah.astro (content — src/data/shoppersPage.ts)

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
