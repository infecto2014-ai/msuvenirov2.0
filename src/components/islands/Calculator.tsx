import { useEffect, useMemo, useState } from 'preact/hooks';
import {
  categories,
  defaultSelection,
  findCategory,
  rub,
  qtyLabels,
  type Category,
  type OptionGroup,
  type Product,
  type QtyConfig,
  type Selection,
} from '@/data/pricing';
import { addToEstimate, openOrder } from '@/lib/estimate';
import { reachGoal } from '@/lib/metrika';
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
  /** heading level text shown above the calculator */
  title?: string;
}

const SLIDER_STEPS = 1000;

/** Logarithmic slider: small quantities get most of the track. */
const toPos = (qty: number, min: number, max: number) =>
  max <= min ? 0 : Math.round((Math.log(qty / min) / Math.log(max / min)) * SLIDER_STEPS);
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
    const v = s.options[g.id];
    if (g.type === 'one') {
      const c = g.choices.find((x) => x.id === v);
      if (c && c.id !== 'none') parts.push(g.id.startsWith('print') ? `${g.label.split(' ·')[0].replace(' (DTF)', '')}: ${c.label}` : c.label);
    } else if (Array.isArray(v) && v.length) {
      parts.push(g.choices.filter((c) => v.includes(c.id)).map((c) => c.label).join(', '));
    }
  }
  for (const d of p.dims ?? []) parts.push(`${d.label.toLowerCase()} ${s.dims[d.id]} ${d.unit}`);
  return parts.join(' · ');
};

