// Геометрия SVG-иллюстраций бейсболки (CapArt.astro): 5 панелей — широкая цельная передняя панель
// без шва по центру, две боковые и две задние. Все размеры — в миллиметрах, ось y вниз,
// верх тульи ≈ 0, низ ≈ 120 (высота тульи ~12 см), козырёк ~7 см.
// Принт спереди — до А6 по ширине, по высоте его ограничивает панель: примерно 11 × 6 см.

export type CapView = 'front' | 'side' | 'three-quarter';
export type CapPlace = 'front' | 'side';

type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];

export interface CapLayout {
  /** габарит рисунка */
  box: { x0: number; y0: number; x1: number; y1: number };
  crown: string;
  /** передняя панель (клип для принта и подсветки) */
  frontPanel: string;
  /** видимая боковая панель (для принта сбоку) */
  sidePanel?: string;
  /** швы между панелями */
  seams: string[];
  /** линия строчки вдоль низа тульи */
  band: string;
  /** козырёк: верхняя поверхность и строчки */
  visor: string;
  visorRows: string[];
  /** торец козырька (толщина) — рисуется под козырьком */
  visorEdge: string;
  /** люверсы: центр, радиусы (эллипс, если в ракурсе) */
  eyelets: { x: number; y: number; rx: number; ry: number }[];
  button: { x: number; y: number; w: number };
  /** застёжка сзади (только вид сбоку) */
  strap?: { band: string; buckle: { x: number; y: number; w: number; h: number; rot: number }; tail: string };
  /** поля принта: центр, размер в мм (реальный), искажение ракурса */
  prints: Record<CapPlace, { cx: number; cy: number; w: number; h: number; sx: number; skew: number } | undefined>;
  /** выноски для подписей */
  callouts: { x: number; y: number; label: string; side: 'l' | 'r' }[];
}

/** реальная зона печати спереди и сбоку, мм */
export const PRINT_ZONE: Record<CapPlace, { w: number; h: number }> = {
  front: { w: 110, h: 60 },
  side: { w: 60, h: 35 },
};

const f = (n: number) => +n.toFixed(2);
const pt = (p: Pt) => `${f(p[0])} ${f(p[1])}`;
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** козырёк: линия пришива A и передний край F — оба кубические кривые с общими концами; строчки — промежуточные кривые */
function visorOf(A: Cubic, F: Cubic, rows: number[]) {
  const visor = `M ${pt(A[0])} C ${pt(A[1])}, ${pt(A[2])}, ${pt(A[3])} C ${pt(F[2])}, ${pt(F[1])}, ${pt(F[0])} Z`;
  const visorRows = rows.map((t) => {
    const c = A.map((p, i) => lerp(p, F[i], t)) as Cubic;
    // концы строчек чуть отступают от углов козырька
    const s = lerp(c[0], c[1], 0.12);
    const e = lerp(c[3], c[2], 0.12);
    return `M ${pt(s)} C ${pt(c[1])}, ${pt(c[2])}, ${pt(e)}`;
  });
  const visorEdge = `M ${pt(F[0])} C ${pt(F[1])}, ${pt(F[2])}, ${pt(F[3])} L ${pt([F[3][0], F[3][1] + 3.2])} C ${pt([F[2][0], F[2][1] + 3.2])}, ${pt([F[1][0], F[1][1] + 3.2])}, ${pt([F[0][0], F[0][1] + 3.2])} Z`;
  return { visor, visorRows, visorEdge };
}

const ROWS = [0.55, 0.66, 0.77, 0.88];

