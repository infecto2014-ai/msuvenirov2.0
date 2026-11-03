// Геометрия SVG-иллюстраций кружек (MugArt.astro). Вид сбоку, ручка справа.
// Все размеры — в миллиметрах; высоты типичные для таких изделий («≈»).

export type MugType = 'mug330' | 'mug425' | 'coffee' | 'beer600';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Model {
  /** диаметр по верху */
  d: number;
  /** диаметр по низу (конус у чашки и пивной кружки) */
  dBottom: number;
  h: number;
  vol: number;
  handle: { w: number; t: number; top: number; bottom: number; boxy?: boolean };
  /** число граней (гранёная пивная кружка) */
  facets?: number;
  /** доля высоты снизу, занятая гранями */
  facetBand?: number;
  saucer?: number;
  name: string;
}

export const MODELS: Record<MugType, Model> = {
  // shapes follow the owner's photos (04.11.2026)
  // classic straight cylinder, big D-handle from top to bottom
  mug330: { d: 82, dBottom: 82, h: 95, vol: 330, handle: { w: 27, t: 8.5, top: 0.08, bottom: 0.86 }, name: 'Кружка для сублимации 330 мл' },
  // taller, slightly narrower towards the bottom
  mug425: { d: 82, dBottom: 76, h: 120, vol: 425, handle: { w: 29, t: 9, top: 0.08, bottom: 0.84 }, name: 'Кружка 425 мл' },
  // low wide cup with a small round loop, porcelain spoon across the saucer
  coffee: { d: 78, dBottom: 72, h: 65, vol: 150, handle: { w: 15, t: 5.5, top: 0.1, bottom: 0.62 }, saucer: 140, name: 'Кофейный набор: чашка 150 мл, блюдце и ложка' },
  // tall straight beer mug, faceted band at the bottom, thick squared handle in the upper part
  beer600: { d: 82, dBottom: 84, h: 150, vol: 600, handle: { w: 30, t: 12, top: 0.1, bottom: 0.64, boxy: true }, facets: 10, facetBand: 0.3, name: 'Пивная кружка 600 мл' },
};

export interface MugLayout {
  model: Model;
  /** ширина и высота содержимого (без тени и размеров) */
  width: number;
  height: number;
  cx: number;
  rt: number;
  rb: number;
  /** полуось эллипса края по вертикали (вид чуть сверху) */
  e: number;
  eb: number;
  h: number;
  body: string;
  handle: { d: string; t: number };
  print: Rect;
  facets: { xt: number; xb: number }[];
  /** y верхней границы пояса граней */
  facetTop: number;
  /** дуга утолщённого дна (пивная) */
  base?: string;
  saucer?: { cx: number; y: number; rx: number; ry: number; depth: number };
  spoon?: { bowl: { cx: number; cy: number; rx: number; ry: number }; handle: string };
  shadow: { cx: number; cy: number; rx: number };
}

const f = (n: number) => +n.toFixed(2);

