// Print-zone configurator data: garment silhouettes (flat outline drawings) and the places we print on.
// Used by src/components/islands/PrintZones.tsx. Prices are NOT here — they come from src/data/pricing.ts.
//
// Coordinates are SVG viewBox units. Every silhouette has a real width in cm (`widthCm`) and the same
// width in viewBox units (`bodyWidth`), so print formats are drawn to scale: A4 on a T-shirt looks
// as big as it will be on the real item.

import { dtfPrint } from './pricing';
import type { GarmentInfo } from './types';

export type Silhouette = GarmentInfo['silhouette'];
export type PrintFormat = keyof typeof dtfPrint;

export interface SilhouettePart {
  /** SVG path data */
  d: string;
  /**
   * body  — filled with the garment colour, ink outline
   * rib   — cuffs, hems: slightly darker fill, ink outline
   * shade — inside of the garment seen through an opening (no outline)
   * strap — bag handle: thick ink line with a garment-coloured core
   * line  — seam / detail, thin line
   * dash  — stitching, dashed line
   */
  kind: 'body' | 'rib' | 'shade' | 'strap' | 'line' | 'dash';
}

export interface SilhouetteSide {
  id: string;
  /** tab label: «Спереди», «Сзади», «Сторона 1» */
  label: string;
  parts: SilhouettePart[];
  /** dimension line under the item: from x1 to x2 at height y (viewBox units) */
  measure?: { x1: number; x2: number; y: number };
}

export interface PrintZone {
  id: string;
  label: string;
  /** id of the side (view) where the zone is */
  side: string;
  /** zone centre: the «+» marker and the centre of the print */
  x: number;
  y: number;
  /** prints hang from this line (e.g. 4–5 cm under the collar) instead of being centred on y */
  top?: number;
  /** turn the print, degrees clockwise (sleeves) */
  rotate?: number;
  /** print lies landscape (wide), e.g. under the collar or on a cap */
  landscape?: boolean;
  /** formats possible on this place; the final list is this ∩ formats of the product in pricing.ts */
  formats: PrintFormat[];
  /** the place is smaller than the format: the print is limited to w×h cm (cap) */
  maxCm?: [number, number];
  /** zones that overlap this one when both are printed */
  overlaps?: string[];
}

export interface SilhouetteDef {
  id: Silhouette;
  /** what is drawn, for screen readers: «Футболка» */
  name: string;
  /** SVG viewBox: x, y, width, height */
  viewBox: [number, number, number, number];
  /** real width of the item, cm (chest width laid flat; bag width; cap across the forehead) */
  widthCm: number;
  /** the same width in viewBox units */
  bodyWidth: number;
  /** another real width for some products drawn with this silhouette (kids T-shirt is narrower) */
  widthCmByProduct?: Record<string, number>;
  /** fill colour when the product has no colour choice */
  fill: string;
  sides: SilhouetteSide[];
  zones: PrintZone[];
  /** print preselected when the configurator opens */
  initial: { zone: string; format: PrintFormat };
  /** a short line under the format chips, e.g. about the cap print area */
  note?: string;
}

