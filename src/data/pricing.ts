// Single source of truth for all prices on the site.
// Calculators, price tables, "от N ₽" labels and JSON-LD offers are all derived from this file.
// Prices are in rubles. A tier `{ from, price }` applies when qty >= from.

export interface Tier {
  from: number;
  price: number;
}

export interface Choice {
  id: string;
  label: string;
  /** short hint under the label */
  hint?: string;
  /** colour dot shown in the chip, e.g. '#d9261c' */
  swatch?: string;
}

export interface OptionGroup {
  id: string;
  label: string;
  /** 'one' = pick exactly one, 'many' = any number of toggles */
  type: 'one' | 'many';
  choices: Choice[];
  /** default choice id(s) */
  default?: string | string[];
  /** hide this group while another group has this value, e.g. colour is hidden for the customer's own t-shirt */
  hideWhen?: { group: string; value: string };
  /** show this group only while another group has this value, e.g. mug colours only for the coloured mug */
  showWhen?: { group: string; value: string };
  /** optional extra group (e.g. 2nd–4th print): hidden while 'none', the customer adds it with a button */
  addable?: boolean;
}

export interface DimInput {
  id: string;
  label: string;
  unit: 'см';
  min: number;
  max: number;
  default: number;
}

export interface QtyConfig {
  min: number;
  max: number;
  default: number;
  /** discrete packages only (e.g. pocket calendars) */
  presets?: number[];
  /** with presets: from this quantity on, any amount can be ordered (presets below it) */
  freeFrom?: number;
  /** above `max` the price is set individually (clothing: more than 50 pcs) — the last tier reads «20–50 шт» */
  individualAbove?: boolean;
}

export interface Selection {
  options: Record<string, string | string[]>;
  dims: Record<string, number>;
  qty: number;
}

export interface Quote {
  /** price per piece */
  unit: number;
  total: number;
  /** price is a lower bound ("от"); exact price confirmed by the manager */
  from?: boolean;
  /** human-readable lines that sum up to `unit` (per piece) or to `total` */
  breakdown: { label: string; amount: number; per: 'шт' | 'заказ' }[];
  /** cheaper tier available at a larger quantity */
  next?: { qty: number; unit: number };
  notes: string[];
  /** blocking problem: the configuration cannot be ordered as is */
  error?: string;
}

export interface Product {
  id: string;
  name: string;
  /** one-line description in the picker */
  short?: string;
  image?: string;
  qty: QtyConfig;
  options?: OptionGroup[];
  dims?: DimInput[];
  /** quantities at which the price per piece drops (for the tier ladder in the UI) */
  ladder?: (sel: Selection) => Tier[];
  quote: (sel: Selection) => Quote;
  /** static price table for the HTML price list (always visible, indexable) */
  table?: PriceTable;
  /** lowest possible price per piece, for "от N ₽" labels */
  fromPrice: number;
  /** text unit for fromPrice: "шт", "м²", "см²" */
  fromUnit?: string;
}

export interface PriceTable {
  columns: string[];
  rows: { label: string; cells: string[] }[];
  /** small print under the table */
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  /** landing page with details */
  page?: string;
  products: Product[];
}

// ---------------------------------------------------------------- helpers

export const tierPrice = (tiers: Tier[], qty: number): number => {
  let p = tiers[0].price;
  for (const t of tiers) if (qty >= t.from) p = t.price;
  return p;
};

export const nextTier = (tiers: Tier[], qty: number): Tier | undefined => {
  const cur = tierPrice(tiers, qty);
  return tiers.find((t) => t.from > qty && t.price < cur);
};

const one = (sel: Selection, id: string, fallback: string): string => {
  const v = sel.options[id];
  return typeof v === 'string' ? v : fallback;
};

const many = (sel: Selection, id: string): string[] => {
  const v = sel.options[id];
  return Array.isArray(v) ? v : [];
};

const round = (n: number) => Math.round(n * 100) / 100;


export const rub = (n: number): string =>
  `${n.toLocaleString('ru-RU', { maximumFractionDigits: n % 1 ? 2 : 0, minimumFractionDigits: n % 1 ? 1 : 0 })} ₽`;

/** Labels for price tiers: exact print runs for presets, ranges for free quantities. */
export const qtyLabels = (from: number[], qty: QtyConfig): string[] => {
  if (qty.individualAbove) {
    const labels = rangeLabels(from);
    labels[labels.length - 1] = `${from[from.length - 1]}–${qty.max} шт`;
    return labels;
  }
  if (!qty.presets) return rangeLabels(from);
  const free = qty.freeFrom ?? Infinity;
  const ranges = rangeLabels(from);
  return from.map((f, i) => (f < free ? `${f.toLocaleString('ru-RU')} шт` : ranges[i]));
};

/** [1, 5, 20] -> ["1–4 шт", "5–19 шт", "от 20 шт"] */
export const rangeLabels = (from: number[]): string[] =>
  from.map((f, i) => {
    if (from.length === 1) return `от ${f} шт`;
    if (i === from.length - 1) return `от ${f} шт`;
    const to = from[i + 1] - 1;
    return to === f ? `${f} шт` : `${f}–${to} шт`;
  });

/** Build tiers from a list of thresholds and a matching list of prices. */
const tiers = (from: number[], prices: number[]): Tier[] => from.map((f, i) => ({ from: f, price: prices[i] }));

const minPrice = (t: Tier[]) => Math.min(...t.map((x) => x.price));