export function buildMug(type: MugType): MugLayout {
  const model = MODELS[type];
  const { d, dBottom, h, handle: hp } = model;
  const rt = d / 2;
  const rb = dBottom / 2;
  const e = rt * 0.24;
  const eb = e * (rb / rt);
  const saucerR = model.saucer ? model.saucer / 2 : 0;
  const cx = Math.max(rt, rb, saucerR);

  // Корпус: боковины + нижняя дуга; верх перекрывается эллипсом края.
  const body = [
    `M ${f(cx - rt)} ${f(e)}`,
    `L ${f(cx - rb)} ${f(h - eb)}`,
    `A ${f(rb)} ${f(eb)} 0 0 0 ${f(cx + rb)} ${f(h - eb)}`,
    `L ${f(cx + rt)} ${f(e)}`,
    'Z',
  ].join(' ');

  const sideX = (y: number) => cx + rt + ((rb - rt) * (y - e)) / (h - e - eb);
  const span = h - e - eb;
  const y1 = e + span * hp.top;
  const y2 = e + span * hp.bottom;
  const x1 = sideX(y1) - hp.t * 0.5;
  const x2 = sideX(y2) - hp.t * 0.5;
  let hd: string;
  let handleRight: number;
  if (hp.boxy) {
    const X = Math.max(x1, x2) + hp.w;
    const r = hp.t * 1.1;
    hd = `M ${f(x1)} ${f(y1)} H ${f(X - r)} Q ${f(X)} ${f(y1)} ${f(X)} ${f(y1 + r)} V ${f(y2 - r)} Q ${f(X)} ${f(y2)} ${f(X - r)} ${f(y2)} H ${f(x2)}`;
    handleRight = X + hp.t / 2;
  } else {
    const k = hp.w * 1.32;
    hd = `M ${f(x1)} ${f(y1)} C ${f(x1 + k)} ${f(y1 - hp.t * 0.3)}, ${f(x2 + k)} ${f(y2 + hp.t * 0.3)}, ${f(x2)} ${f(y2)}`;
    handleRight = Math.max(x1, x2) + hp.w * 0.99 + hp.t / 2;
  }

  // Поле печати — по центру передней стороны.
  const pw = (type === 'beer600' ? 1.1 : type === 'coffee' ? 1.18 : 1.3) * Math.min(rt, rb);
  const ph = type === 'coffee' ? span * 0.62 : type === 'beer600' ? span * 0.42 : span * 0.56;
  const pcy = e + span * (type === 'coffee' ? 0.5 : type === 'beer600' ? 0.36 : 0.52);
  const print: Rect = { x: cx - pw / 2 - rt * 0.04, y: pcy - ph / 2, w: pw, h: ph };

  const facets: MugLayout['facets'] = [];
  const facetTop = model.facets ? h - eb - (h - e - eb) * (model.facetBand ?? 1) : e;
  if (model.facets) {
    const n = model.facets;
    const rAt = rt + ((rb - rt) * (facetTop - e)) / (h - e - eb);
    for (let i = 0; i <= n; i++) {
      const c = -Math.cos((Math.PI * i) / n);
      facets.push({ xt: cx + rAt * c, xb: cx + rb * c });
    }
  }

  let width = Math.max(cx + rt, cx + rb, handleRight);
  let height = h;
  let saucer: MugLayout['saucer'];
  let spoon: MugLayout['spoon'];
  let shadow = { cx, cy: h, rx: rb * 1.25 };

  if (saucerR) {
    const ry = saucerR * 0.15;
    const y = h - 2;
    const depth = 9;
    saucer = { cx, y, rx: saucerR, ry, depth };
    // porcelain spoon in front of the cup: bowl on the left part of the saucer, handle runs past the saucer rim
    const bx = cx - saucerR * 0.42;
    const by = y + ry * 0.62;
    const ex = cx + saucerR + 14;
    const ey = by - 2.5;
    spoon = {
      bowl: { cx: bx, cy: by, rx: 14, ry: 5.6 },
      handle: `M ${f(bx + 10)} ${f(by - 2.6)} Q ${f(cx + 10)} ${f(by - 4.6)} ${f(ex)} ${f(ey - 2.4)} q 3.4 0.4 3.2 2.4 q -0.2 2 -3.4 2.2 Q ${f(cx + 10)} ${f(by + 0.8)} ${f(bx + 10)} ${f(by + 2.6)} Z`,
    };
    width = Math.max(width, ex + 3);
    height = y + ry + depth * 0.7;
    shadow = { cx, cy: height - 0.5, rx: saucerR * 0.92 };
  }

  // ring above the faceted band (beer mug)
  const base = model.facets ? `M ${f(facets[0].xt)} ${f(facetTop)} A ${f(cx - facets[0].xt)} ${f(eb)} 0 0 0 ${f(facets[facets.length - 1].xt)} ${f(facetTop)}` : undefined;

  return { model, width, height, cx, rt, rb, e, eb, h, body, handle: { d: hd, t: hp.t }, print, facets, facetTop, base, saucer, spoon, shadow };
}
