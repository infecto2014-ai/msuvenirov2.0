// Three ideas for the «Количество» block, for the owner to compare (demo page /demo-kolichestvo).
// All prices come from the real t-shirt product in pricing.ts.
import { useMemo, useState } from 'preact/hooks';
import { defaultSelection, findProduct, rub, type Product, type Tier } from '@/data/pricing';
import './QtyVariants.css';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));
const shtuk = (n: number) => {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return 'штука';
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'штуки';
  return 'штук';
};

function usePriced(categoryId: string, productId: string) {
  const product = findProduct(categoryId, productId) as Product;
  const base = defaultSelection(product);
  const [qty, setQtyRaw] = useState(7);
  const setQty = (n: number) => setQtyRaw(clamp(n, product.qty.min, product.qty.max));
  const sel = { ...base, qty };
  const quote = useMemo(() => product.quote(sel), [qty]);
  const ladder: Tier[] = useMemo(() => product.ladder?.(sel) ?? [], []);
  const tierIndex = ladder.reduce((acc, t, i) => (qty >= t.from ? i : acc), 0);
  const top = ladder[0]?.price ?? quote.unit;
  const saved = Math.max(0, Math.round((top - quote.unit) * qty));
  const next = ladder[tierIndex + 1];
  return { product, qty, setQty, quote, ladder, tierIndex, top, saved, next };
}

const tierEnd = (ladder: Tier[], i: number, max: number) => (ladder[i + 1] ? ladder[i + 1].from - 1 : max);

/* ─────────────── Вариант A: «Шкала с зонами» ───────────────
   One slider whose track is painted in price zones; a price tag rides on the thumb. */
export function VariantScale({ category = 'textile', product: pid = 'tshirt-unisex' }) {
  const { product, qty, setQty, quote, ladder, tierIndex, top } = usePriced(category, pid);
  const { min, max } = product.qty;
  const pct = ((qty - min) / (max - min)) * 100;
  const zoneColors = ['var(--c)', 'var(--m)', 'var(--y)', 'var(--ink)'];
  return (
    <div class="qv qv-scale">
      <div class="qv-scale-head">
        <span class="qv-label">Количество</span>
        <span class="qv-scale-qty mono">
          <button type="button" aria-label="Меньше" onClick={() => setQty(qty - 1)} disabled={qty <= min}>
            −
          </button>
          <input type="number" value={qty} min={min} max={max} aria-label="Количество, шт" onInput={(e) => setQty(Number((e.target as HTMLInputElement).value) || min)} />
          <button type="button" aria-label="Больше" onClick={() => setQty(qty + 1)} disabled={qty >= max}>
            +
          </button>
        </span>
      </div>
      <div class="qv-scale-track-wrap">
        <div class="qv-scale-tag" style={{ left: `${pct}%` }}>
          <b class="mono">{rub(quote.unit)}</b>
          <small>за штуку</small>
        </div>
        <div class="qv-scale-zones" aria-hidden="true">
          {ladder.map((t, i) => {
            const from = ((t.from - min) / (max - min)) * 100;
            const to = ((tierEnd(ladder, i, max) - min) / (max - min)) * 100;
            return (
              <span
                class={`qv-zone${i === tierIndex ? ' on' : ''}`}
                style={{ left: `${from}%`, width: `${Math.max(to - from, 2)}%`, '--zc': zoneColors[i % zoneColors.length] }}
              >
                <em>{i > 0 ? `−${Math.round((1 - t.price / top) * 100)}%` : ''}</em>
              </span>
            );
          })}
        </div>
        <input class="qv-scale-range" type="range" min={min} max={max} value={qty} aria-label="Количество" onInput={(e) => setQty(Number((e.target as HTMLInputElement).value))} />
      </div>
      <div class="qv-scale-legend">
        {ladder.map((t, i) => (
          <button type="button" class={i === tierIndex ? 'on' : ''} onClick={() => setQty(t.from)}>
            <span class="mono">{rub(t.price)}</span>
            <small>
              {t.from}–{tierEnd(ladder, i, max)} шт
            </small>
          </button>
        ))}
      </div>
      <p class="qv-foot">Больше {max} шт — цена индивидуально</p>
    </div>
  );
}

/* ─────────────── Вариант B: «Быстрые тиражи + копилка» ───────────────
   Ready quantities as chips, a savings counter and how many more pieces to the next price. */
