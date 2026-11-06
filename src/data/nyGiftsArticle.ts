// Article «Что подарить на Новый год» (/stati/novogodnie-podarki). Prices are never typed here:
// every idea points at a product in pricing.ts and the price is quoted for the stated quantity.
import { defaultSelection, findProduct, rub, type Selection } from './pricing';
import type { Faq } from './types';

type Who = 'family' | 'kids' | 'friends' | 'work';

interface IdeaSource {
  title: string;
  /** short joke on the card: who it suits */
  who: string;
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
  who: string;
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
  return { title: s.title, who: s.who, text: s.text, img: s.img, href: s.href, order: `${s.order}, ${qty} шт`, priceLabel, price: s.perPiece ? q.unit : q.total };
};

export const groups: { id: Who; label: string; title: string; intro: string; tip: string; ideas: Idea[] }[] = [
  {
    id: 'family',
    label: 'Семье',
    title: 'Подарки семье и близким',
    intro:
      'Родители говорят, что им «ничего не надо». Не верьте: им надо видеть вас — хотя бы на кружке.',
    tip: 'Для кружки и шара берите фото, где лица крупно, а групповое — на подушку или футболку.',
    ideas: [
      { title: 'Ёлочный шар с семейным фото', who: 'для хранителей традиций', text: 'Прозрачный шар с фото внутри — каждый декабрь его будут доставать первым.', img: '/portfolio/portfolio-6.webp', href: '/fotopodarki', order: 'Ёлочный шар с фото', calc: ['gifts', 'ball'] },
      { title: 'Кружка с фото', who: 'для мамы-кофемана', text: 'Любимое фото по кругу кружки — и утренний кофе теперь с семьёй.', img: '/img/mug/gallery-1.jpg', href: '/pechat-na-kruzhkah', order: 'Кружка с фото, белая 330 мл', calc: ['mugs', 'mug'] },
      { title: 'Кружка-хамелеон', who: 'для любителей сюрпризов', text: 'Пустая — тёмная, нальёте горячего — проявится фото. Фокус на каждое чаепитие.', img: '/img/mug/gallery-2.jpg', href: '/pechat-na-kruzhkah', order: 'Кружка-хамелеон с фото', calc: ['mugs', 'mug'], options: { variant: 'chameleon' } },
      { title: 'Подушка с фото', who: 'для главной по уюту', text: 'Мягкая подушка с фото с двух сторон — обнимать можно всю зиму.', img: '/img/showcase/pillow.webp', href: '/fotopodarki', order: 'Подушка с фото', calc: ['gifts', 'pillow'] },
      { title: 'Фотомагнит на холодильник', who: 'для большой родни', text: 'Акриловый магнит с фото — каждому родственнику по одному, и никто не обижен.', img: '/portfolio/portfolio-29.webp', href: '/magnity', order: 'Фотомагнит акриловый', calc: ['magnets', 'photo-magnet'] },
      { title: 'Одинаковые футболки для всей семьи', who: 'для семьи-команды', text: 'Один принт на взрослых и детей — и семейная фотосессия готова.', img: '/portfolio/portfolio-15.webp', href: '/pechat-na-futbolkah', order: 'Футболка с принтом А4', calc: ['textile', 'tshirt-unisex'] },
    ].map(quote),
  },
  {
    id: 'kids',
    label: 'Детям',
    title: 'Подарки детям',
    intro:
      'Дети — самые честные критики. Вещь со своим именем или рисунком они носят, показывают друзьям и младшим не отдают.',
    tip: 'Сфотографируйте рисунок ребёнка при дневном свете и пришлите нам — остальное сделаем сами.',
    ideas: [
      { title: 'Детская футболка с именем или фото', who: 'для юного художника', text: 'Футболка с именем, фото или рисунком ребёнка — в школу как на выставку.', img: '/portfolio/portfolio-4.webp', href: '/pechat-na-futbolkah', order: 'Детская футболка с принтом А4', calc: ['textile', 'tshirt-kids'] },
      { title: 'Набор 3D-стикеров с фото', who: 'для фаната своего кота', text: 'Объёмные стикеры с ребёнком или питомцем — на телефон, тетрадь, ноутбук.', img: '/img/showcase/stickers-3d.webp', href: '/nakleyki', order: 'Набор 3D-стикеров 3×3 см', calc: ['stickers', 'sticker-set'] },
      { title: 'Брелок с фото', who: 'для вечно теряющих ключи', text: 'Акриловый брелок на рюкзак или ключи — маленький, зато всегда с собой.', img: '/portfolio/portfolio-24.webp', href: '/breloki', order: 'Брелок акриловый', calc: ['keychains', 'keychain-acrylic'] },
    ].map(quote),
  },
  {
    id: 'friends',
    label: 'Друзьям',
    title: 'Подарки друзьям',
    intro:
      'Другу нужен не «полезный» подарок, а шутка, понятная только вам двоим.',
    tip: 'Сомневаетесь в шутке? Макет покажем до печати — успеете проверить на общем друге.',
    ideas: [
      { title: 'Худи с принтом', who: 'для вечно мёрзнущих', text: 'Тёплое худи с надписью или фото — будут носить всю зиму, не снимая.', img: '/img/showcase/hoodie.webp', href: '/pechat-na-hudi', order: 'Худи с принтом А4', calc: ['textile', 'hoodie'] },
      { title: 'Кружка с надписью', who: 'для лучшего друга', text: 'Фраза из вашей переписки на кружке: вам двоим смешно, остальным загадочно.', img: '/portfolio/portfolio-25.webp', href: '/pechat-na-kruzhkah', order: 'Кружка с надписью, белая 330 мл', calc: ['mugs', 'mug'] },
      { title: 'Шоппер с видами Калининграда', who: 'для влюблённых в Калининград', text: 'Шоппер с городским принтом или вашим рисунком — пригодится каждый день.', img: '/portfolio/portfolio-7.webp', href: '/pechat-na-shopperah', order: 'Шоппер с принтом А4', calc: ['textile', 'shopper'] },
    ].map(quote),
  },
  {
    id: 'work',
    label: 'Коллегам',
    title: 'Подарки коллегам и партнёрам',
    intro:
      'Порадовать коллег и не разориться — можно. Вещами с логотипом пользуются весь год, а при заказе нескольких штук каждая выходит дешевле.',
    tip: 'Для заказа на весь коллектив закладывайте время с запасом и возьмите пару штук для январских новичков.',
    ideas: [
      { title: 'Кружки с логотипом', who: 'для офисной кухни', text: 'Логотип и поздравление на кружке — весь год на рабочем столе.', img: '/img/mug/gallery-3.jpg', href: '/pechat-na-kruzhkah', order: 'Кружки с логотипом, белые 330 мл', calc: ['mugs', 'mug'], qty: 10, perPiece: true },
      { title: 'Квартальные календари на 2027 год', who: 'для партнёров на весь год', text: 'Ваш логотип и контакты перед глазами партнёра все двенадцать месяцев. От 10 штук.', img: '/img/showcase/stationery.webp', href: '/kalendari', order: 'Квартальные календари', calc: ['calendars', 'cal-quarterly'], qty: 50, perPiece: true },
      { title: 'Футболки с логотипом для команды', who: 'для дружной команды', text: 'Одинаковые футболки к корпоративу — на общем фото сразу видно своих.', img: '/portfolio/portfolio-20.webp', href: '/pechat-na-futbolkah', order: 'Футболки с логотипом А4', calc: ['textile', 'tshirt-unisex'], qty: 20, perPiece: true },
      { title: 'Бейсболки с логотипом', who: 'для команды на выезде', text: 'Логотип спереди — для сотрудников, выездов и мероприятий.', img: '/portfolio/branded-caps.webp', href: '/pechat-na-kepkah', order: 'Бейсболки с логотипом', calc: ['textile', 'cap'], qty: 10, perPiece: true },
      { title: 'Значки с логотипом', who: 'для гостей мероприятия', text: 'Недорогой сувенир для гостей и клиентов: закатные значки 38 мм, от 10 штук.', img: '/img/showcase/keychains.webp', href: '/znachki', order: 'Значки закатные 38 мм', calc: ['badges', 'badge-roll'], qty: 50, perPiece: true },
    ].map(quote),
  },
];