export function buildCap(view: CapView): CapLayout {
  if (view === 'side') {
    // профиль, перед — слева
    const v = visorOf(
      [[16, 113], [-6, 108], [-46, 112], [-70, 133]],
      [[16, 113], [-4, 121], [-44, 121], [-70, 133]],
      [0.35, 0.65],
    );
    return {
      box: { x0: -76, y0: -6, x1: 222, y1: 140 },
      crown: 'M 14 118 C 2 70, 30 6, 100 3 C 170 2, 210 40, 213 97 Q 197 101 186 113 C 130 117, 70 120, 14 118 Z',
      frontPanel: 'M 100 3 C 30 6, 2 70, 14 118 C 35 119.5, 55 119.6, 70 119 C 66 70, 76 20, 100 3 Z',
      sidePanel: 'M 100 3 C 76 20, 66 70, 70 119 C 100 118, 130 116.5, 158 114.5 C 160 60, 140 18, 100 3 Z',
      seams: ['M 100 3 C 76 20, 66 70, 70 119', 'M 100 3 C 140 18, 160 60, 158 114.5'],
      band: 'M 18 112.5 C 70 114.5, 130 112, 184 108',
      ...v,
      eyelets: [
        { x: 108, y: 34, rx: 2.6, ry: 2.6 },
        { x: 168, y: 40, rx: 2.4, ry: 2.6 },
      ],
      button: { x: 100, y: 3, w: 13 },
      strap: {
        band: 'M 184 108 L 213 96.5 L 215.5 104 L 186.5 116 Z',
        buckle: { x: 203, y: 95, w: 13, h: 12, rot: -22 },
        tail: 'M 212 99 L 221 95.5 L 222.5 101.5 L 214 105 Z',
      },
      prints: {
        front: { cx: 40, cy: 66, w: PRINT_ZONE.front.w, h: PRINT_ZONE.front.h, sx: 0.3, skew: 6 },
        side: { cx: 114, cy: 72, w: PRINT_ZONE.side.w, h: PRINT_ZONE.side.h, sx: 0.95, skew: -2 },
      },
      callouts: [
        { x: 100, y: -2, label: 'пуговица', side: 'r' },
        { x: 168, y: 40, label: 'люверсы', side: 'r' },
        { x: 209, y: 101, label: 'застёжка металлическая', side: 'r' },
        { x: -40, y: 120, label: 'козырёк со строчкой', side: 'l' },
      ],
    };
  }
  if (view === 'three-quarter') {
    const v = visorOf(
      [[2, 110], [40, 123], [115, 125], [152, 116]],
      [[2, 110], [-46, 152], [112, 178], [152, 116]],
      ROWS,
    );
    return {
      box: { x0: -32, y0: -6, x1: 200, y1: 172 },
      crown: 'M 3 114 C -2 62, 20 8, 94 5 C 166 6, 197 52, 196 104 C 150 114, 50 120, 3 114 Z',
      frontPanel: 'M 94 3 C 50 10, 16 50, 12 116 C 50 120, 100 120.5, 138 118 C 140 60, 128 12, 94 3 Z',
      sidePanel: 'M 94 3 C 128 12, 140 60, 138 118 C 160 116, 175 113, 186 110 C 182 50, 150 10, 94 3 Z',
      seams: ['M 94 3 C 50 10, 16 50, 12 116', 'M 94 3 C 128 12, 140 60, 138 118', 'M 94 3 C 150 10, 182 50, 186 110'],
      band: 'M 8 109 C 50 115, 140 114, 192 104',
      ...v,
      eyelets: [
        { x: 160, y: 44, rx: 2, ry: 2.8 },
        { x: 9, y: 50, rx: 1, ry: 2.6 },
      ],
      button: { x: 94, y: 3, w: 12 },
      prints: {
        front: { cx: 74, cy: 70, w: PRINT_ZONE.front.w, h: PRINT_ZONE.front.h, sx: 0.84, skew: -3 },
        side: { cx: 162, cy: 74, w: PRINT_ZONE.side.w, h: PRINT_ZONE.side.h, sx: 0.55, skew: -10 },
      },
      callouts: [
        { x: 94, y: -2, label: 'пуговица', side: 'r' },
        { x: 160, y: 44, label: 'люверс', side: 'r' },
        { x: 40, y: 30, label: 'цельная передняя панель', side: 'l' },
        { x: 30, y: 140, label: 'строчка на козырьке', side: 'l' },
      ],
    };
  }
  // front
  const v = visorOf(
    [[1, 113], [45, 128], [145, 128], [189, 113]],
    [[1, 113], [-8, 166], [198, 166], [189, 113]],
    ROWS,
  );
  return {
    box: { x0: -12, y0: -6, x1: 202, y1: 158 },
    crown: 'M 3 118 C 0 62, 14 10, 95 5 C 176 10, 190 62, 187 118 C 150 122, 40 122, 3 118 Z',
    frontPanel: 'M 95 3 C 60 8, 30 46, 27 118 C 60 120.5, 130 120.5, 163 118 C 160 46, 130 8, 95 3 Z',
    seams: ['M 95 3 C 60 8, 30 46, 27 118', 'M 95 3 C 130 8, 160 46, 163 118'],
    band: 'M 5 111 C 40 116.5, 150 116.5, 185 111',
    ...v,
    eyelets: [
      { x: 13, y: 52, rx: 1.4, ry: 2.8 },
      { x: 177, y: 52, rx: 1.4, ry: 2.8 },
    ],
    button: { x: 95, y: 3, w: 13 },
    prints: {
      front: { cx: 95, cy: 70, w: PRINT_ZONE.front.w, h: PRINT_ZONE.front.h, sx: 1, skew: 0 },
      side: undefined,
    },
    callouts: [
      { x: 95, y: -2, label: 'пуговица', side: 'r' },
      { x: 177, y: 52, label: 'люверсы', side: 'r' },
      { x: 40, y: 30, label: 'цельная передняя панель', side: 'l' },
      { x: 40, y: 135, label: 'строчка на козырьке', side: 'l' },
    ],
  };
}

/** цвета бейсболок (по фото владельца) — совпадают со swatch в pricing.ts */
export const CAP_COLORS = {
  black: { hex: '#111111', name: 'чёрный' },
  white: { hex: '#ffffff', name: 'белый' },
  red: { hex: '#e10f0f', name: 'красный' },
  blue: { hex: '#2a5be8', name: 'синий' },
  yellow: { hex: '#ffee00', name: 'жёлтый' },
  green: { hex: '#0f8a0f', name: 'зелёный' },
  khaki: { hex: '#7d6a2c', name: 'хаки' },
} as const;
export type CapColor = keyof typeof CAP_COLORS;

const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbHex = (c: number[]) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a: string, b: string, t: number) => {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return rgbHex(A.map((v, i) => v + (B[i] - v) * t));
};
export const isDark = (hex: string) => {
  const [r, g, b] = hexRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.42;
};
