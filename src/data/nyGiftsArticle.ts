// Article «Что подарить на Новый год» (/stati/novogodnie-podarki). Prices are never typed here:
// every idea points at a product in pricing.ts and the price is quoted for the stated quantity.
import { defaultSelection, findProduct, rub, type Selection } from './pricing';
import type { Faq } from './types';

type Who = 'family' | 'kids' | 'friends' | 'work';

interface IdeaSource {
  title: string;
  text: string;
  img: string;
  href: string;
  /** what is ordered — passed to the order form */
  order: string;
  /** [category id, product id] in pricing.ts */
  calc: string[];
  qty?: number;
  options?: Selection['options'];
  /** price per piece «от» from pricing.ts (for items quoted per piece in a run) */
  perPiece?: boolean;
}

export interface Idea {
  title: string;
  text: string;
  img: string;
  href: string;
  order: string;
  /** price shown on the card, e.g. «1 шт — 650 ₽» */
  priceLabel: string;
  /** number for the budget filter: price of one gift */
  price: number;
}

const quote = (s: IdeaSource): Idea => {
  const p = findProduct(s.calc[0], s.calc[1])!;
  const base = defaultSelection(p);
  const qty = s.qty ?? p.qty.min;
  const q = p.quote({ ...base, qty, options: { ...base.options, ...(s.options ?? {}) } });
  const from = q.from ? 'от ' : '';
  const priceLabel = s.perPiece
    ? `${from}${rub(q.unit)} / шт при ${qty} шт`
    : qty > 1
      ? `${from}${rub(q.total)} за ${qty} шт`
      : `${from}${rub(q.total)}`;
  return { title: s.title, text: s.text, img: s.img, href: s.href, order: `${s.order}, ${qty} шт`, priceLabel, price: s.perPiece ? q.unit : q.total };
};

export const groups: { id: Who; label: string; title: string; intro: string; ideas: Idea[] }[] = [
  {
    id: 'family',
    label: 'Семье',
    title: 'Подарки семье и близким',
    intro:
      'Самые тёплые подарки — с вашими фотографиями: их не купишь в магазине, и они остаются надолго. Подойдут родителям, бабушкам и дедушкам, второй половинке.',
    ideas: [
      { title: 'Ёлочный шар с семейным фото', text: 'Прозрачный шар 70 мм с фотографией внутри — игрушка, которую каждый год достают первой.', img: '/portfolio/portfolio-6.webp', href: '/fotopodarki', order: 'Ёлочный шар с фото', calc: ['gifts', 'ball'] },
      { title: 'Кружка с фото', text: 'Белая кружка 330 мл с фотографией или коллажем по кругу. Подходит для любой фотографии.', img: '/img/mug/gallery-1.jpg', href: '/pechat-na-kruzhkah', order: 'Кружка с фото, белая 330 мл', calc: ['mugs', 'mug'] },
      { title: 'Кружка-хамелеон', text: 'Сначала тёмная, а когда наливают горячее — проявляется фото или поздравление. Эффект, который запоминают.', img: '/img/mug/gallery-2.jpg', href: '/pechat-na-kruzhkah', order: 'Кружка-хамелеон с фото', calc: ['mugs', 'mug'], options: { variant: 'chameleon' } },
      { title: 'Подушка с фото', text: 'Мягкая подушка с яркой фотографией с двух сторон — уютный подарок для дома.', img: '/img/showcase/pillow.webp', href: '/fotopodarki', order: 'Подушка с фото', calc: ['gifts', 'pillow'] },
      { title: 'Фотомагнит на холодильник', text: 'Акриловый магнит с фото — недорогой подарок, можно сделать по одному для каждого родственника.', img: '/portfolio/portfolio-29.webp', href: '/magnity', order: 'Фотомагнит акриловый', calc: ['magnets', 'photo-magnet'] },
      { title: 'Одинаковые футболки для всей семьи', text: 'Семейный принт или фото на футболках для взрослых и детей — для праздничной фотосессии и на память.', img: '/portfolio/portfolio-15.webp', href: '/pechat-na-futbolkah', order: 'Футболка с принтом А4', calc: ['textile', 'tshirt-unisex'] },
    ].map(quote),
  },
  {
    id: 'kids',
    label: 'Детям',
    title: 'Подарки детям',
    intro: 'Детям нравится видеть на вещах себя, своё имя и любимых героев. Такие подарки носят и показывают друзьям.',
    ideas: [
      { title: 'Детская футболка с именем или фото', text: 'Футболка на рост 98–164 с именем, фото или рисунком ребёнка. Яркая печать выдерживает стирки.', img: '/portfolio/portfolio-4.webp', href: '/pechat-na-futbolkah', order: 'Детская футболка с принтом А4', calc: ['textile', 'tshirt-kids'] },
      { title: 'Набор 3D-стикеров с фото', text: 'Объёмные стикеры 3×3 см из смолы с фото ребёнка или питомца — на телефон, тетрадь, ноутбук.', img: '/img/showcase/stickers-3d.webp', href: '/nakleyki', order: 'Набор 3D-стикеров 3×3 см', calc: ['stickers', 'sticker-set'] },
      { title: 'Брелок с фото', text: 'Акриловый брелок на рюкзак или ключи — маленький подарок, который всегда с собой.', img: '/portfolio/portfolio-24.webp', href: '/breloki', order: 'Брелок акриловый', calc: ['keychains', 'keychain-acrylic'] },
    ].map(quote),
  },
  {
    id: 'friends',
    label: 'Друзьям',
    title: 'Подарки друзьям',
    intro: 'Другу — что-то с общей шуткой, любимой фразой или видом города. Главное, чтобы было понятно только вам двоим.',
    ideas: [
      { title: 'Худи с принтом', text: 'Тёплое худи с надписью, рисунком или фото — подарок, который будут носить всю зиму.', img: '/img/showcase/hoodie.webp', href: '/pechat-na-hudi', order: 'Худи с принтом А4', calc: ['textile', 'hoodie'] },
      { title: 'Кружка с надписью', text: 'Кружка с фразой, которую поймёт только он. Можно подобрать шрифт и добавить картинку.', img: '/portfolio/portfolio-25.webp', href: '/pechat-na-kruzhkah', order: 'Кружка с надписью, белая 330 мл', calc: ['mugs', 'mug'] },
      { title: 'Шоппер с видами Калининграда', text: 'Сумка-шоппер с городским принтом или вашим рисунком — пригодится каждый день.', img: '/portfolio/portfolio-7.webp', href: '/pechat-na-shopperah', order: 'Шоппер с принтом А4', calc: ['textile', 'shopper'] },
    ].map(quote),
  },
  {
    id: 'work',
    label: 'Коллегам',
    title: 'Подарки коллегам и партнёрам',
    intro:
      'Для коллектива и клиентов — полезные вещи с логотипом компании. Цена за штуку ниже с тиражом, работаем по счёту без НДС.',
    ideas: [
      { title: 'Кружки с логотипом', text: 'Кружки с логотипом и поздравлением — подарок, который стоит на столе весь год.', img: '/img/mug/gallery-3.jpg', href: '/pechat-na-kruzhkah', order: 'Кружки с логотипом, белые 330 мл', calc: ['mugs', 'mug'], qty: 10, perPiece: true },
      { title: 'Квартальные календари на 2027 год', text: 'Классический подарок партнёрам: ваш логотип и контакты перед глазами клиента весь год.', img: '/img/showcase/stationery.webp', href: '/kalendari', order: 'Квартальные календари', calc: ['calendars', 'cal-quarterly'], qty: 50, perPiece: true },
      { title: 'Футболки с логотипом для команды', text: 'Одинаковые футболки к корпоративу или для фото всей командой.', img: '/portfolio/portfolio-20.webp', href: '/pechat-na-futbolkah', order: 'Футболки с логотипом А4', calc: ['textile', 'tshirt-unisex'], qty: 20, perPiece: true },
      { title: 'Бейсболки с логотипом', text: 'Бейсболки с логотипом спереди — для сотрудников и мероприятий.', img: '/portfolio/branded-caps.webp', href: '/pechat-na-kepkah', order: 'Бейсболки с логотипом', calc: ['textile', 'cap'], qty: 10, perPiece: true },
      { title: 'Значки с логотипом', text: 'Недорогой сувенир для гостей и клиентов: закатные значки 38 мм с вашим рисунком.', img: '/img/showcase/keychains.webp', href: '/znachki', order: 'Значки закатные 38 мм', calc: ['badges', 'badge-roll'], qty: 50, perPiece: true },
    ].map(quote),
  },
];