export const ideasCount = groups.reduce((n, g) => n + g.ideas.length, 0);

export const introTitle = 'Чем подарок с фото лучше носков с оленями';

export const intro = [
  'Носки с оленями — классика, но уже 2 января они уходят на дальнюю полку. А вещь с фото, именем или любимой шуткой остаётся надолго.',
  'Мы печатаем сами, в своей мастерской в ТЦ «Экватор». Большинство вещей делаем от 1 штуки, обычно за 1–3 рабочих дня. Ниже — идеи для всех из вашего списка, от мамы до главного бухгалтера.',
];

/** owner, 06.11.2026: open every day, closed only on 1 and 2 January */
export const hoursNote = 'Работаем без выходных — отдыхаем только 1 и 2 января, как все порядочные эльфы.';

export const tips = [
  { title: 'Дарите историю, а не вещь', text: 'Кружка — просто кружка. А кружка с фото с его рыбалки — история для каждого гостя.' },
  { title: 'Одно хорошее фото лучше десяти', text: 'Резкое, светлое, лица крупно. Сомневаетесь — пришлите несколько, поможем выбрать.' },
  { title: 'Добавьте пару тёплых слов', text: 'Имя, дата или ваша общая шутка — и вещь превращается в подарок.' },
  { title: 'Не тяните до 30 декабря', text: 'В декабре у нас цех Деда Мороза. Напишите пораньше — эльфы скажут спасибо.' },
  { title: 'Коллегам — одинаково, но лично', text: 'Один дизайн на всех, а на каждой вещи — имя. И никто не перепутает кружки.' },
];