export default function Calculator({ category, product, only, hideCategories, lockProduct, title }: Props) {
  const cats: Category[] = useMemo(() => (only ? categories.filter((c) => only.includes(c.id)) : categories), [only]);
  const [catId, setCatId] = useState(() => findCategory(category ?? '')?.id ?? cats[0].id);
  const cat = findCategory(catId) ?? cats[0];
  const [prodId, setProdId] = useState(() => cat.products.find((p) => p.id === product)?.id ?? cat.products[0].id);
  const prod = cat.products.find((p) => p.id === prodId) ?? cat.products[0];
  const showProducts = cat.products.length > 1 && !lockProduct;
  const [sel, setSel] = useState<Selection>(() => defaultSelection(prod));
  const [qtyText, setQtyText] = useState(String(sel.qty));
  const [toast, setToast] = useState('');

  // read ?calc=category:product from the URL (links from cards and landing pages)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('calc');
    if (!q) return;
    const [c, p] = q.split(':');
    const fc = findCategory(c);
    if (fc && (!only || only.includes(fc.id))) {
      setCatId(fc.id);
      const fp = fc.products.find((x) => x.id === p) ?? fc.products[0];
      setProdId(fp.id);
      const s = defaultSelection(fp);
      setSel(s);
      setQtyText(String(s.qty));
    }
  }, []);

  const pickCategory = (id: string) => {
    const c = findCategory(id)!;
    setCatId(id);
    setProdId(c.products[0].id);
    const s = defaultSelection(c.products[0]);
    setSel(s);
    setQtyText(String(s.qty));
  };

  const pickProduct = (p: Product) => {
    setProdId(p.id);
    const s = defaultSelection(p);
    setSel(s);
    setQtyText(String(s.qty));
  };

  const setQty = (n: number) => {
    const q = normalizeQty(n, prod.qty);
    setSel((s) => ({ ...s, qty: q }));
    setQtyText(String(q));
  };

  const setOption = (groupId: string, value: string, multi: boolean) =>
    setSel((s) => {
      if (!multi) return { ...s, options: { ...s.options, [groupId]: value } };
      const cur = Array.isArray(s.options[groupId]) ? (s.options[groupId] as string[]) : [];
      return { ...s, options: { ...s.options, [groupId]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] } };
    });

  const quote = useMemo(() => prod.quote(sel), [prod, sel]);
  const ladder = useMemo(() => prod.ladder?.(sel) ?? [], [prod, sel]);
  const ladderLabels = qtyLabels(ladder.map((t) => t.from), prod.qty);

  const { min, max, presets, freeFrom } = prod.qty;
  const sliderMax = sliderMaxOf(prod.qty);
  const sliderVal = qtyToPos(sel.qty, prod.qty);

  const add = (thenOrder: boolean) => {
    if (quote.error) return;
    addToEstimate({
      title: prod.name,
      details: describe(prod, sel),
      qty: sel.qty,
      unitPrice: quote.unit,
      total: quote.total,
      from: quote.from,
    });
    reachGoal(thenOrder ? 'calc_order' : 'calc_add', { product: prod.id, total: quote.total });
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
                {cat.products.map((p) => (
                  <button
                    type="button"
                    class={`calc-product${p.id === prod.id ? ' is-active' : ''}`}
                    aria-pressed={p.id === prod.id}
                    onClick={() => pickProduct(p)}
                  >
                    {p.image ? (
                      <img src={p.image} alt="" width={56} height={56} loading="lazy" decoding="async" />
                    ) : (
                      <span class="calc-product-dot" aria-hidden="true" />
                    )}
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
            const hidden = (g: OptionGroup) => !!g.hideWhen && sel.options[g.hideWhen.group] === g.hideWhen.value;
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
                    <div class="calc-chips">
                      {g.choices
                        .filter((c) => !(g.addable && c.id === 'none'))
                        .map((c) => {
                          const v = sel.options[g.id];
                          const on = g.type === 'many' ? Array.isArray(v) && v.includes(c.id) : v === c.id;
                          return (
                            <button type="button" class="chip" aria-pressed={on} onClick={() => setOption(g.id, c.id, g.type === 'many')}>
                              {g.type === 'many' && <span class={`calc-check${on ? ' on' : ''}`} aria-hidden="true" />}
                              <span>{c.label}</span>
                              {c.hint && <small>{c.hint}</small>}
                            </button>
                          );
                        })}
                    </div>
                  </fieldset>
                ))}
                {nextAdd && (
                  <button type="button" class="calc-add" onClick={() => addGroup(nextAdd)}>
                    <span aria-hidden="true">+</span> Добавить принт
                    <small>{nextAdd.label.toLowerCase()} — дешевле: −30% / −50%</small>
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
                        if (Number.isFinite(n) && n > 0) setSel((s) => ({ ...s, dims: { ...s.dims, [d.id]: Math.min(d.max, n) } }));
                      }}
                      onBlur={(e) => {
                        const n = Number((e.target as HTMLInputElement).value);
                        setSel((s) => ({ ...s, dims: { ...s.dims, [d.id]: Math.min(d.max, Math.max(d.min, Number.isFinite(n) ? n : d.default)) } }));
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
                <button type="button" aria-label="Меньше" onClick={() => setQty(stepQty(sel.qty, -1, prod.qty))} disabled={sel.qty <= min}>
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
                    if (Number.isFinite(n) && n >= min && (!presets || (freeFrom && n >= freeFrom))) setSel((s) => ({ ...s, qty: clamp(n, min, max) }));
                  }}
                  onBlur={() => setQty(Number(qtyText) || min)}
                />
                <span class="calc-qty-unit">шт</span>
                <button type="button" aria-label="Больше" onClick={() => setQty(stepQty(sel.qty, 1, prod.qty))} disabled={sel.qty >= max}>
                  +
                </button>
              </div>
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
                  setQty(posToQty(pos, prod.qty));
                }}
              />
              <div class="calc-slider-scale" aria-hidden="true">
                <span>{min.toLocaleString('ru-RU')}</span>
                <span>
                  {max.toLocaleString('ru-RU')}
                  {prod.qty.individualAbove && ' · больше — цена индивидуально'}
                </span>
              </div>
            </div>
            {presets && ladder.length <= 1 && (
              <div class="calc-chips calc-presets">
                {presets.map((q) => (
                  <button type="button" class="chip" aria-pressed={q === sel.qty} onClick={() => setQty(q)}>
                    {q.toLocaleString('ru-RU')} шт
                  </button>
                ))}
              </div>
            )}
            {ladder.length > 1 && (
              // «лесенка»: the lower the price per piece, the lower the step; tap a step to pick that quantity
              <div class="calc-ladder" role="group" aria-label="Цена за штуку по тиражам">
                <span class="calc-ladder-title">Чем больше — тем дешевле</span>
                <div class="calc-steps">
                  {ladder.map((t, i) => {
                    const active = sel.qty >= t.from && (i === ladder.length - 1 || sel.qty < ladder[i + 1].from);
                    const top = ladder[0].price;
                    const save = i > 0 && top > 0 ? Math.round((1 - t.price / top) * 100) : 0;
                    const h = top > 0 ? Math.round(10 + 38 * (t.price / top)) : 48; // px: 48 for the dearest step, lower for cheaper ones
                    return (
                      <button
                        type="button"
                        class={`calc-stair${active ? ' is-active' : ''}`}
                        aria-pressed={active}
                        aria-label={`${ladderLabels[i]}: ${rub(t.price)} за штуку`}
                        onClick={() => setQty(Math.max(t.from, min))}
                      >
                        <span class="calc-stair-price">{rub(t.price)}</span>
                        <span class="calc-stair-bar" style={{ height: `${h}px` }}>
                          {save > 0 && <span class="calc-stair-save">−{save}%</span>}
                        </span>
                        <span class="calc-stair-qty">{ladderLabels[i]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </fieldset>
        </div>

        <aside class="calc-result" aria-live="polite">
          <div class="calc-result-inner">
            <div class="calc-result-head">
              <span class="calc-result-name">{prod.name}</span>
              <span class="colorbar" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            <p class="calc-result-desc">{describe(prod, sel) || prod.short}</p>

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

            {quote.next && !quote.error && (
              <button type="button" class="calc-nudge" onClick={() => setQty(quote.next!.qty)}>
                {presets && quote.next.qty < (freeFrom ?? Infinity) ? 'Тираж' : 'От'} {quote.next.qty.toLocaleString('ru-RU')} шт — <b>{rub(quote.next.unit)}</b> за штуку. Показать
              </button>
            )}

            {quote.error && <p class="calc-error" role="alert">{quote.error}</p>}
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