export const ideasCount = groups.reduce((n, g) => n + g.ideas.length, 0);

export const budgets = [
  { id: 'all', label: 'Любой', max: Infinity },
  { id: '500', label: 'до 500 ₽', max: 500 },
  { id: '1000', label: 'до 1 000 ₽', max: 1000 },
  { id: '2000', label: 'до 2 000 ₽', max: 2000 },
] as const;

export const steps = [
  { title: 'Выберите идею', text: 'Или просто напишите, кому дарите, — подскажем, что подойдёт.' },
  { title: 'Пришлите фото или логотип', text: 'В чат на сайте, в Telegram или MAX. Фото с телефона обычно подходит — присылайте файлом, не скриншотом.' },
  { title: 'Согласуем макет', text: 'Покажем, как будет выглядеть подарок, и назовём точную цену. Простой макет соберём бесплатно.' },
  { title: 'Заберите подарок', text: 'В мастерской в ТЦ «Экватор», 2 этаж, ежедневно с 10:00 до 20:00.' },
];

export const faq: Faq[] = [
  {
    q: 'За сколько дней до Нового года заказывать подарки?',
    a: 'Обычно делаем заказ за 1–3 рабочих дня, часто быстрее. В декабре заказов больше, поэтому лучше написать заранее — особенно если нужен тираж для коллег или клиентов.',
  },
  {
    q: 'Можно заказать один подарок?',
    a: 'Да, большинство изделий печатаем от 1 штуки: кружки, футболки, худи, ёлочные шары, подушки, магниты и брелоки. Значки — от 10 штук, квартальные календари — от 10 штук.',
  },
  {
    q: 'Подойдёт фото с телефона?',
    a: 'Да, фото с современного телефона обычно подходит. Присылайте оригинал файлом, а не скриншот — мы проверим качество и предупредим, если фото слишком маленькое для выбранного размера.',
  },
  {
    q: 'Поможете с дизайном?',
    a: 'Простой макет соберём бесплатно: добавим фото, имя, дату или поздравление. Сложный дизайн с нуля — по договорённости. Перед печатью всегда показываем макет.',
  },
  {
    q: 'Как оплатить и забрать подарок?',
    a: 'Оплата наличными, картой или по QR-коду. Частным лицам — предоплата 50%, остаток при получении. Забрать заказ можно в мастерской в ТЦ «Экватор», 2 этаж, ежедневно с 10:00 до 20:00.',
  },
  {
    q: 'Сделаете подарки для всего коллектива?',
    a: 'Да: кружки, футболки, календари, бейсболки и значки с логотипом. Работаем по счёту без НДС с закрывающими документами, перед тиражом согласуем макет и показываем образец.',
  },
];