export function VariantPiggy({ category = 'textile', product: pid = 'tshirt-unisex' }) {
  const { product, qty, setQty, quote, saved, next, top } = usePriced(category, pid);
  const { min, max } = product.qty;
  const quick = [1, 5, 10, 20, 30, 50].filter((n) => n >= min && n <= max);
  const toNext = next ? next.from - qty : 0;
  const nextSave = next ? Math.round((1 - next.price / top) * 100) : 0;
  return (
    <div class="qv qv-piggy">
      <span class="qv-label">Сколько нужно?</span>
      <div class="qv-chips">
        {quick.map((n) => (
          <button type="button" class={`qv-chip${n === qty ? ' on' : ''}`} onClick={() => setQty(n)}>
            <b>{n}</b>
            <small class="mono">{rub(product.quote({ ...defaultSelection(product), qty: n }).unit)}</small>
          </button>
        ))}
        <label class="qv-chip qv-chip-own">
          <small>своё</small>
          <input type="number" value={qty} min={min} max={max} aria-label="Своё количество" onInput={(e) => setQty(Number((e.target as HTMLInputElement).value) || min)} />
        </label>
      </div>
      <div class="qv-piggy-row">
        <div class="qv-piggy-bank">
          <span class="qv-coin" aria-hidden="true">₽</span>
          <span>
            <small>Экономия на тираже</small>
            <b class="mono">{saved > 0 ? rub(saved) : '—'}</b>
          </span>
        </div>
        {next ? (
          <button type="button" class="qv-next" onClick={() => setQty(next.from)}>
            <span class="qv-next-bar" style={{ '--p': `${Math.min(100, (qty / next.from) * 100)}%` }} />
            <span>
              Ещё <b>{toNext}</b> {shtuk(toNext)} — и цена <b class="mono">{rub(next.price)}</b> <em>−{nextSave}%</em>
            </span>
          </button>
        ) : (
          <div class="qv-next qv-next-done">
            <span>Лучшая цена — <b class="mono">{rub(quote.unit)}</b> за штуку</span>
          </div>
        )}
      </div>
      <p class="qv-foot">Больше {max} шт — цена индивидуально</p>
    </div>
  );
}

/* ─────────────── Вариант C: «Стопка» ───────────────
   A pile of little t-shirts grows with the quantity; the price tag swings when the tier changes. */
export function VariantStack({ category = 'textile', product: pid = 'tshirt-unisex' }) {
  const { product, qty, setQty, quote, ladder, tierIndex } = usePriced(category, pid);
  const { min, max } = product.qty;
  const shown = Math.min(qty, 12);
  const tones = ['var(--c)', 'var(--m)', 'var(--y)', 'var(--ink)'];
  return (
    <div class="qv qv-stack">
      <div class="qv-stack-pile" aria-hidden="true">
        {Array.from({ length: shown }, (_, i) => (
          <svg
            class="qv-tee"
            viewBox="0 0 40 36"
            key={i}
            // a little pile: rows of four, each row shifted up and sideways
            style={{
              left: `${14 + (i % 4) * 46 + Math.floor(i / 4) * 14}px`,
              bottom: `${10 + Math.floor(i / 4) * 34}px`,
              transform: `rotate(${((i % 3) - 1) * 6}deg)`,
              color: tones[i % tones.length],
            }}
          >
            <path d="M13 2 L4 7 L1 16 L8 18 L9 34 L31 34 L32 18 L39 16 L36 7 L27 2 C25 6 15 6 13 2 Z" fill="currentColor" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
        ))}
        {qty > 12 && <span class="qv-stack-more mono">+{qty - 12}</span>}
      </div>
      <div class="qv-stack-side">
        <div class="qv-stack-counter">
          <button type="button" aria-label="Меньше" onClick={() => setQty(qty - 1)} disabled={qty <= min}>
            −
          </button>
          <span class="mono">
            {qty}
            <small> шт</small>
          </span>
          <button type="button" aria-label="Больше" onClick={() => setQty(qty + 1)} disabled={qty >= max}>
            +
          </button>
        </div>
        <div class="qv-stack-tag" key={tierIndex}>
          <small>за штуку</small>
          <b class="mono">{rub(quote.unit)}</b>
        </div>
        <div class="qv-stack-dots" role="group" aria-label="Тиражи">
          {ladder.map((t, i) => (
            <button type="button" class={i === tierIndex ? 'on' : i < tierIndex ? 'done' : ''} onClick={() => setQty(t.from)} aria-label={`от ${t.from} шт — ${rub(t.price)}`}>
              <span />
              <small>от {t.from}</small>
            </button>
          ))}
        </div>
      </div>
      <p class="qv-foot">Больше {max} шт — цена индивидуально</p>
    </div>
  );
}