/** Simple product: price per piece depends on a variant and on quantity. */
function tiered(args: {
  id: string;
  name: string;
  short?: string;
  image?: string;
  qty: QtyConfig;
  variantLabel?: string;
  variants: { id: string; label: string; hint?: string; tiers: Tier[] }[];
  extras?: { id: string; label: string; price: number }[];
  extrasLabel?: string;
  /** Extra choices that do not change the price (e.g. paper finish). */
  choices?: OptionGroup[];
  notes?: string[];
}): Product {
  const groups: OptionGroup[] = [];
  if (args.variants.length > 1) {
    groups.push({
      id: 'variant',
      label: args.variantLabel ?? 'Вариант',
      type: 'one',
      choices: args.variants.map((v) => ({ id: v.id, label: v.label, hint: v.hint })),
      default: args.variants[0].id,
    });
  }
  if (args.choices?.length) groups.push(...args.choices);
  if (args.extras?.length) {
    groups.push({
      id: 'extras',
      label: args.extrasLabel ?? 'Дополнительно',
      type: 'many',
      choices: args.extras.map((e) => ({ id: e.id, label: e.label, hint: `+${e.price} ₽/шт` })),
      default: [],
    });
  }
  const variantOf = (sel: Selection) => args.variants.find((v) => v.id === one(sel, 'variant', args.variants[0].id)) ?? args.variants[0];
  return {
    id: args.id,
    name: args.name,
    short: args.short,
    image: args.image,
    qty: args.qty,
    options: groups,
    fromPrice: Math.min(...args.variants.map((v) => minPrice(v.tiers))),
    table: {
      columns: qtyLabels(args.variants[0].tiers.map((t) => t.from), args.qty),
      rows: [
        ...args.variants.map((v) => ({ label: args.variants.length > 1 ? v.label : args.name, cells: v.tiers.map((t) => rub(t.price)) })),
        ...(args.extras ?? []).map((e) => ({ label: `+ ${e.label}`, cells: args.variants[0].tiers.map(() => `+${rub(e.price)}`) })),
      ],
    },
    ladder: (sel) => variantOf(sel).tiers,
    quote: (sel) => {
      const v = variantOf(sel);
      const base = tierPrice(v.tiers, sel.qty);
      const breakdown: Quote['breakdown'] = [{ label: args.variants.length > 1 ? v.label : args.name, amount: base, per: 'шт' }];
      let unit = base;
      for (const id of many(sel, 'extras')) {
        const e = args.extras?.find((x) => x.id === id);
        if (e) {
          unit += e.price;
          breakdown.push({ label: e.label, amount: e.price, per: 'шт' });
        }
      }
      const nt = nextTier(v.tiers, sel.qty);
      return {
        unit,
        total: Math.round(unit * sel.qty),
        breakdown,
        next: nt ? { qty: nt.from, unit: unit - base + nt.price } : undefined,
        notes: args.notes ?? [],
      };
    },
  };
}

/** Fixed price per piece, no quantity discount. */
function fixed(id: string, name: string, price: number, opts: { short?: string; from?: boolean; image?: string } = {}): Product {
  return {
    id,
    name,
    short: opts.short,
    image: opts.image,
    qty: { min: 1, max: 100, default: 1 },
    fromPrice: price,
    table: { columns: ['Цена'], rows: [{ label: name, cells: [`${opts.from ? 'от ' : ''}${rub(price)}`] }] },
    quote: (sel) => ({
      unit: price,
      total: price * sel.qty,
      from: opts.from,
      breakdown: [{ label: name, amount: price, per: 'шт' }],
      notes: opts.from ? ['Итоговая цена зависит от размера и макета — менеджер подтвердит её после просмотра.'] : [],
    }),
  };
}

// ---------------------------------------------------------------- textile

/** DTF transfer price per print by format; tiers 1–4 / 5–19 / 20+. */
export const dtfPrint: Record<'a6' | 'a5' | 'a4' | 'a3', { label: string; size: string; tiers: Tier[] }> = {
  a6: { label: 'А6', size: '10×15 см', tiers: tiers([1, 5, 20], [600, 350, 280]) },
  a5: { label: 'А5', size: '15×21 см', tiers: tiers([1, 5, 20], [600, 450, 330]) },
  a4: { label: 'А4', size: '21×28 см', tiers: tiers([1, 5, 20], [800, 650, 450]) },
  a3: { label: 'А3', size: '28×38 см', tiers: tiers([1, 5, 20], [1100, 900, 680]) },
};
type Format = keyof typeof dtfPrint;

/**
 * Several prints on one item: the most expensive print is charged in full, the next one at 70%,
 * the rest at 50% (owner, 01.11.2026). Prints are ranked by price, not by the order they were picked:
 * A6 + A3 + A4 = A3 + A4 −30% + A6 −50%.
 */
export const extraPrintFactor = [1, 0.7, 0.5];

const formatChoices = (formats: Format[], withNone: boolean): Choice[] => [
  ...(withNone ? [{ id: 'none', label: 'Нет' }] : []),
  ...formats.map((f) => ({ id: f, label: dtfPrint[f].label, hint: dtfPrint[f].size })),
];

/** Clothing is priced up to this quantity; larger runs are quoted individually. */
export const GARMENT_MAX = 50;

