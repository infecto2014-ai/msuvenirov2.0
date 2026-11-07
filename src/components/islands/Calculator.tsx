import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  categories,
  defaultSelection,
  findCategory,
  rub,
  type Category,
  type OptionGroup,
  type Product,
  type QtyConfig,
  type Selection,
} from '@/data/pricing';
import { addToEstimate, FILES_EVENT, getOrderFiles, openOrder, setOrderFiles } from '@/lib/estimate';
import { ACCEPT, MAX_FILES, validateFiles } from '@/lib/order';
import { reachGoal } from '@/lib/metrika';
import { ProductIcon } from './productIcons';
import './Calculator.css';

interface Props {
  /** preselected category id */
  category?: string;
  /** preselected product id */
  product?: string;
  /** limit the category switcher to these ids; omit for all */
  only?: string[];
  /** hide the category switcher (landing pages) */
  hideCategories?: boolean;
  /** only the preselected product: no product switcher (garment pages) */
  lockProduct?: boolean;
  /** limit the product switcher to these product ids (e.g. two shoppers); omit for all products of the category */
  products?: string[];
  /** heading level text shown above the calculator */
  title?: string;
}

const SLIDER_STEPS = 1000;

/** Logarithmic slider: small quantities get most of the track. */
const toPos = (qty: number, min: number, max: number) => (max <= min ? 0 : Math.round((Math.log(qty / min) / Math.log(max / min)) * SLIDER_STEPS));
const toQty = (pos: number, min: number, max: number) => {
  const raw = min * Math.pow(max / min, pos / SLIDER_STEPS);
  const step = raw >= 1000 ? 50 : raw >= 200 ? 10 : raw >= 50 ? 5 : 1;
  return Math.min(max, Math.max(min, Math.round(raw / step) * step));
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));

/** Share of the slider given to fixed print runs when larger amounts are free (presets + freeFrom). */
const PRESET_SPAN = 0.4 * SLIDER_STEPS;

/** Slider position <-> quantity for every quantity mode: free, presets only, presets + free from N. */
const sliderMaxOf = (q: QtyConfig) => (q.presets && !q.freeFrom ? q.presets.length - 1 : SLIDER_STEPS);
const qtyToPos = (n: number, q: QtyConfig) => {
  if (!q.presets) return toPos(n, q.min, q.max);
  if (!q.freeFrom) return Math.max(0, q.presets.indexOf(n));
  if (n < q.freeFrom) return Math.round((Math.max(0, q.presets.indexOf(n)) * PRESET_SPAN) / q.presets.length);
  return Math.round(PRESET_SPAN + (toPos(n, q.freeFrom, q.max) / SLIDER_STEPS) * (SLIDER_STEPS - PRESET_SPAN));
};
const posToQty = (pos: number, q: QtyConfig) => {
  if (!q.presets) return toQty(pos, q.min, q.max);
  if (!q.freeFrom) return q.presets[pos];
  if (pos < PRESET_SPAN) return q.presets[Math.min(q.presets.length - 1, Math.round((pos / PRESET_SPAN) * q.presets.length))];
  return toQty(((pos - PRESET_SPAN) / (SLIDER_STEPS - PRESET_SPAN)) * SLIDER_STEPS, q.freeFrom, q.max);
};
/** Snap any number to an allowed quantity. */
const normalizeQty = (n: number, q: QtyConfig) => {
  const v = clamp(n, q.min, q.max);
  if (!q.presets) return v;
  if (q.freeFrom && v >= q.freeFrom) return v;
  return q.presets.find((x) => x >= v) ?? q.freeFrom ?? q.presets[q.presets.length - 1];
};
/** Next allowed quantity up (+1) or down (-1) for the stepper buttons. */
const stepQty = (n: number, dir: 1 | -1, q: QtyConfig) => {
  if (!q.presets || (q.freeFrom && n + dir >= q.freeFrom)) return clamp(n + dir, q.min, q.max);
  const list = q.freeFrom ? [...q.presets, q.freeFrom] : q.presets;
  const i = list.indexOf(n);
  return list[Math.min(list.length - 1, Math.max(0, (i < 0 ? list.length - 1 : i) + dir))];
};

