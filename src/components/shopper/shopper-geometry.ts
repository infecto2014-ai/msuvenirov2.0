// Геометрия SVG-иллюстраций шопперов (ShopperArt.astro). Вид спереди, ручки-петли сверху.
// Все размеры — в миллиметрах. Начало координат — левый верхний угол полотна,
// ручки уходят вверх в отрицательные y.

export type ShopperType = 'cotton' | 'linen';
export type PrintSize = 'a6' | 'a5' | 'a4' | 'a3';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Model {
  /** полотно */
  w: number;
  h: number;
  /** длина ручки (полная, вместе с пришитыми концами) */
  strap: number;
  /** ширина ручки */
  strapW: number;
  /** расстояние между концами одной ручки (по центрам) */
  strapGap: number;
  /** ширина подгиба сверху (строчка) */
  hem: number;
  /** плотность ткани, г/м² (если известна) */
  gsm?: number;
  name: string;
}

export const MODELS: Record<ShopperType, Model> = {
  // сублимация: светлый шоппер цвета небелёного льна, 36×42 см, ручки 70 см, 330 г/м²
  linen: { w: 360, h: 420, strap: 700, strapW: 30, strapGap: 150, hem: 30, gsm: 330, name: 'Шоппер для сублимации, цвет небелёного льна' },
  // DTF: хлопковый шоппер 38×42 см, ручки тоньше
  cotton: { w: 380, h: 420, strap: 700, strapW: 30, // owner, 05.11.2026: TEXTILLER 38×42, handle height 35 cm, width 3 cm
    strapGap: 150, hem: 26, name: 'Хлопковый шоппер' },
};

/**
 * Размеры принтов в мм. Сублимация — бумажные форматы (как subPrint в pricing.ts),
 * DTF на ткани — размеры владельца (как dtfPrint: А6 10×15 … А3 28×38).
 */
export const PRINT_SIZES: Record<ShopperType, Record<PrintSize, { w: number; h: number }>> = {
  linen: { a6: { w: 105, h: 148 }, a5: { w: 148, h: 210 }, a4: { w: 210, h: 297 }, a3: { w: 297, h: 420 } },
  cotton: { a6: { w: 100, h: 150 }, a5: { w: 150, h: 210 }, a4: { w: 210, h: 280 }, a3: { w: 280, h: 380 } },
};

export interface ShopperLayout {
  model: Model;
  /** габарит содержимого: x 0…w, y top…h */
  top: number;
  /** передняя стенка (верх чуть провисает — видна изнанка задней стенки) */
  front: string;
  /** задняя стенка (видна полоской сверху) */
  back: string;
  /** ручки: осевые линии петель (передняя и задняя) */
  strapFront: string;
  strapBack: string;
  /** точка на правом крае передней ручки */
  strapPoint: { x: number; y: number };
  /** высота петли над сумкой */
  loop: number;
  /** точки пришива передней ручки (центры) */
  tacks: { x: number; y: number; w: number; h: number }[];
  /** поле принта в реальном масштабе (уменьшено, если не помещается) */
  print: Rect;
  /** принт пришлось уменьшить, чтобы поместился */
  printFit: boolean;
  /** складки: d + толщина + тон (-1 тень, +1 свет) */
  folds: { d: string; w: number; tone: number; o: number }[];
}

const f = (n: number) => +n.toFixed(2);

type Pt = [number, number];
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const m = 1 - t;
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};
const bezLen = (p0: Pt, p1: Pt, p2: Pt, p3: Pt) => {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= 40; i++) {
    const p = bez(p0, p1, p2, p3, i / 40);
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return len;
};

/** Петля ручки: концы в (cx ± g/2, y0), вершина на высоте loop. Мягкая «капля», ноги чуть расходятся. */
function loopPath(cx: number, g: number, y0: number, loop: number, lean = 0) {
  const x1 = cx - g / 2;
  const x2 = cx + g / 2;
  const top: Pt = [cx + lean, y0 - loop];
  const half = (sx: number, dir: number): [Pt, Pt, Pt, Pt] => [
    [sx, y0],
    [sx - dir * g * 0.1, y0 - loop * 0.5],
    [top[0] - dir * g * 0.52, top[1]],
    top,
  ];
  const L = half(x1, 1);
  const R = half(x2, -1);
  const d = `M ${f(L[0][0])} ${f(L[0][1])} C ${f(L[1][0])} ${f(L[1][1])}, ${f(L[2][0])} ${f(L[2][1])}, ${f(top[0])} ${f(top[1])} C ${f(R[2][0])} ${f(R[2][1])}, ${f(R[1][0])} ${f(R[1][1])}, ${f(R[0][0])} ${f(R[0][1])}`;
  return { d, len: bezLen(...L) + bezLen(...R), R };
}