function garment(args: {
  id: string;
  name: string;
  short: string;
  image?: string;
  /** blank price tiers; omit for "own item" */
  blank?: Tier[];
  /** blank price is a lower bound, availability must be confirmed */
  blankFrom?: boolean;
  formats: Format[];
  /** max number of print places */
  places: number;
  colors?: boolean;
  /** offer «своя вещь»: e.g. 'футболка' → choice «Своя футболка», only the print is charged */
  own?: string;
}): Product {
  const placeLabels = ['Основной принт', 'Второй принт', 'Третий принт', 'Четвёртый принт'];
  const options: OptionGroup[] = [];
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  if (args.own) {
    options.push({
      id: 'blank',
      label: cap(args.own),
      type: 'one',
      choices: [
        { id: 'ours', label: `Наша ${args.own}`, hint: 'с печатью' },
        { id: 'own', label: `Своя ${args.own}`, hint: 'только печать' },
      ],
      default: 'ours',
    });
  }
  const isOwn = (sel: Selection) => !!args.own && one(sel, 'blank', 'ours') === 'own';
  if (args.colors) {
    options.push({
      ...(args.own ? { hideWhen: { group: 'blank', value: 'own' } } : {}),
      id: 'color',
      label: 'Цвет изделия',
      type: 'one',
      choices: [
        { id: 'white', label: 'Белый' },
        { id: 'black', label: 'Чёрный' },
        { id: 'other', label: 'Другой цвет', hint: 'от 10 шт' },
      ],
      default: 'white',
    });
  }
  for (let i = 0; i < args.places; i++) {
    options.push({
      id: `print${i + 1}`,
      label: i === 0 ? `${placeLabels[i]} (DTF)` : placeLabels[i],
      type: 'one',
      choices: formatChoices(args.formats, i > 0),
      default: i === 0 ? (args.formats.includes('a4') ? 'a4' : args.formats[0]) : 'none',
      addable: i > 0,
    });
  }
  const prints = (sel: Selection): Format[] => {
    const out: Format[] = [];
    for (let i = 0; i < args.places; i++) {
      const v = one(sel, `print${i + 1}`, i === 0 ? args.formats[0] : 'none');
      if (v !== 'none' && v in dtfPrint) out.push(v as Format);
    }
    return out;
  };
  /** prints ranked from the most expensive to the cheapest, each with its discount factor */
  const ranked = (sel: Selection, qty: number) =>
    prints(sel)
      .map((f) => ({ f, base: dtfPrint[f].tiers.length ? tierPrice(dtfPrint[f].tiers, qty) : 0 }))
      .sort((a, b) => b.base - a.base)
      .map((p, i) => ({ ...p, k: extraPrintFactor[Math.min(i, 2)] }));
  const unitAt = (sel: Selection, qty: number) => {
    let u = args.blank && !isOwn(sel) ? tierPrice(args.blank, qty) : 0;
    for (const p of ranked(sel, qty)) u += p.base * p.k;
    return round(u);
  };
  const breakpoints = (sel: Selection) => {
    const set = new Set<number>([1, 5, 20]);
    args.blank?.forEach((t) => set.add(t.from));
    return [...set].sort((a, b) => a - b).map((from) => ({ from, price: unitAt(sel, from) }));
  };
  const blankMin = args.blank ? minPrice(args.blank) : 0;
  return {
    id: args.id,
    name: args.name,
    short: args.short,
    image: args.image,
    // owner, 02.11.2026: prices up to 50 pcs; more than 50 — individual price
    qty: { min: 1, max: GARMENT_MAX, default: 1, individualAbove: true },
    options,
    fromPrice: blankMin + minPrice(dtfPrint[args.formats[0]].tiers),
    table: {
      columns: qtyLabels([1, 5, 20], { min: 1, max: GARMENT_MAX, default: 1, individualAbove: true }),
      rows: [
        ...(args.blank
          ? [{ label: args.name, cells: [1, 5, 20].map((q) => `${args.blankFrom ? 'от ' : ''}${rub(tierPrice(args.blank!, q))}`) }]
          : []),
        ...args.formats.map((f) => ({ label: `+ печать DTF ${dtfPrint[f].label}`, cells: dtfPrint[f].tiers.map((t) => `+${rub(t.price)}`) })),
      ],
      note: `Больше ${GARMENT_MAX} шт — цена рассчитывается индивидуально.`,
    },
    ladder: breakpoints,
    quote: (sel) => {
      const qty = sel.qty;
      const breakdown: Quote['breakdown'] = [];
      const notes: string[] = [];
      if (args.blank && !isOwn(sel)) {
        breakdown.push({ label: args.blankFrom ? `${args.name} (от)` : args.name, amount: tierPrice(args.blank, qty), per: 'шт' });
      }
      const rp = ranked(sel, qty);
      for (const p of rp) {
        breakdown.push({
          label: `Печать DTF ${dtfPrint[p.f].label}${p.k < 1 ? ` (−${Math.round((1 - p.k) * 100)}%)` : ''}`,
          amount: round(p.base * p.k),
          per: 'шт',
        });
      }
      if (rp.length > 1) notes.push('Несколько принтов: самый дорогой — по полной цене, следующий −30%, остальные −50%.');
      const unit = unitAt(sel, qty);
      const nb = breakpoints(sel).find((t) => t.from > qty && t.price < unit);
      let error: string | undefined;
      if (args.colors && !isOwn(sel) && one(sel, 'color', 'white') === 'other' && qty < 10) {
        error = 'Футболки других цветов (кроме белого и чёрного) — под заказ от 10 шт.';
      }
      if (args.blankFrom && !isOwn(sel)) notes.push('Наличие и точную цену изделия уточнит менеджер.');
      if (isOwn(sel)) notes.push(`${cap(`своя ${args.own}`)}: принесите её в мастерскую, напечатаем на ней. Подойдут хлопок, смесовые ткани, синтетика.`);
      if (!args.blank) notes.push('Печать на вашем изделии. Подойдут хлопок, смесовые ткани, синтетика.');
      if (qty >= GARMENT_MAX) notes.push(`Нужно больше ${GARMENT_MAX} шт? Цену рассчитаем индивидуально — отправьте заявку.`);
      return {
        unit,
        total: Math.round(unit * qty),
        from: args.blankFrom && !isOwn(sel),
        breakdown,
        next: nb ? { qty: nb.from, unit: nb.price } : undefined,
        notes,
        error,
      };
    },
  };
}

const textile: Category = {
  id: 'textile',
  name: 'Одежда и текстиль',
  page: '/pechat-na-futbolkah',
  products: [
    garment({
      id: 'tshirt-unisex',
      name: 'Футболка унисекс',
      short: '160–180 г/м², белая или чёрная',
      image: '/img/showcase/tshirt.webp',
      blank: tiers([1, 5, 20], [750, 650, 550]),
      formats: ['a6', 'a5', 'a4', 'a3'],
      places: 4,
      colors: true,
      own: 'футболка',
    }),
    garment({
      id: 'tshirt-kids',
      name: 'Футболка детская',
      short: '100% хлопок, размеры 98–164',
      image: '/img/showcase/tshirt.webp',
      blank: tiers([1, 5, 20], [750, 550, 500]),
      formats: ['a6', 'a5', 'a4'],
      places: 2,
      colors: true,
    }),
    garment({
      id: 'hoodie',
      name: 'Худи',
      short: 'уточняйте наличие',
      image: '/img/showcase/hoodie.webp',
      blank: tiers([1], [2000]),
      blankFrom: true,
      formats: ['a6', 'a5', 'a4', 'a3'],
      places: 4,
    }),
    garment({
      id: 'oversize',
      name: 'Футболка оверсайз',
      short: 'от 180 г/м², уточняйте наличие',
      image: '/img/showcase/tshirt.webp',
      blank: tiers([1], [1200]),
      blankFrom: true,
      formats: ['a6', 'a5', 'a4', 'a3'],
      places: 3,
    }),
    garment({
      id: 'polo',
      name: 'Поло',
      short: 'уточняйте наличие',
      image: '/portfolio/corporate-polo.webp',
      blank: tiers([1], [1200]),
      blankFrom: true,
      formats: ['a6', 'a5', 'a4'],
      places: 2,
    }),
    garment({
      id: 'cap',
      name: 'Бейсболка',
      short: 'печать на передней части',
      image: '/img/showcase/cap.webp',
      blank: tiers([1, 5, 20], [750, 650, 550]),
      formats: ['a6'],
      places: 2,
    }),
    garment({
      id: 'shopper',
      name: 'Шоппер',
      short: 'хлопковая сумка',
      image: '/img/showcase/shopper.webp',
      blank: tiers([1, 5, 20], [450, 350, 250]),
      formats: ['a6', 'a5', 'a4'],
      places: 2,
    }),
    garment({
      id: 'apron',
      name: 'Фартук',
      short: 'уточняйте наличие',
      blank: tiers([1], [1000]),
      blankFrom: true,
      formats: ['a6', 'a5', 'a4'],
      places: 1,
    }),
    garment({
      id: 'own-item',
      name: 'Печать на вашем изделии',
      short: 'принесите свою вещь',
      formats: ['a6', 'a5', 'a4', 'a3'],
      places: 3,
    }),
  ],
};

