import { describe, expect, it } from 'vitest';
import { categories, defaultSelection, findProduct, rangeLabels, rub, type Selection } from './pricing';

const sel = (categoryId: string, productId: string, patch: Partial<Selection> & { options?: Selection['options'] } = {}) => {
  const p = findProduct(categoryId, productId)!;
  const base = defaultSelection(p);
  return { p, s: { ...base, ...patch, options: { ...base.options, ...(patch.options ?? {}) }, dims: { ...base.dims, ...(patch.dims ?? {}) } } };
};

describe('pricing', () => {
  it('every product quotes its default selection without errors', () => {
    for (const c of categories)
      for (const p of c.products) {
        const q = p.quote(defaultSelection(p));
        expect(q.total, `${c.id}/${p.id}`).toBeGreaterThan(0);
        expect(q.error, `${c.id}/${p.id}`).toBeUndefined();
        expect(p.table?.rows.length, `${c.id}/${p.id} table`).toBeGreaterThan(0);
      }
  });

  it('mugs use tiers 1–4 / 5–9 / 10–49 / 50–199 / 200+', () => {
    const { p, s } = sel('mugs', 'mug', { options: { variant: 'white' } });
    const at = (qty: number) => p.quote({ ...s, qty }).unit;
    expect([at(1), at(4), at(5), at(9), at(10), at(49), at(50), at(199), at(200)]).toEqual([650, 650, 450, 450, 350, 350, 315, 315, 250]);
    expect(p.quote({ ...sel('mugs', 'mug', { options: { variant: 'chameleon' } }).s, qty: 1 }).unit).toBe(1100);
  });

  it('t-shirt = blank + DTF print, extra prints at 70% and 50%', () => {
    const { p, s } = sel('textile', 'tshirt-unisex', { options: { print1: 'a4', print2: 'a6', print3: 'a6' }, qty: 1 });
    // 750 + 800 + 600*0.7 + 600*0.5
    expect(p.quote(s).unit).toBe(750 + 800 + 420 + 300);
    const q20 = p.quote({ ...s, options: { ...s.options, print2: 'none', print3: 'none' }, qty: 20 });
    expect(q20.unit).toBe(550 + 450);
    expect(q20.total).toBe(20 * 1000);
  });

  it('several prints are ranked by price: the dearest full, next −30%, rest −50%', () => {
    const { p, s } = sel('textile', 'own-item', { qty: 1, options: { print1: 'a6', print2: 'a3', print3: 'a4' } });
    const { p: p2, s: s2 } = sel('textile', 'own-item', { qty: 1, options: { print1: 'a3', print2: 'a4', print3: 'a6' } });
    // owner's example: 1100 + 800 −30% + 600 −50%
    expect(p.quote(s).total).toBe(1100 + 560 + 300);
    expect(p.quote(s).total).toBe(p2.quote(s2).total);
    expect(p.quote(s).breakdown.map((b) => b.label)).toEqual(['Печать DTF А3', 'Печать DTF А4 (−30%)', 'Печать DTF А6 (−50%)']);
  });

  it('coloured t-shirts need at least 10 pcs', () => {
    const { p, s } = sel('textile', 'tshirt-unisex', { options: { color: 'other' }, qty: 5 });
    expect(p.quote(s).error).toBeTruthy();
    expect(p.quote({ ...s, qty: 10 }).error).toBeUndefined();
  });

  it('hints the next cheaper tier', () => {
    const { p, s } = sel('mugs', 'mug', { qty: 3 });
    expect(p.quote(s).next).toEqual({ qty: 5, unit: 450 });
  });

  it('3D stickers respect the minimum order sum', () => {
    const { p, s } = sel('stickers', 'sticker-3d', { dims: { w: 2, h: 2 }, qty: 10 });
    expect(p.quote(s).total).toBe(2000);
    expect(p.quote({ ...s, qty: 200 }).total).toBe(2 * 2 * 5 * 200);
  });

  it('wide format is priced by area', () => {
    const { p, s } = sel('wide', 'wide-print', { dims: { w: 200, h: 100 }, options: { material: 'banner' }, qty: 2 });
    expect(p.quote(s).total).toBe(2 * 1300 * 2);
  });

  it('pocket calendars are priced per package', () => {
    const { p, s } = sel('calendars', 'cal-pocket', { qty: 300 });
    expect(p.quote(s).total).toBe(1795);
  });

  it('business cards: fixed runs below 500, any amount from 500', () => {
    const one = (qty: number) => { const { p, s } = sel('cards', 'business-cards', { qty }); return p.quote(s); };
    expect(one(96).total).toBe(595);
    expect(one(300).unit).toBe(4);
    expect(one(750).unit).toBe(3.5);
    expect(one(1000).unit).toBe(3.2);
    expect(one(6000).unit).toBe(2.4);
    const { p, s } = sel('cards', 'business-cards', { qty: 6000, options: { variant: 's2' } });
    expect(p.quote(s).unit).toBe(3.2);
    expect(p.table?.columns).toEqual(['96 шт', '200 шт', '300 шт', '500–999 шт', '1000–5999 шт', 'от 6000 шт']);
  });

  it('formats labels', () => {
    expect(rangeLabels([1, 5, 10, 50, 200])).toEqual(['1–4 шт', '5–9 шт', '10–49 шт', '50–199 шт', 'от 200 шт']);
    expect(rub(7.5).replace(/\s/g, ' ')).toBe('7,5 ₽');
    expect(rub(1100).replace(/\s/g, ' ')).toBe('1 100 ₽');
  });
});