const describe = (p: Product, s: Selection): string => {
  const parts: string[] = [];
  for (const g of p.options ?? []) {
    if (g.hideWhen && s.options[g.hideWhen.group] === g.hideWhen.value) continue;
    if (g.showWhen && s.options[g.showWhen.group] !== g.showWhen.value) continue;
    const v = s.options[g.id];
    if (g.type === 'one') {
      const c = g.choices.find((x) => x.id === v);
      if (c && c.id !== 'none') parts.push(g.id.startsWith('print') ? `${g.label.split(' ·')[0].replace(' (DTF)', '')}: ${c.label}` : c.label);
    } else if (Array.isArray(v) && v.length) {
      parts.push(
        g.choices
          .filter((c) => v.includes(c.id))
          .map((c) => c.label)
          .join(', '),
      );
    }
  }
  for (const d of p.dims ?? []) parts.push(`${d.label.toLowerCase()} ${s.dims[d.id]} ${d.unit}`);
  return parts.join(' · ');
};

export default function Calculator({ category, product, only, hideCategories, lockProduct, products, title }: Props) {
  const cats: Category[] = useMemo(() => (only ? categories.filter((c) => only.includes(c.id)) : categories), [only]);
  const [catId, setCatId] = useState(() => findCategory(category ?? '')?.id ?? cats[0].id);
  const cat = findCategory(catId) ?? cats[0];
  /** products offered in the switcher: the whole category or only the listed ids */
  const listOf = (c: Category) => {
    const l = products ? c.products.filter((p) => products.includes(p.id)) : c.products;
    return l.length ? l : c.products;
  };
  const list = listOf(cat);
  const [prodId, setProdId] = useState(() => list.find((p) => p.id === product)?.id ?? list[0].id);
  const prod = list.find((p) => p.id === prodId) ?? list[0];
  const showProducts = list.length > 1 && !lockProduct;
  const [sel, setSel] = useState<Selection>(() => defaultSelection(prod));
  /** what the customer typed for «Другой цвет» (owner, 07.11.2026: «человек должен указать нужный»); not part of the price */
  const [otherColor, setOtherColor] = useState('');
  /** files attached right here; the order form gets the same list */
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  useEffect(() => {
    setFiles(getOrderFiles());
    const on = (e: Event) => setFiles([...(e as CustomEvent<File[]>).detail]);
    window.addEventListener(FILES_EVENT, on);
    return () => window.removeEventListener(FILES_EVENT, on);
  }, []);
  const attach = (list: FileList | null) => {
    if (!list || !list.length) return;
    const next = [...getOrderFiles(), ...Array.from(list)].slice(0, MAX_FILES);
    const err = validateFiles(next);
    setFileError(err ?? '');
    if (!err) setOrderFiles(next);
  };
  const otherPicked = (prod.options ?? []).some((g) => sel.options[g.id] === 'other');
  const details = (() => {
    const d = describe(prod, sel);
    const c = otherColor.trim();
    return otherPicked && c ? d.replace('Другой цвет', `Другой цвет: ${c}`) : d;
  })();
  const [qtyText, setQtyText] = useState(String(sel.qty));
  const [toast, setToast] = useState('');
  // phone: the compact total bar hides while the full result panel is on screen
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultSeen, setResultSeen] = useState(false);
  useEffect(() => {
    const el = resultRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setResultSeen(e.isIntersecting), { rootMargin: '0px 0px -96px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // read ?calc=category:product from the URL (links from cards and landing pages)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('calc');
    if (!q) return;
    const [c, p] = q.split(':');
    const fc = findCategory(c);
    if (fc && (!only || only.includes(fc.id))) {
      setCatId(fc.id);
      const fl = listOf(fc);
      const fp = fl.find((x) => x.id === p) ?? fl[0];
      setProdId(fp.id);
      const s = defaultSelection(fp);
      setSel(s);
      setQtyText(String(s.qty));
    }
  }, []);

  const pickCategory = (id: string) => {
    const c = findCategory(id)!;
    setCatId(id);
    const first = listOf(c)[0];
    setProdId(first.id);
    const s = defaultSelection(first);
    setSel(s);
    setQtyText(String(s.qty));
  };

  const pickProduct = (p: Product) => {
    setProdId(p.id);
    const s = defaultSelection(p);
    setSel(s);
    setQtyText(String(s.qty));
  };

  // the smallest run can depend on the size (stickers: minimum order sum, rounded up to tens)
  const qcfg = useMemo(() => (prod.minQty ? { ...prod.qty, min: Math.min(prod.qty.max, prod.minQty(sel)) } : prod.qty), [prod, sel.dims, sel.options]);
  useEffect(() => {
    if (sel.qty < qcfg.min) {
      setSel((s) => ({ ...s, qty: qcfg.min }));
      setQtyText(String(qcfg.min));
    }
  }, [qcfg.min]);

  const setQty = (n: number) => {
    const q = normalizeQty(n, qcfg);
    setSel((s) => ({ ...s, qty: q }));
    setQtyText(String(q));
  };

  const setOption = (groupId: string, value: string, multi: boolean) =>
    setSel((s) => {
      if (!multi) {
        // a choice with a minimum run in its hint («Другой цвет — от 10 шт») lifts the quantity to that minimum
        const hint = prod.options?.find((g) => g.id === groupId)?.choices.find((c) => c.id === value)?.hint ?? '';
        const need = Number(hint.match(/от\s+(\d+)\s*шт/)?.[1] ?? 0);
        const qty = need && s.qty < need ? need : s.qty;
        if (qty !== s.qty) setQtyText(String(qty));
        return { ...s, qty, options: { ...s.options, [groupId]: value } };
      }
      const cur = Array.isArray(s.options[groupId]) ? (s.options[groupId] as string[]) : [];
      return {
        ...s,
        options: {
          ...s.options,
          [groupId]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value],
        },
      };
    });

  const quote = useMemo(() => prod.quote(sel), [prod, sel]);

  const { min, max, presets, freeFrom } = qcfg;
  const sliderMax = sliderMaxOf(qcfg);
  const sliderVal = qtyToPos(sel.qty, qcfg);
  // stickers on the quantity bar: where the price per piece drops and by how much
  const ladder = useMemo(() => prod.ladder?.(sel) ?? [], [prod, sel]);
  const stickers = (() => {
    const top = ladder[0]?.price ?? 0;
    const out: { qty: number; pct: number; save: number; row: number }[] = [];
    const lastAt = [-1, -1]; // where the last sticker of each row stands
    const GAP = 0.13; // the least distance between two stickers in one row
    for (const t of ladder.slice(1)) {
      const pct = qtyToPos(t.from, qcfg) / sliderMax;
      const save = top > 0 ? Math.round((1 - t.price / top) * 100) : 0;
      if (save <= 0 || pct > 1) continue;
      const prev = out[out.length - 1];
      // a sticker only where the discount really grows (the same «−20%» twice looked like a mistake)
      if (prev && save <= prev.save) continue;
      if (prev && pct - prev.pct < 0.04) continue; // practically the same place
      // close neighbours go to a second, higher row; if both rows are taken there, skip it
      const row = lastAt[0] < 0 || pct - lastAt[0] >= GAP ? 0 : lastAt[1] < 0 || pct - lastAt[1] >= GAP ? 1 : -1;
      if (row < 0) continue;
      lastAt[row] = pct;
      out.push({ qty: t.from, pct, save, row });
    }
    return out;
  })();

  const add = (thenOrder: boolean) => {
    if (quote.error) return;
    addToEstimate({
      title: prod.name,
      details,
      qty: sel.qty,
      unitPrice: quote.unit,
      total: quote.total,
      from: quote.from,
      calc: { cat: cat.id, product: prod.id, sel },
    });
    reachGoal(thenOrder ? 'calc_order' : 'calc_add', {
      product: prod.id,
      total: quote.total,
    });
    if (thenOrder) openOrder({ source: 'calculator' });
    else {
      setToast(`${prod.name} — в смете`);
      setTimeout(() => setToast(''), 2600);
    }
  };

  const fromLabel = (p: Product) => `от ${rub(p.fromPrice)}${p.fromUnit ? `/${p.fromUnit}` : ''}`;

  return (
    <div class="calc">
      {title && <h2 class="calc-title">{title}</h2>}

      {!hideCategories && cats.length > 1 && (
        <div class="calc-cats" role="tablist" aria-label="Категория">
          {cats.map((c) => (
            <button
              type="button"
              role="tab"
              aria-selected={c.id === catId}
              class={`calc-cat${c.id === catId ? ' is-active' : ''}`}
              onClick={() => pickCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div class="calc-grid">
        <div class="calc-config">
          {showProducts && (
            <fieldset class="calc-group">
              <legend class="calc-legend">
                <span class="calc-step">1</span> Изделие
              </legend>
              <div class="calc-products">
                {list.map((p) => (
                  <button
                    type="button"
                    class={`calc-product${p.id === prod.id ? ' is-active' : ''}`}
                    aria-pressed={p.id === prod.id}
                    onClick={() => pickProduct(p)}
                  >
                    <span class="calc-product-ico" aria-hidden="true">
                      <ProductIcon id={p.id} cat={cat.id} />
                    </span>
                    <span class="calc-product-text">
                      <span class="calc-product-name">{p.name}</span>
                      <span class="calc-product-from">{fromLabel(p)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {(() => {
            // Extra prints (addable groups) are hidden until the customer adds them; numbering follows the visible groups.
            const groups = prod.options ?? [];
            const hidden = (g: OptionGroup) =>
              (!!g.hideWhen && sel.options[g.hideWhen.group] === g.hideWhen.value) || (!!g.showWhen && sel.options[g.showWhen.group] !== g.showWhen.value);
            const isOn = (g: OptionGroup) => !hidden(g) && (!g.addable || (sel.options[g.id] ?? 'none') !== 'none');
            const visible = groups.filter(isOn);
            const nextAdd = groups.find((g) => g.addable && !hidden(g) && !isOn(g));
            const addGroup = (g: OptionGroup) => setOption(g.id, g.choices.find((c) => c.id !== 'none')!.id, false);
            const removeGroup = (g: OptionGroup) =>
              setSel((s) => {
                // shift the following extra prints up so the filled ones stay first
                const add = groups.filter((x) => x.addable);
                const vals = add.map((x) => s.options[x.id] ?? 'none').filter((v, i) => add[i].id !== g.id && v !== 'none');
                const next = { ...s.options };
                add.forEach((x, i) => (next[x.id] = vals[i] ?? 'none'));
                return { ...s, options: next };
              });
            const first = showProducts ? 2 : 1;
            return (
              <>
                {visible.map((g, vi) => (
                  <fieldset class="calc-group" key={`${prod.id}-${g.id}`}>
                    <legend class="calc-legend">
                      <span class="calc-step">{vi + first}</span> {g.label}
                      {g.addable && (
                        <button type="button" class="calc-remove" onClick={() => removeGroup(g)}>
                          Убрать
                        </button>
                      )}
                    </legend>
                    <div
                      class={`calc-chips calc-seg calc-tone-${(vi + first) % 3}${g.choices.every((c) => c.id === 'none' || c.label.length <= 3) ? ' calc-chips-short' : g.choices.length >= 5 ? ' calc-seg-grid' : ''}`}
                    >
                      {g.choices
                        .filter((c) => !(g.addable && c.id === 'none'))
                        .map((c) => {
                          const v = sel.options[g.id];
                          const on = g.type === 'many' ? Array.isArray(v) && v.includes(c.id) : v === c.id;
                          return (
                            <button type="button" class="chip" aria-pressed={on} onClick={() => setOption(g.id, c.id, g.type === 'many')}>
                              {(() => {
                                // print formats («10×15 см»): a tiny sheet drawn to scale, A3 ≈ 26 px tall
                                const m = c.hint?.match(/(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)\s*см/);
                                if (!m) return null;
                                const [w, h] = [parseFloat(m[1].replace(',', '.')), parseFloat(m[2].replace(',', '.'))];
                                const k = 26 / 38;
                                return <span class="calc-size" style={{ width: `${Math.max(6, w * k)}px`, height: `${Math.max(8, h * k)}px` }} aria-hidden="true" />;
                              })()}
                              {c.swatch && <span class="calc-swatch" style={{ background: c.swatch }} aria-hidden="true" />}
                              {g.type === 'many' && <span class={`calc-check${on ? ' on' : ''}`} aria-hidden="true" />}
                              <span>{c.label}</span>
                              {c.hint && <small>{c.hint}</small>}
                            </button>
                          );
                        })}
                    </div>
                    {sel.options[g.id] === 'other' && (
                      <label class="calc-other">
                        <span>Какой цвет нужен?</span>
                        <input
                          class="input"
                          type="text"
                          maxLength={60}
                          placeholder="например, бордовый или как на фото"
                          value={otherColor}
                          onInput={(e) => setOtherColor((e.target as HTMLInputElement).value)}
                        />
                      </label>
                    )}
                  </fieldset>
                ))}
                {nextAdd && (
                  <button type="button" class="calc-add" onClick={() => addGroup(nextAdd)}>
                    <span aria-hidden="true">+</span> Добавить принт
                    <small>{nextAdd.label.includes('сублимация') ? `${nextAdd.label.split(' ·')[0].toLowerCase()} — по цене выбранного формата` : `${nextAdd.label.toLowerCase()} — дешевле: −30% / −50%`}</small>
                  </button>
                )}
              </>
            );
          })()}

          {prod.dims && (
            <fieldset class="calc-group">
              <legend class="calc-legend">
                <span class="calc-step">✎</span> Размер одного изделия
              </legend>
              <div class="calc-dims">
                {prod.dims.map((d) => (
                  <label class="field">
                    <span class="label">
                      {d.label}, {d.unit}
                    </span>
                    <input
                      class="input"
                      type="number"
                      inputMode="decimal"
                      min={d.min}
                      max={d.max}
                      step="0.5"
                      value={sel.dims[d.id]}
                      onInput={(e) => {
                        const n = Number((e.target as HTMLInputElement).value);
                        if (Number.isFinite(n) && n > 0)
                          setSel((s) => ({
                            ...s,
                            dims: { ...s.dims, [d.id]: Math.min(d.max, n) },
                          }));
                      }}
                      onBlur={(e) => {
                        const n = Number((e.target as HTMLInputElement).value);
                        setSel((s) => ({
                          ...s,
                          dims: {
                            ...s.dims,
                            [d.id]: Math.min(d.max, Math.max(d.min, Number.isFinite(n) ? n : d.default)),
                          },
                        }));
                      }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset class="calc-group">
            <legend class="calc-legend">
              <span class="calc-step">#</span> Количество
            </legend>
            <div class="calc-qty">
              <div class="calc-stepper">
                <button type="button" aria-label="Меньше" onClick={() => setQty(stepQty(sel.qty, -1, qcfg))} disabled={sel.qty <= min}>
                  −
                </button>
                <input
                  class="calc-qty-input"
                  type="number"
                  inputMode="numeric"
                  aria-label="Количество, шт"
                  min={min}
                  max={max}
                  value={qtyText}
                  onInput={(e) => {
                    const t = (e.target as HTMLInputElement).value;
                    setQtyText(t);
                    const n = Number(t);
                    if (Number.isFinite(n) && n >= min && (!presets || (freeFrom && n >= freeFrom)))
                      setSel((s) => ({ ...s, qty: clamp(n, min, max) }));
                  }}
                  onBlur={() => setQty(Number(qtyText) || min)}
                />
                <span class="calc-qty-unit">шт</span>
                <button type="button" aria-label="Больше" onClick={() => setQty(stepQty(sel.qty, 1, qcfg))} disabled={sel.qty >= max}>
                  +
                </button>
              </div>
              <div class={`calc-slider-wrap${stickers.length ? ' has-stickers' : ''}${stickers.some((x) => x.row) ? ' two-rows' : ''}`}>
                {stickers.map((st) => (
                  <button
                    type="button"
                    class={`calc-sticker${sel.qty >= st.qty ? ' on' : ''}${st.row ? ' up' : ''}`}
                    style={{ left: `calc(15px + (100% - 30px) * ${st.pct})` }}
                    onClick={() => setQty(st.qty)}
                    aria-label={`От ${st.qty} шт — дешевле на ${st.save}%`}
                    title={`от ${st.qty} шт`}
                  >
                    −{st.save}%
                  </button>
                ))}
                <input
                  class="calc-slider"
                  type="range"
                  aria-label="Количество"
                  min={0}
                  max={sliderMax}
                  value={sliderVal}
                  style={{ '--p': `${(sliderVal / sliderMax) * 100}%` }}
                  onInput={(e) => {
                    const pos = Number((e.target as HTMLInputElement).value);
                    setQty(posToQty(pos, qcfg));
                  }}
                />
              </div>
              <div class="calc-slider-scale" aria-hidden="true">
                <span>{min.toLocaleString('ru-RU')}</span>
                <span>
                  {max.toLocaleString('ru-RU')}
                  {qcfg.individualAbove && ' · больше — цена индивидуально'}
                  {qcfg.moreIn && ` · больше — ${qcfg.moreIn.label}`}
                </span>
              </div>
            </div>
            {presets && (
              <div class="calc-chips calc-seg calc-presets">
                {presets.map((q) => (
                  <button type="button" class="chip" aria-pressed={q === sel.qty} onClick={() => setQty(q)}>
                    {q.toLocaleString('ru-RU')} шт
                  </button>
                ))}
              </div>
            )}
            {!quote.next && !quote.error && qcfg.individualAbove && ladder.length > 1 && sel.qty >= ladder[ladder.length - 1].from && (
              // the best price is reached: tell about larger runs (clothing: more than 50 pcs is priced individually)
              <button type="button" class="calc-boost calc-boost-ink" data-order={`Индивидуальный расчёт: ${prod.name}, больше ${max} шт`}>
                <span class="calc-boost-pct mono">{max}+</span>
                <span class="calc-boost-text">
                  <span>
                    Нужно <b>больше {max} шт</b>? Цену рассчитаем индивидуально
                  </span>
                  <small>Нажмите, чтобы отправить заявку — менеджер посчитает ваш тираж</small>
                </span>
              </button>
            )}
            {!quote.next &&
              !quote.error &&
              qcfg.moreIn &&
              sel.qty >= max &&
              (() => {
                // more than the set allows: switch to the product that takes larger runs
                const more = qcfg.moreIn!;
                const target = list.find((x) => x.id === more.product);
                if (!target) return null;
                return (
                  <button
                    type="button"
                    class="calc-boost calc-boost-ink"
                    onClick={() => {
                      pickProduct(target);
                      if (more.dims) setSel((s) => ({ ...s, dims: { ...s.dims, ...more.dims } }));
                    }}
                  >
                    <span class="calc-boost-pct mono">{max}+</span>
                    <span class="calc-boost-text">
                      <span>
                        Нужно <b>больше {max} шт</b>? Считайте как «{target.name}»
                      </span>
                      <small>Нажмите — калькулятор переключится</small>
                    </span>
                  </button>
                );
              })()}
            {quote.next &&
              !quote.error &&
              (() => {
                // bright hint under the slider: how many more pieces to the next, cheaper price
                const n = quote.next!;
                const more = n.qty - sel.qty;
                const pct = quote.unit > 0 ? Math.round((1 - n.unit / quote.unit) * 100) : 0;
                const fixedRun = presets && n.qty < (freeFrom ?? Infinity);
                return (
                  <button type="button" class="calc-boost" onClick={() => setQty(n.qty)}>
                    <span class="calc-boost-pct mono">−{pct}%</span>
                    <span class="calc-boost-text">
                      <span>
                        {fixedRun ? (
                          <>
                            Возьмите <b>{n.qty.toLocaleString('ru-RU')} шт</b> — и каждая будет на {pct}% дешевле
                          </>
                        ) : (
                          <>
                            Ещё <b>{more.toLocaleString('ru-RU')} шт</b> — и цена за штуку будет на {pct}% дешевле
                          </>
                        )}
                      </span>
                      <small>
                        <span class="mono">{rub(n.unit)}</span> вместо <span class="mono">{rub(quote.unit)}</span> · нажмите, чтобы выбрать
                      </small>
                    </span>
                  </button>
                );
              })()}
          </fieldset>

          {/* phone only (hidden on desktop by CSS): compact total stuck above the site's bottom bar */}
          <div class={`calc-dock${resultSeen ? ' is-off' : ''}`} aria-hidden="true">
            <div class="calc-dock-bar">
              <button type="button" class="calc-dock-sum" tabIndex={-1} onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <small>Итого за {sel.qty.toLocaleString('ru-RU')} шт</small>
                <b class="mono">
                  {quote.from ? 'от ' : ''}
                  {quote.error ? '—' : rub(quote.total)}
                </b>
              </button>
              <button type="button" class="btn btn-magenta" tabIndex={-1} disabled={!!quote.error} onClick={() => add(true)}>
                Заказать
              </button>
            </div>
          </div>
        </div>

        <aside class="calc-result" aria-live="polite">
          <div class="calc-result-inner" ref={resultRef}>
            <div class="calc-result-head">
              <span class="calc-result-name">{prod.name}</span>
              <span class="colorbar" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            <p class="calc-result-desc">{details || prod.short}</p>

            <dl class="calc-sum">
              <div>
                <dt>За штуку</dt>
                <dd class="mono">
                  {quote.from ? 'от ' : ''}
                  {rub(quote.unit)}
                </dd>
              </div>
              <div class="calc-total">
                <dt>Итого за {sel.qty.toLocaleString('ru-RU')} шт</dt>
                <dd class="mono">
                  {quote.from && <small class="calc-from">от </small>}
                  {rub(quote.total)}
                </dd>
              </div>
            </dl>

            {quote.breakdown.length > 1 && (
              <ul class="calc-breakdown">
                {quote.breakdown.map((b) => (
                  <li>
                    <span>{b.label}</span>
                    <span class="mono">
                      {rub(b.amount)}
                      {b.per === 'шт' ? '/шт' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {quote.error && (
              <p class="calc-error" role="alert">
                {quote.error}
              </p>
            )}
            {quote.notes.map((n) => (
              <p class="calc-note">{n}</p>
            ))}

            <div class="calc-actions">
              <button type="button" class="btn btn-magenta btn-block" disabled={!!quote.error} onClick={() => add(true)}>
                Заказать
              </button>
              <button type="button" class="btn btn-yellow btn-block" disabled={!!quote.error} onClick={() => add(false)}>
                + В смету
              </button>
            </div>
            <div class="calc-files">
              <label class="calc-attach">
                <input type="file" multiple accept={ACCEPT} class="sr-only" onChange={(e) => {
                  attach((e.target as HTMLInputElement).files);
                  (e.target as HTMLInputElement).value = '';
                }} />
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <span>{files.length ? 'Добавить ещё файл' : 'Прикрепить макет или фото'}</span>
              </label>
              {fileError && <p class="calc-files-err" role="alert">{fileError}</p>}
              {files.length > 0 && (
                <ul class="calc-files-list">
                  {files.map((f, i) => (
                    <li>
                      <span>{f.name}</span>
                      <button type="button" aria-label={`Убрать файл ${f.name}`} onClick={() => setOrderFiles(files.filter((_, j) => j !== i))}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {files.length > 0 && <p class="calc-files-note">Файлы уйдут вместе с заявкой</p>}
            </div>
            <p class="calc-fine">Без наценки за срочность. Макет поможем подготовить бесплатно.</p>
          </div>
        </aside>
      </div>

      <div class={`calc-toast${toast ? ' show' : ''}`} role="status">
        {toast}
        {toast && (
          <button type="button" onClick={() => openOrder({ source: 'toast' })}>
            Открыть смету
          </button>
        )}
      </div>
    </div>
  );
}