// ---------------------------------------------------------------- mugs

// Tiers: 1–4 / 5–9 / 10–49 / 50–199 / 200+ — price includes the mug and the print.
const mugTiers = [1, 5, 10, 50, 200];

const mugs: Category = {
  id: 'mugs',
  name: 'Кружки',
  page: '/pechat-na-kruzhkah',
  products: [
    tiered({
      id: 'mug',
      name: 'Кружка 330 мл',
      short: 'классическая, d=82 мм — кружка и печать в цене',
      image: '/img/showcase/mug.webp',
      qty: { min: 1, max: 300, default: 1 },
      variantLabel: 'Вид кружки',
      variants: [
        { id: 'white', label: 'Белая', hint: '330 мл', tiers: tiers(mugTiers, [650, 450, 350, 315, 250]) },
        { id: 'color', label: 'Цветная внутри или ручка', tiers: tiers(mugTiers, [750, 550, 470, 425, 340]) },
        { id: 'chameleon', label: 'Хамелеон', hint: 'рисунок проявляется от горячего', tiers: tiers(mugTiers, [1100, 980, 890, 815, 650]) },
        { id: 'glitter', label: 'Глиттер', hint: '4 цвета блёсток', tiers: tiers(mugTiers, [1630, 980, 890, 815, 650]) },
        { id: 'marble', label: 'Мрамор, зеркальное золото или серебро', hint: '3 цвета мрамора', tiers: tiers(mugTiers, [1945, 1170, 1070, 970, 780]) },
        { id: 'gold', label: 'Золото, серебро, стекло', tiers: tiers(mugTiers, [1320, 790, 730, 660, 530]) },
      ],
      choices: [
        {
          // owner, 04.11.2026: 9 colours of the handle and the inside
          id: 'inner',
          label: 'Цвет ручки и внутри',
          type: 'one',
          showWhen: { group: 'variant', value: 'color' },
          choices: [
            { id: 'navy', label: 'Тёмно-синий', swatch: '#0d1f8c' },
            { id: 'darkgreen', label: 'Тёмно-зелёный', swatch: '#0f5a40' },
            { id: 'black', label: 'Чёрный', swatch: '#141414' },
            { id: 'pink', label: 'Розовый', swatch: '#efb3c2' },
            { id: 'blue', label: 'Синий', swatch: '#2c5fd6' },
            { id: 'lime', label: 'Салатовый', swatch: '#7ed321' },
            { id: 'red', label: 'Красный', swatch: '#d9261c' },
            { id: 'orange', label: 'Оранжевый', swatch: '#f26a1b' },
            { id: 'yellow', label: 'Жёлтый', swatch: '#f6c21a' },
          ],
          default: 'red',
        },
        {
          // owner's photo, 04.11.2026
          id: 'glitter',
          label: 'Цвет глиттера',
          type: 'one',
          showWhen: { group: 'variant', value: 'glitter' },
          choices: [
            { id: 'gold', label: 'Золотой', swatch: '#e2bf3c' },
            { id: 'silver', label: 'Серебряный', swatch: '#c9ccd0' },
            { id: 'turquoise', label: 'Бирюзовый', swatch: '#8fcbd0' },
            { id: 'pink', label: 'Розовый', swatch: '#ea9ccb' },
          ],
          default: 'gold',
        },
        {
          id: 'marble',
          label: 'Покрытие',
          type: 'one',
          showWhen: { group: 'variant', value: 'marble' },
          choices: [
            { id: 'grey', label: 'Мрамор серый', swatch: '#8e8b94' },
            { id: 'pink', label: 'Мрамор розовый', swatch: '#e88a98' },
            { id: 'blue', label: 'Мрамор голубой', swatch: '#7fb0dc' },
            { id: 'mgold', label: 'Зеркальное золото', swatch: '#d4af37' },
            { id: 'msilver', label: 'Зеркальное серебро', swatch: '#bfc3c8' },
          ],
          default: 'grey',
        },
      ],
      notes: ['Кружка для сублимации 330 мл, d=82 мм. Цена включает кружку, печать по кругу и подготовку макета.'],
    }),
    // owner, 04.11.2026
    tiered({
      id: 'mug-big',
      name: 'Кружка 425 мл',
      short: 'увеличенной ёмкости, белая, d=82 мм',
      image: '/img/showcase/mug.webp',
      qty: { min: 1, max: 300, default: 1 },
      variants: [{ id: 'white', label: 'Белая 425 мл', tiers: tiers(mugTiers, [800, 600, 500, 425, 400]) }],
      notes: ['Кружка для сублимации увеличенной ёмкости, 425 мл, d=82 мм. Цена включает кружку и печать.'],
    }),
    tiered({
      id: 'coffee-set',
      name: 'Кофейный набор',
      short: 'чашка 150 мл, блюдце и ложка, белый',
      image: '/img/showcase/mug.webp',
      qty: { min: 1, max: 300, default: 1 },
      variants: [{ id: 'white', label: 'Белый 150 мл', tiers: tiers(mugTiers, [1630, 980, 890, 815, 650]) }],
      notes: ['Кофейный набор для сублимации: чашка 150 мл (d=78 мм), блюдце и ложка. Цена включает набор и печать.'],
    }),
    tiered({
      id: 'beer-mug',
      name: 'Пивная кружка 600 мл',
      short: 'белая, d=82 мм',
      image: '/img/mug/gallery-3.jpg',
      qty: { min: 1, max: 300, default: 1 },
      variants: [{ id: 'white', label: 'Белая 600 мл', tiers: tiers(mugTiers, [950, 800, 750, 690, 650]) }],
      notes: ['Пивная кружка для сублимации, 600 мл, d=82 мм. Цена включает кружку и печать.'],
    }),
  ],
};

// ---------------------------------------------------------------- badges, keychains, magnets