export const outro =
  'Лучший подарок — тот, над которым подумали, а печать мы возьмём на себя. Напишите, кому дарите и на какой бюджет, — подскажем, посчитаем и покажем макет.';

export const steps = [
  { title: 'Выберите идею', text: 'Или просто напишите, кому дарите, — подскажем, что подойдёт.' },
  { title: 'Пришлите фото или логотип', text: 'В чат на сайте, в Telegram или MAX. Фото с телефона обычно подходит — присылайте файлом, не скриншотом.' },
  { title: 'Согласуем макет', text: 'Покажем, как будет выглядеть подарок, и назовём точную цену. Простой макет соберём бесплатно.' },
  { title: 'Заберите подарок', text: 'В мастерской в ТЦ «Экватор», 2 этаж, ежедневно с 10:00 до 20:00, без выходных.' },
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
    q: 'А если фото не очень хорошего качества?',
    a: 'Присылайте как есть — посмотрим. Если фото маленькое, подскажем, на каком изделии и в каком размере оно будет смотреться лучше, или попросим другой снимок.',
  },
  {
    q: 'Поможете с дизайном?',
    a: 'Простой макет соберём бесплатно: добавим фото, имя, дату или поздравление. Сложный дизайн с нуля — по договорённости. Перед печатью всегда показываем макет.',
  },
  {
    q: 'Как оплатить и забрать подарок?',
    a: 'Оплата наличными, картой или по QR-коду. Частным лицам — предоплата 50%, остаток при получении. Забрать заказ можно в мастерской в ТЦ «Экватор», 2 этаж, ежедневно с 10:00 до 20:00 — мы работаем без выходных, отдыхаем только 1 и 2 января.',
  },
  {
    q: 'Сделаете подарки для всего коллектива?',
    a: 'Да: кружки, футболки, календари, бейсболки и значки с логотипом. Работаем по счёту без НДС с закрывающими документами, перед тиражом согласуем макет и показываем образец.',
  },
];