/** Format size in cm, portrait [w, h] — parsed from dtfPrint in pricing.ts ("21×30 см"). */
export const formatCm = (f: PrintFormat): [number, number] => {
  const m = dtfPrint[f].size.match(/(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)/);
  return m ? [Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.'))] : [10, 15];
};

/** viewBox units per cm for a product drawn with this silhouette. */
export const unitsPerCm = (def: SilhouetteDef, productId?: string) =>
  def.bodyWidth / ((productId && def.widthCmByProduct?.[productId]) || def.widthCm);

/** Size of a print on the drawing: width/height in viewBox units and the real size in cm. */
export const printBox = (def: SilhouetteDef, zone: PrintZone, f: PrintFormat, productId?: string) => {
  let [w, h] = formatCm(f);
  if (zone.landscape) [w, h] = [h, w];
  if (zone.maxCm) {
    w = Math.min(w, zone.maxCm[0]);
    h = Math.min(h, zone.maxCm[1]);
  }
  const k = unitsPerCm(def, productId);
  const cx = zone.x;
  const cy = zone.top !== undefined && !zone.rotate ? zone.top + (h * k) / 2 : zone.y;
  return { w: w * k, h: h * k, cx, cy, cmW: w, cmH: h, limited: !!zone.maxCm };
};

// ---------------------------------------------------------------- T-shirt (52 cm chest, 3.85 units per cm)

const teeOutline = (neck: string) =>
  `M166,52 L106,68 L42,124 L84,172 L102,152 L100,340 Q200,348 300,340 L298,152 L316,172 L358,124 L294,68 L234,52 ${neck} Z`;

const teeCommon: SilhouettePart[] = [
  { kind: 'line', d: 'M106,68 Q111,110 102,152 M294,68 Q289,110 298,152' },
  { kind: 'dash', d: 'M49,118 L90,165 M351,118 L310,165' },
  { kind: 'dash', d: 'M101,329 Q200,337 299,329' },
];

const tshirt: SilhouetteDef = {
  id: 'tshirt',
  name: 'Футболка',
  viewBox: [20, 30, 360, 360],
  widthCm: 52,
  bodyWidth: 200,
  widthCmByProduct: { 'tshirt-kids': 40, oversize: 60 },
  fill: '#ffffff',
  sides: [
    {
      id: 'front',
      label: 'Спереди',
      measure: { x1: 100, x2: 300, y: 366 },
      parts: [
        { kind: 'body', d: teeOutline('Q200,100 166,52') },
        { kind: 'shade', d: 'M168,53 Q200,66 232,53 Q200,96 168,53 Z' },
        { kind: 'line', d: 'M159,55 Q200,113 241,55' },
        ...teeCommon,
      ],
    },
    {
      id: 'back',
      label: 'Сзади',
      measure: { x1: 100, x2: 300, y: 366 },
      parts: [
        { kind: 'body', d: teeOutline('Q200,66 166,52') },
        { kind: 'line', d: 'M160,55 Q200,74 240,55' },
        ...teeCommon,
      ],
    },
  ],
  zones: [
    { id: 'chest', label: 'Грудь по центру', side: 'front', x: 200, y: 160, top: 92, formats: ['a6', 'a5', 'a4', 'a3'], overlaps: ['left-chest'] },
    { id: 'left-chest', label: 'Левая грудь (логотип)', side: 'front', x: 246, y: 132, formats: ['a6'], overlaps: ['chest'] },
    { id: 'left-sleeve', label: 'Левый рукав', side: 'front', x: 324, y: 128, rotate: 43, formats: ['a6'] },
    { id: 'right-sleeve', label: 'Правый рукав', side: 'front', x: 76, y: 128, rotate: -43, formats: ['a6'] },
    { id: 'back', label: 'Спина', side: 'back', x: 200, y: 170, top: 80, formats: ['a6', 'a5', 'a4', 'a3'], overlaps: ['nape'] },
    { id: 'nape', label: 'Под воротником', side: 'back', x: 200, y: 92, landscape: true, formats: ['a6'], overlaps: ['back'] },
  ],
  initial: { zone: 'chest', format: 'a4' },
};

// ---------------------------------------------------------------- Hoodie (58 cm chest, 2.93 units per cm)

const hoodieOutline = (neck: string) =>
  `M166,92 L118,104 L18,246 L54,271 L115,200 L117,314 L283,314 L285,200 L346,271 L382,246 L282,104 L234,92 ${neck} Z`;

const hoodieCommon: SilhouettePart[] = [
  { kind: 'rib', d: 'M20,247 L52,270 L43,284 L10,261 Z M380,247 L348,270 L357,284 L390,261 Z' },
  { kind: 'rib', d: 'M117,311 L283,311 L281,332 L119,332 Z' },
  { kind: 'line', d: 'M118,104 L115,200 M282,104 L285,200' },
];

const hoodie: SilhouetteDef = {
  id: 'hoodie',
  name: 'Худи',
  viewBox: [0, 0, 400, 370],
  widthCm: 58,
  bodyWidth: 170,
  fill: '#e4dfd5',
  sides: [
    {
      id: 'front',
      label: 'Спереди',
      measure: { x1: 115, x2: 285, y: 354 },
      parts: [
        { kind: 'body', d: 'M156,100 C140,50 168,14 200,14 C232,14 260,50 244,100 Z' },
        { kind: 'shade', d: 'M172,98 C166,66 182,42 200,42 C218,42 234,66 228,98 Z' },
        { kind: 'body', d: hoodieOutline('Q200,140 166,92') },
        ...hoodieCommon,
        { kind: 'body', d: 'M160,236 L240,236 Q244,272 262,300 L138,300 Q156,272 160,236 Z' },
        { kind: 'dash', d: 'M163,243 L237,243' },
        { kind: 'line', d: 'M186,113 L183,168 M214,113 L217,168' },
        { kind: 'line', d: 'M180,170 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M214,170 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0' },
      ],
    },
    {
      id: 'back',
      label: 'Сзади',
      measure: { x1: 115, x2: 285, y: 354 },
      parts: [
        { kind: 'body', d: hoodieOutline('Q200,100 166,92') },
        ...hoodieCommon,
        { kind: 'body', d: 'M150,106 C134,48 166,12 200,12 C234,12 266,48 250,106 Q200,122 150,106 Z' },
        { kind: 'dash', d: 'M200,16 L200,112' },
      ],
    },
  ],
  zones: [
    { id: 'chest', label: 'Грудь по центру', side: 'front', x: 200, y: 175, top: 128, formats: ['a6', 'a5', 'a4'], overlaps: ['left-chest'] },
    { id: 'left-chest', label: 'Левая грудь (логотип)', side: 'front', x: 242, y: 152, formats: ['a6'], overlaps: ['chest'] },
    { id: 'left-sleeve', label: 'Левый рукав', side: 'front', x: 322, y: 205, rotate: -37, formats: ['a6'] },
    { id: 'right-sleeve', label: 'Правый рукав', side: 'front', x: 78, y: 205, rotate: 37, formats: ['a6'] },
    { id: 'back', label: 'Спина', side: 'back', x: 200, y: 190, top: 130, formats: ['a6', 'a5', 'a4', 'a3'] },
    { id: 'hood', label: 'Капюшон', side: 'back', x: 200, y: 58, formats: ['a6'] },
  ],
  initial: { zone: 'chest', format: 'a4' },
  note: 'Спереди над карманом помещается до А4, на спине — до А3.',
};

// ---------------------------------------------------------------- Shopper (38 cm wide, 5 units per cm)

const shopperParts: SilhouettePart[] = [
  { kind: 'strap', d: 'M152,152 C150,34 250,34 248,152' },
  { kind: 'body', d: 'M105,150 L295,150 L295,358 Q295,364 289,364 L111,364 Q105,364 105,358 Z' },
  { kind: 'strap', d: 'M140,160 C136,24 264,24 260,160' },
  { kind: 'dash', d: 'M106,168 L294,168' },
  { kind: 'line', d: 'M133,152 h14 v16 h-14 Z M133,152 l14,16 M147,152 l-14,16 M253,152 h14 v16 h-14 Z M253,152 l14,16 M267,152 l-14,16' },
];

const shopper: SilhouetteDef = {
  id: 'shopper',
  name: 'Шоппер',
  viewBox: [30, 30, 340, 370],
  widthCm: 38,
  bodyWidth: 190,
  fill: '#f1e7cf',
  sides: [
    { id: 'side1', label: 'Сторона 1', parts: shopperParts, measure: { x1: 105, x2: 295, y: 386 } },
    { id: 'side2', label: 'Сторона 2', parts: shopperParts, measure: { x1: 105, x2: 295, y: 386 } },
  ],
  zones: [
    { id: 'side1', label: 'Сторона 1', side: 'side1', x: 200, y: 266, formats: ['a6', 'a5', 'a4'] },
    { id: 'side2', label: 'Сторона 2', side: 'side2', x: 200, y: 266, formats: ['a6', 'a5', 'a4'] },
  ],
  initial: { zone: 'side1', format: 'a4' },
};

// ---------------------------------------------------------------- Cap (18 cm across the forehead, 12 units per cm)

const cap: SilhouetteDef = {
  id: 'cap',
  name: 'Бейсболка',
  viewBox: [20, 70, 360, 290],
  widthCm: 18,
  bodyWidth: 216,
  fill: '#ffffff',
  sides: [
    {
      id: 'front',
      label: 'Спереди',
      measure: { x1: 92, x2: 308, y: 336 },
      parts: [
        { kind: 'body', d: 'M92,262 C92,150 128,104 200,102 C272,104 308,150 308,262 Z' },
        { kind: 'line', d: 'M200,102 C162,120 130,180 126,262 M200,102 C238,120 270,180 274,262' },
        { kind: 'line', d: 'M106,170 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 M286,170 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0' },
        { kind: 'body', d: 'M194,101 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0' },
        { kind: 'body', d: 'M88,256 Q200,243 312,256 Q323,270 299,285 Q200,310 101,285 Q77,270 88,256 Z' },
        { kind: 'dash', d: 'M102,276 Q200,298 298,276' },
      ],
    },
    {
      id: 'side',
      label: 'Сбоку',
      parts: [
        { kind: 'body', d: 'M120,262 C116,160 170,108 236,110 C300,112 330,170 332,262 Z' },
        { kind: 'shade', d: 'M298,262 C300,238 322,232 331,246 L332,262 Z' },
        { kind: 'line', d: 'M236,110 C210,150 196,210 196,262 M236,110 C262,150 280,200 284,262' },
        { kind: 'line', d: 'M234,152 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0' },
        { kind: 'body', d: 'M230,109 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0' },
        { kind: 'body', d: 'M128,240 C96,242 58,254 36,274 C32,282 40,288 56,288 C92,288 126,278 150,262 Z' },
        { kind: 'dash', d: 'M50,279 C84,278 114,268 138,256' },
      ],
    },
  ],
  zones: [
    { id: 'front', label: 'Лоб', side: 'front', x: 200, y: 200, landscape: true, maxCm: [11, 6], formats: ['a6'] },
    { id: 'side', label: 'Бок', side: 'side', x: 240, y: 212, landscape: true, maxCm: [6, 4], formats: ['a6'] },
  ],
  initial: { zone: 'front', format: 'a6' },
  note: 'На кепке печатаем по цене А6: спереди — до 11×6 см, сбоку — до 6×4 см.',
};

export const silhouettes: Record<Silhouette, SilhouetteDef> = { tshirt, hoodie, shopper, cap };