const badgeTiers = [25, 100, 200, 300, 400, 500];
const rollTiers = [10, 100, 200, 300, 400, 500]; // from 10 pcs at the 25-pcs price

const badges: Category = {
  id: 'badges',
  name: 'Значки',
  page: '/znachki',
  products: [
    tiered({
      id: 'badge-roll',
      name: 'Значок закатной',
      short: 'круглый, на булавке',
      image: '/img/showcase/keychains.webp',
      qty: { min: 10, max: 1000, default: 25 },
      variantLabel: 'Диаметр',
      variants: [
        { id: 'd38', label: '38 мм', tiers: tiers(rollTiers, [85, 45, 38, 35, 32, 30]) },
        { id: 'd56', label: '56 мм', tiers: tiers(rollTiers, [100, 49, 45, 41, 38, 33]) },
      ],
    }),
    tiered({
      id: 'badge-pin',
      name: 'Значок на цанге',
      short: 'металлический, круглый',
      qty: { min: 25, max: 1000, default: 25 },
      variantLabel: 'Диаметр',
      variants: [
        { id: 'd15', label: '15 мм', tiers: tiers(badgeTiers, [120, 110, 100, 92, 85, 75]) },
        { id: 'd25', label: '25 мм', tiers: tiers(badgeTiers, [200, 185, 170, 155, 140, 125]) },
        { id: 'd30', label: '30 мм', tiers: tiers(badgeTiers, [250, 230, 210, 190, 170, 150]) },
        { id: 'd35', label: '35 мм', tiers: tiers(badgeTiers, [310, 285, 260, 240, 210, 190]) },
      ],
    }),
  ],
};

const keychains: Category = {
  id: 'keychains',
  name: 'Брелоки',
  page: '/breloki',
  products: [
    tiered({
      id: 'keychain-acrylic',
      name: 'Брелок акриловый',
      short: '40×56 мм, печать с двух сторон',
      image: '/img/showcase/keychains.webp',
      qty: { min: 1, max: 1000, default: 1 },
      variants: [{ id: 'std', label: '40×56 мм', tiers: tiers([1, 25, 100, 200, 300, 400, 500], [150, 130, 65, 60, 54, 49, 43]) }],
    }),
    tiered({
      id: 'keychain-metal',
      name: 'Брелок металлический',
      short: 'с полноцветной печатью',
      qty: { min: 1, max: 1000, default: 1 },
      variants: [{ id: 'std', label: 'Металл', tiers: tiers([1, 100, 200, 300, 400, 500], [500, 420, 400, 380, 350, 330]) }],
    }),
  ],
};

const magnetTiers = [100, 200, 300, 400, 500];

const magnets: Category = {
  id: 'magnets',
  name: 'Магниты',
  page: '/magnity',
  products: [
    tiered({
      id: 'magnet-vinyl',
      name: 'Магнит виниловый',
      short: 'тиражи от 100 шт',
      qty: { min: 100, max: 3000, default: 100 },
      variantLabel: 'Размер',
      variants: [
        { id: 'r4060', label: '40×60 мм', tiers: tiers(magnetTiers, [35, 30, 28, 28, 26]) },
        { id: 's6060', label: '60×60 мм', tiers: tiers(magnetTiers, [36, 31, 30, 29, 28]) },
        { id: 'r6080', label: '60×80 мм', tiers: tiers(magnetTiers, [39, 35, 33, 30, 29]) },
        { id: 'c68', label: 'Круг 68 мм', tiers: tiers(magnetTiers, [36, 31, 30, 29, 28]) },
        { id: 'c50', label: 'Круг 50 мм', tiers: tiers(magnetTiers, [35, 30, 28, 28, 26]) },
      ],
    }),
    tiered({
      id: 'magnet-acrylic',
      name: 'Магнит акриловый',
      short: 'тиражи от 100 шт',
      qty: { min: 100, max: 3000, default: 100 },
      variantLabel: 'Размер',
      variants: [
        { id: 's105', label: '105×105 мм', tiers: tiers(magnetTiers, [160, 140, 120, 110, 90]) },
        { id: 'r10570', label: '105×70 мм', tiers: tiers(magnetTiers, [160, 140, 120, 110, 90]) },
        { id: 'r8055', label: '80×55 мм', tiers: tiers(magnetTiers, [130, 100, 90, 80, 75]) },
      ],
    }),
    fixed('photo-magnet', 'Фотомагнит акриловый, 1 шт', 250, { short: 'подарок с вашим фото' }),
  ],
};

// ---------------------------------------------------------------- 3D stickers (area)

const STICKER_MIN_ORDER = 2000;

const stickers: Category = {
  id: 'stickers',
  name: '3D-стикеры',
  page: '/nakleyki',
  products: [
    {
      id: 'sticker-3d',
      name: '3D-стикеры с эпоксидной смолой',
      short: 'объёмные наклейки с логотипом',
      image: '/img/showcase/stickers-3d.webp',
      qty: { min: 1, max: 2000, default: 50 },
      options: [
        {
          id: 'cut',
          label: 'Форма',
          type: 'one',
          choices: [
            { id: 'simple', label: 'Простая', hint: 'круг, квадрат, прямоугольник' },
            { id: 'complex', label: 'Сложная', hint: 'по контуру рисунка' },
          ],
          default: 'simple',
        },
      ],
      dims: [
        { id: 'w', label: 'Ширина', unit: 'см', min: 1, max: 20, default: 4 },
        { id: 'h', label: 'Высота', unit: 'см', min: 1, max: 20, default: 4 },
      ],
      fromPrice: 5,
      fromUnit: 'см²',
      table: {
        columns: ['Цена за см²'],
        rows: [
          { label: 'Простая форма', cells: ['5 ₽'] },
          { label: 'Сложная форма (по контуру)', cells: ['6,5 ₽'] },
          { label: 'Минимальный заказ', cells: [rub(STICKER_MIN_ORDER)] },
        ],
      },
      quote: (sel) => {
        const rate = one(sel, 'cut', 'simple') === 'complex' ? 6.5 : 5;
        const area = (sel.dims.w ?? 4) * (sel.dims.h ?? 4);
        const unit = round(area * rate);
        const raw = unit * sel.qty;
        const total = Math.max(STICKER_MIN_ORDER, Math.round(raw));
        const notes = [`Площадь одного стикера — ${area} см² × ${String(rate).replace('.', ',')} ₽/см².`];
        if (raw < STICKER_MIN_ORDER) notes.push(`Минимальная сумма заказа — ${STICKER_MIN_ORDER.toLocaleString('ru-RU')} ₽.`);
        return {
          unit: round(total / sel.qty),
          total,
          breakdown: [{ label: `Стикер ${sel.dims.w ?? 4}×${sel.dims.h ?? 4} см`, amount: unit, per: 'шт' }],
          notes,
        };
      },
    },
    fixed('sticker-set', 'Набор 3D-стикеров, 3 шт', 500, { short: 'по вашим фото или картинкам' }),
  ],
};