/** Подбирает высоту петли так, чтобы видимая длина ручки ≈ длине минус пришитые концы. */
function solveLoop(cx: number, g: number, visible: number) {
  let lo = 40, hi = 600;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (loopPath(cx, g, 0, mid).len < visible) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function buildShopper(type: ShopperType, size: PrintSize): ShopperLayout {
  const model = MODELS[type];
  const { w, h, strap, strapW, strapGap, hem } = model;
  const cx = w / 2;

  // концы ручки уходят внутрь на 40 мм (пришиты к подгибу)
  const loop = solveLoop(cx, strapGap, strap - 2 * 40);
  const fl = loopPath(cx, strapGap, 0, loop, -4);
  const strapFront = fl.d;
  // точка на внешнем крае правой ноги передней ручки (для выноски «ручки 70 см»)
  const rp = bez(...fl.R, 0.55);
  const strapPoint = { x: rp[0] + strapW / 2, y: rp[1] };
  // задняя ручка — чуть смещена и ниже (лежит за сумкой)
  const strapBack = loopPath(cx + 14, strapGap, -2, loop * 0.93, 10).d;

  const sag = 4; // провис передней стенки по центру
  const front = [
    `M 0 0`,
    `Q ${f(cx)} ${f(sag * 2)} ${f(w)} 0`,
    `Q ${f(w + 2.2)} ${f(h * 0.5)} ${f(w + 0.6)} ${f(h - 7)}`,
    `Q ${f(w + 0.4)} ${f(h)} ${f(w - 7)} ${f(h + 0.4)}`,
    `Q ${f(cx)} ${f(h + 3)} 7 ${f(h + 0.4)}`,
    `Q -0.4 ${f(h)} -0.6 ${f(h - 7)}`,
    `Q -2.2 ${f(h * 0.5)} 0 0 Z`,
  ].join(' ');
  const back = `M 0.6 0 L 0.8 -2.4 Q ${f(cx)} -3.6 ${f(w - 0.8)} -2.4 L ${f(w - 0.6)} 0 Z`;

  const tackH = Math.min(hem - 4, 24);
  const tacks = [-1, 1].map((s) => ({ x: cx - 4 + (s * strapGap) / 2, y: 4 + (hem - 4 - tackH) / 2, w: strapW, h: tackH }));

  // принт — по центру поля ниже подгиба, не ближе 10 мм к краям
  const ps = PRINT_SIZES[type][size];
  const areaTop = hem + 8;
  const areaBot = h - 10;
  const maxH = areaBot - areaTop;
  const maxW = w - 24;
  const k = Math.min(1, maxH / ps.h, maxW / ps.w);
  const pw = ps.w * k;
  const ph = ps.h * k;
  // визуальный центр чуть выше середины
  const cy = Math.min(Math.max(areaTop + ph / 2, (hem + h) / 2 - 8), areaBot - ph / 2);
  const print: Rect = { x: cx - pw / 2, y: cy - ph / 2, w: pw, h: ph };

  // мягкие складки (в долях полотна): тени и блики
  const F = (pts: number[][]) => {
    const p = pts.map(([x, y]) => `${f(x * w)} ${f(y * h)}`);
    return `M ${p[0]} C ${p[1]}, ${p[2]}, ${p[3]}`;
  };
  const folds = [
    // от ручек вниз — ткань тянется под весом
    { d: F([[0.28, 0.0], [0.26, 0.18], [0.3, 0.32], [0.24, 0.55]]), w: 16, tone: -1, o: 0.13 },
    { d: F([[0.7, 0.0], [0.72, 0.16], [0.68, 0.3], [0.74, 0.5]]), w: 16, tone: -1, o: 0.12 },
    { d: F([[0.33, 0.0], [0.32, 0.16], [0.36, 0.3], [0.31, 0.48]]), w: 7, tone: 1, o: 0.35 },
    { d: F([[0.64, 0.02], [0.66, 0.15], [0.62, 0.28], [0.67, 0.44]]), w: 7, tone: 1, o: 0.3 },
    // мягкая волна внизу
    { d: F([[0.12, 0.62], [0.16, 0.78], [0.1, 0.9], [0.16, 1.02]]), w: 22, tone: -1, o: 0.09 },
    { d: F([[0.86, 0.58], [0.82, 0.74], [0.9, 0.88], [0.84, 1.02]]), w: 20, tone: -1, o: 0.1 },
    { d: F([[0.52, 0.56], [0.48, 0.72], [0.56, 0.86], [0.5, 1.02]]), w: 12, tone: 1, o: 0.22 },
    // залом поперёк (сумка лежала сложенной)
    { d: F([[-0.02, 0.535], [0.3, 0.52], [0.7, 0.55], [1.02, 0.53]]), w: 2.2, tone: -1, o: 0.16 },
    { d: F([[-0.02, 0.542], [0.3, 0.527], [0.7, 0.557], [1.02, 0.537]]), w: 2.6, tone: 1, o: 0.3 },
  ];

  return {
    model,
    top: -(loop + strapW / 2 + 2),
    front,
    back,
    strapFront,
    strapBack,
    strapPoint,
    loop,
    tacks,
    print,
    printFit: k < 1,
    folds,
  };
}