// ---------------------------------------------------------------- print: cards, flyers, notebooks, office

const cards: Category = {
  id: 'cards',
  name: 'Визитки',
  page: '/vizitki',
  products: [
    tiered({
      id: 'business-cards',
      name: 'Визитки 90×50 мм',
      short: 'цифровая печать, бумага 300 г, глянец или мат',
      image: '/img/showcase/business-cards.webp',
      // Owner, 01.11.2026: fixed runs 96 / 200 / 300, from 500 any quantity
      qty: { min: 96, max: 20000, default: 96, presets: [96, 200, 300], freeFrom: 500 },
      variantLabel: 'Печать',
      variants: [
        { id: 's1', label: 'Односторонняя', hint: '4+0', tiers: tiers([96, 200, 300, 500, 1000, 6000], [6.2, 4.9, 4, 3.5, 3.2, 2.4]) },
        { id: 's2', label: 'Двусторонняя', hint: '4+4', tiers: tiers([96, 200, 300, 500, 1000, 6000], [9.6, 7.1, 5.9, 5, 4.7, 3.2]) },
      ],
      choices: [
        {
          id: 'paper',
          label: 'Бумага 300 г',
          type: 'one',
          choices: [
            { id: 'gloss', label: 'Глянцевая' },
            { id: 'matte', label: 'Матовая' },
          ],
          default: 'gloss',
        },
      ],
      notes: ['До 500 шт визитки печатаются тиражами 96, 200 или 300 шт, от 500 шт — любое количество. Срок — от 1 дня. Глянцевая и матовая бумага — по одной цене.'],
    }),
  ],
};

type FlyerRow = { s: number[]; d: number[] };
const flyerPrices: Record<string, { label: string; hint: string; thin: FlyerRow; thick: FlyerRow }> = {
  a3: { label: 'А3', hint: '297×420 мм', thin: { s: [65, 56, 45], d: [110, 97, 86] }, thick: { s: [120, 108, 96], d: [195, 175, 155] } },
  a4: { label: 'А4', hint: '210×297 мм', thin: { s: [40, 34, 30], d: [60, 54, 48] }, thick: { s: [80, 70, 62], d: [125, 113, 100] } },
  a5: { label: 'А5', hint: '148×210 мм', thin: { s: [25, 20, 18], d: [35, 30, 27] }, thick: { s: [40, 35, 31], d: [65, 56, 50] } },
  euro: { label: 'Еврофлаер', hint: '1/3 А4', thin: { s: [15, 14, 13], d: [25, 20, 18] }, thick: { s: [25, 23, 21], d: [45, 38, 34] } },
  a6: { label: 'А6', hint: '105×148 мм', thin: { s: [25, 20, 18], d: [25, 20, 18] }, thick: { s: [20, 18, 16], d: [30, 29, 25] } },
};
const flyerTierFrom = [50, 100, 200];

const flyerTiers = (sel: Selection): Tier[] => {
  const f = flyerPrices[one(sel, 'format', 'a4')] ?? flyerPrices.a4;
  const paper = one(sel, 'paper', 'thin') === 'thick' ? f.thick : f.thin;
  return tiers(flyerTierFrom, one(sel, 'sides', 's') === 'd' ? paper.d : paper.s);
};

const flyers: Category = {
  id: 'flyers',
  name: 'Листовки и полиграфия',
  page: '/poligrafiya',
  products: [
    {
      id: 'flyers',
      name: 'Листовки и флаеры',
      short: 'цифровая печать от 50 шт',
      image: '/img/showcase/stationery.webp',
      qty: { min: 50, max: 2000, default: 100 },
      options: [
        { id: 'format', label: 'Формат', type: 'one', choices: Object.entries(flyerPrices).map(([id, f]) => ({ id, label: f.label, hint: f.hint })), default: 'a4' },
        {
          id: 'paper',
          label: 'Бумага',
          type: 'one',
          choices: [
            { id: 'thin', label: 'Офсетная 80 г', hint: 'тонкая' },
            { id: 'thick', label: 'Плотная 115–300 г', hint: 'мелованная' },
          ],
          default: 'thin',
        },
        {
          id: 'sides',
          label: 'Печать',
          type: 'one',
          choices: [
            { id: 's', label: 'Односторонняя' },
            { id: 'd', label: 'Двусторонняя' },
          ],
          default: 's',
        },
      ],
      fromPrice: 13,
      table: {
        columns: rangeLabels(flyerTierFrom),
        rows: Object.values(flyerPrices).flatMap((f) => [
          { label: `${f.label}, 80 г, 1 сторона`, cells: f.thin.s.map(rub) },
          { label: `${f.label}, 80 г, 2 стороны`, cells: f.thin.d.map(rub) },
          { label: `${f.label}, 115–300 г, 1 сторона`, cells: f.thick.s.map(rub) },
          { label: `${f.label}, 115–300 г, 2 стороны`, cells: f.thick.d.map(rub) },
        ]),
      },
      ladder: flyerTiers,
      quote: (sel) => {
        const t = flyerTiers(sel);
        const unit = tierPrice(t, sel.qty);
        const nt = nextTier(t, sel.qty);
        return {
          unit,
          total: Math.round(unit * sel.qty),
          breakdown: [{ label: `Листовка ${flyerPrices[one(sel, 'format', 'a4')]?.label ?? 'А4'}`, amount: unit, per: 'шт' }],
          next: nt ? { qty: nt.from, unit: nt.price } : undefined,
          notes: [],
        };
      },
    },
    tiered({
      id: 'notebook',
      name: 'Блокнот с вашей обложкой',
      short: '40 листов',
      image: '/img/showcase/stationery.webp',
      qty: { min: 20, max: 1000, default: 20 },
      variantLabel: 'Формат',
      variants: [
        { id: 'a5', label: 'А5', tiers: tiers([20, 50, 100, 200, 300], [150, 110, 100, 95, 80]) },
        { id: 'a6', label: 'А6', tiers: tiers([20, 50, 100, 200, 300], [85, 75, 70, 65, 60]) },
      ],
    }),
    tiered({
      id: 'office',
      name: 'Печать документов',
      short: 'ч/б и цветная, от 1 листа',
      qty: { min: 1, max: 500, default: 10 },
      variantLabel: 'Формат и цвет',
      variants: [
        { id: 'a4bw', label: 'А4 ч/б', tiers: tiers([1], [15]) },
        { id: 'a4c', label: 'А4 цветная', tiers: tiers([1], [25]) },
        { id: 'a3bw', label: 'А3 ч/б', tiers: tiers([1], [30]) },
        { id: 'a3c', label: 'А3 цветная', tiers: tiers([1], [40]) },
      ],
    }),
  ],
};

// ---------------------------------------------------------------- calendars

const calendars: Category = {
  id: 'calendars',
  name: 'Календари',
  page: '/kalendari',
  products: [
    (() => {
      // Supplier price list 2026–2027 (owner, 03.11.2026) +20%, whole rubles. Price per calendar by print run.
      const up = (xs: number[]) => xs.map((x) => Math.round(x * 1.2));
      const runs = [10, 50, 100, 200, 300, 500, 1000];
      const models: { id: string; label: string; hint: string; prices: number[] }[] = [
        { id: 'midi3', label: 'МИДИ, 3 рекламных поля', hint: '325 мм, 3 блока', prices: up([560, 530, 490, 420, 390, 370, 350]) },
        { id: 'midi1', label: 'МИДИ, 1 рекламное поле', hint: '325 мм, 3 блока', prices: up([460, 420, 390, 360, 340, 320, 290]) },
        { id: 'mini3', label: 'МИНИ, 3 рекламных поля', hint: '297 мм, 3 блока', prices: up([410, 380, 370, 360, 350, 340, 330]) },
        { id: 'mini1', label: 'МИНИ, 1 рекламное поле', hint: '297 мм, 3 блока', prices: up([340, 320, 310, 300, 290, 280, 270]) },
        { id: 'trio', label: '«3 в 1», 1 рекламное поле', hint: '335 мм, один большой блок', prices: up([350, 320, 310, 300]) },
      ];
      const STRIP = { none: 0, silver: 110, gold: 130 }; // owner, 04.11.2026
      const FOLD = 40; // owner, 04.11.2026
      const tiersOf = (m: (typeof models)[number]) => tiers(runs.slice(0, m.prices.length), m.prices);
      const model = (sel: Selection) => models.find((m) => m.id === one(sel, 'model', 'midi3')) ?? models[0];
      const extras = (sel: Selection) => {
        const strip = one(sel, 'strip', 'none') as keyof typeof STRIP;
        const fold = many(sel, 'fold').includes('fold');
        return { strip, stripPrice: STRIP[strip] ?? 0, fold, foldPrice: fold ? FOLD : 0 };
      };
      const p: Product = {
        id: 'cal-quarterly',
        name: 'Квартальный календарь',
        short: 'МИДИ, МИНИ и «3 в 1», от 10 шт',
        image: '/img/showcase/stationery.webp',
        qty: { min: 10, max: 5000, default: 50 },
        options: [
          { id: 'model', label: 'Модель', type: 'one', choices: models.map((m) => ({ id: m.id, label: m.label, hint: m.hint })), default: 'midi3' },
          {
            id: 'strip',
            label: 'Металлическая планка',
            type: 'one',
            choices: [
              { id: 'none', label: 'Без планки' },
              { id: 'silver', label: 'Серебро', hint: `+${STRIP.silver} ₽/шт` },
              { id: 'gold', label: 'Золото', hint: `+${STRIP.gold} ₽/шт` },
            ],
            default: 'none',
          },
          {
            id: 'fold',
            label: 'Постер',
            type: 'many',
            choices: [{ id: 'fold', label: 'Подгиб постера', hint: `+${FOLD} ₽/шт, верх плотнее` }],
            default: [],
          },
        ],
        fromPrice: Math.min(...models.map((m) => Math.min(...m.prices))),
        table: {
          columns: runs.map((r) => `от ${r} шт`),
          rows: [
            ...models.map((m) => ({ label: m.label, cells: runs.map((_, i) => (m.prices[i] ? rub(m.prices[i]) : '—')) })),
            { label: '+ металлическая планка: серебро / золото', cells: runs.map(() => `+${STRIP.silver} / +${STRIP.gold} ₽`) },
            { label: '+ подгиб постера', cells: runs.map(() => `+${rub(FOLD)}`) },
          ],
          note: 'Цена за 1 календарь. «3 в 1» — тиражом до 200 шт, больше — по запросу.',
        },
        ladder: (sel) => tiersOf(model(sel)),
        quote: (sel) => {
          const m = model(sel);
          const t = tiersOf(m);
          const base = tierPrice(t, sel.qty);
          const x = extras(sel);
          const unit = base + x.stripPrice + x.foldPrice;
          const breakdown: Quote['breakdown'] = [{ label: `Календарь ${m.label}`, amount: base, per: 'шт' }];
          if (x.stripPrice) breakdown.push({ label: `Металлическая планка (${x.strip === 'gold' ? 'золото' : 'серебро'})`, amount: x.stripPrice, per: 'шт' });
          if (x.foldPrice) breakdown.push({ label: 'Подгиб постера', amount: x.foldPrice, per: 'шт' });
          const nt = nextTier(t, sel.qty);
          const notes: string[] = [];
          if (m.id === 'trio' && sel.qty > 200) notes.push('«3 в 1» больше 200 шт — цену рассчитаем индивидуально, отправьте заявку.');
          return {
            unit,
            total: Math.round(unit * sel.qty),
            breakdown,
            next: nt ? { qty: nt.from, unit: unit - base + nt.price } : undefined,
            notes,
          };
        },
      };
      return p;
    })(),
    tiered({
      id: 'cal-wall',
      name: 'Настенный календарь',
      short: 'плакат или перекидной',
      qty: { min: 1, max: 1000, default: 10 },
      variantLabel: 'Вид',
      variants: [
        { id: 'poster', label: 'Плакат А3', hint: '1 лист', tiers: tiers([1, 21, 51, 101], [180, 175, 170, 165]) },
        { id: 'flip-a4', label: 'Перекидной А4', hint: '13 листов', tiers: tiers([1, 21, 51, 101], [695, 540, 480, 420]) },
        { id: 'flip-a3', label: 'Перекидной А3', hint: '13 листов', tiers: tiers([1, 21, 51, 101], [1390, 1080, 960, 840]) },
      ],
    }),
    tiered({
      id: 'cal-desk',
      name: 'Настольный календарь «домик»',
      short: '200×95 мм',
      qty: { min: 1, max: 1000, default: 20 },
      variantLabel: 'Вид',
      variants: [
        { id: 'plain', label: 'Обычный домик', tiers: tiers([1, 50, 100], [60, 55, 45]) },
        { id: 'tearoff', label: 'С отрывными месяцами', tiers: tiers([1, 50, 100], [270, 265, 240]) },
      ],
    }),
    (() => {
      const packs: Tier[] = tiers([100, 200, 300, 500, 1000, 10000], [625, 1170, 1795, 2185, 4055, 17160]);
      const p: Product = {
        id: 'cal-pocket',
        name: 'Карманные календари',
        short: 'цена за весь тираж',
        qty: { min: 100, max: 10000, default: 100, presets: packs.map((t) => t.from) },
        fromPrice: 1.72,
        table: { columns: ['Цена за тираж'], rows: packs.map((t) => ({ label: `${t.from.toLocaleString('ru-RU')} шт`, cells: [rub(t.price)] })) },
        quote: (sel) => {
          const pack = packs.find((t) => t.from >= sel.qty) ?? packs[packs.length - 1];
          return {
            unit: round(pack.price / pack.from),
            total: pack.price,
            breakdown: [{ label: `Тираж ${pack.from.toLocaleString('ru-RU')} шт`, amount: pack.price, per: 'заказ' }],
            notes: ['Карманные календари печатаются тиражами. Цена указана за весь тираж.'],
          };
        },
      };
      return p;
    })(),
  ],
};

// ---------------------------------------------------------------- wide format (area)

const wideMaterials: Record<string, { label: string; perM2: number; from?: boolean }> = {
  film: { label: 'Плёнка с печатью', perM2: 1050 },
  'film-cut': { label: 'Плёнка с печатью и контурной резкой', perM2: 1350 },
  'film-mount': { label: 'Плёнка с резкой на монтажной плёнке', perM2: 2300 },
  banner: { label: 'Баннер', perM2: 1300 },
  onevision: { label: 'OneVision (перфорированная плёнка)', perM2: 1450 },
  pvc: { label: 'Плёнка на ПВХ 3–10 мм', perM2: 4800, from: true },
};

const wide: Category = {
  id: 'wide',
  name: 'Широкоформатная печать',
  page: '/shirokoformatnaya-pechat',
  products: [
    {
      id: 'wide-print',
      name: 'Наклейки, баннеры, плёнка',
      short: 'цена за м²',
      image: '/img/showcase/stickers-3d.webp',
      qty: { min: 1, max: 100, default: 1 },
      options: [
        { id: 'material', label: 'Материал', type: 'one', choices: Object.entries(wideMaterials).map(([id, m]) => ({ id, label: m.label, hint: `${m.from ? 'от ' : ''}${m.perM2.toLocaleString('ru-RU')} ₽/м²` })), default: 'film' },
      ],
      dims: [
        { id: 'w', label: 'Ширина', unit: 'см', min: 10, max: 500, default: 100 },
        { id: 'h', label: 'Высота', unit: 'см', min: 10, max: 500, default: 100 },
      ],
      fromPrice: 1050,
      fromUnit: 'м²',
      table: { columns: ['Цена за м²'], rows: Object.values(wideMaterials).map((m) => ({ label: m.label, cells: [`${m.from ? 'от ' : ''}${rub(m.perM2)}`] })) },
      quote: (sel) => {
        const m = wideMaterials[one(sel, 'material', 'film')] ?? wideMaterials.film;
        const area = round(((sel.dims.w ?? 100) * (sel.dims.h ?? 100)) / 10000);
        const unit = Math.round(area * m.perM2);
        return {
          unit,
          total: unit * sel.qty,
          from: m.from,
          breakdown: [{ label: `${m.label}, ${String(area).replace('.', ',')} м²`, amount: unit, per: 'шт' }],
          notes: [`${m.perM2.toLocaleString('ru-RU')} ₽ за м². Монтаж и сложная резка — по договорённости.`],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------- photo gifts (fixed)

const gifts: Category = {
  id: 'gifts',
  name: 'Фотоподарки',
  page: '/fotopodarki',
  products: [
    fixed('puzzle-a3', 'Пазл А3', 950),
    fixed('puzzle-a4', 'Пазл А4', 850),
    fixed('puzzle-a5', 'Пазл А5', 650),
    fixed('puzzle-heart', 'Пазл «Сердце»', 850),
    fixed('pillow', 'Подушка с фото', 1450, { image: '/img/showcase/pillow.webp' }),
    fixed('mousepad', 'Коврик для мыши', 800),
    fixed('pennant', 'Вымпел', 1100),
    fixed('ball', 'Ёлочный шар 70 мм', 450),
    fixed('medal', 'Медаль', 400),
    fixed('car-sticker', 'Наклейка на авто', 700, { from: true }),
  ],
};

export const categories: Category[] = [textile, mugs, badges, keychains, magnets, stickers, cards, flyers, calendars, wide, gifts];

export const findCategory = (id: string) => categories.find((c) => c.id === id);
export const findProduct = (categoryId: string, productId?: string) => {
  const c = findCategory(categoryId);
  return c?.products.find((p) => p.id === productId) ?? c?.products[0];
};

/** Lowest "от" price of a category, for cards and JSON-LD. */
export const categoryFrom = (id: string): { price: number; unit: string } => {
  const c = findCategory(id);
  if (!c) return { price: 0, unit: 'шт' };
  // "print on your own item" has no blank price, so it would make "от" misleadingly low
  const pool = c.products.filter((p) => p.id !== 'own-item');
  const p = pool.reduce((a, b) => (b.fromPrice < a.fromPrice && !b.fromUnit ? b : a), pool[0]);
  return { price: p.fromPrice, unit: p.fromUnit ?? 'шт' };
};

export const defaultSelection = (p: Product): Selection => {
  const options: Selection['options'] = {};
  for (const g of p.options ?? []) options[g.id] = g.default ?? (g.type === 'many' ? [] : g.choices[0].id);
  const dims: Selection['dims'] = {};
  for (const d of p.dims ?? []) dims[d.id] = d.default;
  return { options, dims, qty: p.qty.default };
};

