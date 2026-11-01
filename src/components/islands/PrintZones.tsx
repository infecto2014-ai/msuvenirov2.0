import { useId, useMemo, useState } from 'preact/hooks';
import { dtfPrint, findProduct, rub, tierPrice, type Selection } from '@/data/pricing';
import { printBox, silhouettes, unitsPerCm, type PrintFormat, type PrintZone, type Silhouette, type SilhouettePart } from '@/data/printZones';
import { addToEstimate, openOrder } from '@/lib/estimate';
import { reachGoal } from '@/lib/metrika';
import './PrintZones.css';

interface Props {
  /** product id in the 'textile' category of src/data/pricing.ts */
  productId: string;
  silhouette: Silhouette;
  title?: string;
}

/** How the garment is painted for each colour choice of the product. */
const COLOR_FILL: Record<string, { fill: string; dark?: boolean }> = {
  white: { fill: '#ffffff' },
  black: { fill: '#25222b', dark: true },
  other: { fill: '#9fd6ea' },
};

const SWATCH: Record<string, string> = {
  white: '#ffffff',
  black: '#25222b',
  other: 'conic-gradient(#00a0dc 0 25%, #e5007d 0 50%, #ffd21f 0 75%, #3aa35b 0)',
};

type Placed = { zone: string; f: PrintFormat };
type Warn = { kind: 'limit' | 'info'; text: string } | null;

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));

export default function PrintZones({ productId, silhouette, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const def = silhouettes[silhouette];
  const product = findProduct('textile', productId)!;
  const options = product.options ?? [];
  const colorGroup = options.find((g) => g.id === 'color');
  const places = options.filter((g) => /^print\d+$/.test(g.id)).length;
  const productFormats = useMemo(
    () => (options.find((g) => g.id === 'print1')?.choices ?? []).map((c) => c.id).filter((id): id is PrintFormat => id in dtfPrint),
    [product],
  );

  /** zones of this silhouette with the formats this product really has */
  const zones = useMemo(
    () =>
      def.zones
        .map((z) => ({ ...z, fmts: z.formats.filter((f) => productFormats.includes(f)) }))
        .filter((z) => z.fmts.length > 0),
    [def, productFormats],
  );
  const zoneById = (id: string | null) => zones.find((z) => z.id === id);

  const initialPrints = (): Placed[] => {
    const z = zoneById(def.initial.zone) ?? zones[0];
    if (!z || places < 1) return [];
    const f = z.fmts.includes(def.initial.format) ? def.initial.format : z.fmts[z.fmts.length - 1];
    return [{ zone: z.id, f }];
  };

  const [prints, setPrints] = useState<Placed[]>(initialPrints);
  const [active, setActive] = useState<string | null>(() => initialPrints()[0]?.zone ?? null);
  const [side, setSide] = useState(() => zoneById(active)?.side ?? def.sides[0].id);
  const [color, setColor] = useState(() => (typeof colorGroup?.default === 'string' ? colorGroup.default : colorGroup?.choices[0].id ?? ''));
  const [qty, setQtyState] = useState(1);
  const [qtyText, setQtyText] = useState('1');
  const [warn, setWarn] = useState<Warn>(null);
  const [toast, setToast] = useState('');

  const qMin = 1;
  const qMax = product.qty.max;
  const setQty = (n: number) => {
    const q = clamp(Number.isFinite(n) ? n : 1, qMin, qMax);
    setQtyState(q);
    setQtyText(String(q));
  };

  const selection: Selection = useMemo(() => {
    const o: Record<string, string> = {};
    if (colorGroup) o.color = color;
    for (let i = 0; i < places; i++) o[`print${i + 1}`] = prints[i]?.f ?? 'none';
    return { options: o, dims: {}, qty };
  }, [color, prints, qty, places, colorGroup]);
  const quote = useMemo(() => product.quote(selection), [product, selection]);

  const sideDef = def.sides.find((s) => s.id === side) ?? def.sides[0];
  const activeZone = zoneById(active);
  const printOf = (zoneId: string) => prints.find((p) => p.zone === zoneId);
  const colorChoice = colorGroup?.choices.find((c) => c.id === color);
  const paint = (colorGroup && COLOR_FILL[color]) || { fill: def.fill };
  const k = unitsPerCm(def, product.id);

  const pickZone = (z: PrintZone) => {
    setActive(z.id);
    setSide(z.side);
    setWarn(null);
  };

  const pickFormat = (z: PrintZone, f: PrintFormat) => {
    const cur = printOf(z.id);
    setSide(z.side);
    if (cur?.f === f) {
      setPrints(prints.filter((p) => p.zone !== z.id));
      setWarn(null);
      return;
    }
    if (cur) {
      setPrints(prints.map((p) => (p.zone === z.id ? { ...p, f } : p)));
      setWarn(null);
      return;
    }
    if (prints.length >= places) {
      const names = prints.map((p) => `«${zoneById(p.zone)?.label}»`).join(', ');
      setWarn({
        kind: 'limit',
        text:
          places === 1
            ? `На этом изделии печатаем только одно место. Сначала уберите ${names}.`
            : `На этом изделии можно до ${places} ${plural(places, 'места', 'мест', 'мест')} печати. Уберите одно из выбранных (${names}), чтобы добавить «${z.label}».`,
      });
      return;
    }
    setPrints([...prints, { zone: z.id, f }]);
    const clash = (z.overlaps ?? []).map((id) => zoneById(id)).find((o) => o && printOf(o.id));
    setWarn(clash ? { kind: 'info', text: `«${z.label}» и «${clash.label}» частично накладываются друг на друга — обычно выбирают что-то одно.` } : null);
  };

  const removePrint = (zoneId: string) => {
    setPrints(prints.filter((p) => p.zone !== zoneId));
    setWarn(null);
  };

  const formatLabel = (f: PrintFormat) => dtfPrint[f].label;
  const printsText = prints.map((p) => `${zoneById(p.zone)?.label}: ${formatLabel(p.f)}`);
  const details = [colorChoice?.label, ...printsText].filter(Boolean).join(' · ');
  const priceText = `${quote.from ? 'от ' : ''}${rub(quote.total)}`;
  const orderText = `${product.name}${colorChoice ? `, ${colorChoice.label.toLowerCase()}` : ''} — ${printsText.join(', ')}; ${qty} шт — ${priceText}`;
  const canOrder = prints.length > 0 && !quote.error;

  const addEstimate = () => {
    if (!canOrder) return;
    addToEstimate({ title: product.name, details, qty, unitPrice: quote.unit, total: quote.total, from: quote.from });
    reachGoal('zones_add', { product: product.id, total: quote.total });
    setToast(`${product.name} — в смете`);
    setTimeout(() => setToast(''), 2600);
  };

  const sideCount = (sideId: string) => prints.filter((p) => zoneById(p.zone)?.side === sideId).length;

  const renderPart = (p: SilhouettePart, i: number) =>
    p.kind === 'strap' ? (
      <g key={i}>
        <path class="pz-strap-o" d={p.d} />
        <path class="pz-strap-i" d={p.d} />
      </g>
    ) : (
      <path key={i} class={`pz-${p.kind}`} d={p.d} />
    );

  const [vx, vy, vw, vh] = def.viewBox;
  const measure = sideDef.measure;
  const measureCm = measure ? Math.round((measure.x2 - measure.x1) / k) : 0;

  return (
    <div class="pz">
      {title && <h2 class="pz-title">{title}</h2>}
      <div class="pz-grid">
        {/* ---------------------------------------------------- stage */}
        <div class="pz-stage">
          <div class="pz-stage-inner">
            {def.sides.length > 1 && (
              <div class="pz-sides" role="group" aria-label="Сторона изделия">
                {def.sides.map((s) => {
                  const n = sideCount(s.id);
                  return (
                    <button type="button" class={`pz-side${s.id === side ? ' is-active' : ''}`} aria-pressed={s.id === side} onClick={() => setSide(s.id)}>
                      {s.label}
                      {n > 0 && <span class="pz-side-n">{n}</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <svg
              class={`pz-svg${paint.dark ? ' is-dark' : ''}`}
              viewBox={`${vx} ${vy} ${vw} ${vh}`}
              role="img"
              aria-label={`${def.name}, ${sideDef.label.toLowerCase()}${prints.length ? `: ${printsText.join(', ')}` : ''}`}
              style={{ '--pz-fill': paint.fill }}
            >
              <defs>
                <linearGradient id={`${uid}-ink`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#00a0dc" />
                  <stop offset="0.55" stop-color="#e5007d" />
                  <stop offset="1" stop-color="#ffd21f" />
                </linearGradient>
                <pattern id={`${uid}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
                  <circle cx="3.5" cy="3.5" r="1.2" fill="rgba(255,255,255,0.45)" />
                </pattern>
              </defs>

              <g class="pz-garment">{sideDef.parts.map(renderPart)}</g>

              {measure && (
                <g class="pz-measure" aria-hidden="true">
                  <path d={`M${measure.x1},${measure.y} H${measure.x2} M${measure.x1},${measure.y - 6} v12 M${measure.x2},${measure.y - 6} v12`} />
                  <rect x={(measure.x1 + measure.x2) / 2 - 34} y={measure.y - 9} width="68" height="18" rx="9" />
                  <text x={(measure.x1 + measure.x2) / 2} y={measure.y + 4}>
                    ≈ {measureCm} см
                  </text>
                </g>
              )}

              {prints.map((p) => {
                const z = zoneById(p.zone);
                if (!z || z.side !== sideDef.id) return null;
                const b = printBox(def, z, p.f, product.id);
                const m = Math.min(b.w, b.h);
                const big = Math.max(10, Math.min(26, m * 0.3));
                return (
                  <g
                    class={`pz-print${active === z.id ? ' is-active' : ''}`}
                    transform={`translate(${b.cx} ${b.cy})`}
                    onClick={() => pickZone(z)}
                    aria-hidden="true"
                  >
                    <g transform={z.rotate ? `rotate(${z.rotate})` : undefined}>
                      <rect class="pz-print-fill" x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} rx="3" fill={`url(#${uid}-ink)`} />
                      <rect x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} rx="3" fill={`url(#${uid}-dots)`} />
                      <rect class="pz-print-edge" x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} rx="3" />
                    </g>
                    <text class="pz-print-label" y={m > 44 ? -big * 0.05 : big * 0.35} font-size={big}>
                      {formatLabel(p.f)}
                    </text>
                    {m > 44 && (
                      <text class="pz-print-size" y={big * 0.95} font-size={big * 0.52}>
                        {b.cmW}×{b.cmH} см
                      </text>
                    )}
                  </g>
                );
              })}

              {zones
                .filter((z) => z.side === sideDef.id && !printOf(z.id))
                .map((z) => (
                  <g
                    class={`pz-marker${active === z.id ? ' is-active' : ''}`}
                    transform={`translate(${z.x} ${z.y})`}
                    onClick={() => pickZone(z)}
                    aria-hidden="true"
                  >
                    <circle class="pz-marker-hit" r="24" />
                    <circle class="pz-marker-ring" r="17" />
                    <circle class="pz-marker-dot" r="12" />
                    <path class="pz-marker-plus" d="M-5,0 H5 M0,-5 V5" />
                  </g>
                ))}
            </svg>

            <p class="pz-caption">
              {prints.length
                ? 'Размеры принтов — в масштабе изделия. Нажмите на принт или «+», чтобы изменить.'
                : 'Нажмите на «+» там, где хотите печать.'}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- controls */}
        <div class="pz-side-col">
          <div class="pz-panel">
            {colorGroup && (
              <fieldset class="pz-group">
                <legend class="pz-legend">Цвет изделия</legend>
                <div class="pz-chips">
                  {colorGroup.choices.map((c) => (
                    <button type="button" class="chip pz-color" aria-pressed={c.id === color} onClick={() => setColor(c.id)}>
                      <span class="pz-swatch" style={{ background: SWATCH[c.id] ?? '#ddd' }} aria-hidden="true" />
                      <span>
                        {c.label}
                        {c.hint && <small> · {c.hint}</small>}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset class="pz-group">
              <legend class="pz-legend">
                Где печатаем
                <span class="pz-count">
                  {prints.length} из {places} {plural(places, 'места', 'мест', 'мест')}
                </span>
              </legend>
              <div class="pz-zones">
                {zones.map((z) => {
                  const p = printOf(z.id);
                  const sl = def.sides.find((s) => s.id === z.side)?.label ?? '';
                  const sideLabel = def.sides.length > 1 && sl !== z.label ? sl : '';
                  return (
                    <button
                      type="button"
                      class={`pz-zone${active === z.id ? ' is-active' : ''}${p ? ' has-print' : ''}`}
                      aria-pressed={active === z.id}
                      onClick={() => pickZone(z)}
                    >
                      <span class="pz-zone-text">
                        <span class="pz-zone-name">{z.label}</span>
                        {sideLabel && <span class="pz-zone-side">{sideLabel.toLowerCase()}</span>}
                      </span>
                      <span class="pz-zone-badge" aria-label={p ? `формат ${formatLabel(p.f)}` : 'без печати'}>
                        {p ? formatLabel(p.f) : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeZone ? (
                <div class="pz-editor" aria-live="polite">
                  <div class="pz-editor-head">
                    <span>
                      <b>{activeZone.label}</b> — размер принта
                    </span>
                    {printOf(activeZone.id) && (
                      <button type="button" class="pz-remove" onClick={() => removePrint(activeZone.id)}>
                        Убрать
                      </button>
                    )}
                  </div>
                  <div class="pz-formats">
                    {activeZone.fmts.map((f) => {
                      const on = printOf(activeZone.id)?.f === f;
                      const box = printBox(def, activeZone, f, product.id);
                      return (
                        <button type="button" class="chip pz-format" aria-pressed={on} onClick={() => pickFormat(activeZone, f)}>
                          <span class="pz-format-name">{formatLabel(f)}</span>
                          <small>{box.limited ? `до ${box.cmW}×${box.cmH}\u00a0см` : dtfPrint[f].size.replace(' ', '\u00a0')}</small>
                          <small class="pz-format-price">{rub(tierPrice(dtfPrint[f].tiers, qty))}</small>
                        </button>
                      );
                    })}
                  </div>
                  {warn && (
                    <p class={`pz-warn${warn.kind === 'limit' ? ' is-limit' : ''}`} role={warn.kind === 'limit' ? 'alert' : undefined}>
                      {warn.text}
                    </p>
                  )}
                  {def.note && <p class="pz-note">{def.note}</p>}
                  {places > 1 && <p class="pz-note">Второй принт на изделии — на 30% дешевле, третий — на 50%.</p>}
                </div>
              ) : (
                <p class="pz-empty">Нажмите на место, где хотите печать.</p>
              )}
            </fieldset>

            <fieldset class="pz-group">
              <legend class="pz-legend">Количество</legend>
              <div class="pz-stepper">
                <button type="button" aria-label="Меньше" onClick={() => setQty(qty - 1)} disabled={qty <= qMin}>
                  −
                </button>
                <input
                  class="pz-qty"
                  type="number"
                  inputMode="numeric"
                  aria-label="Количество, шт"
                  min={qMin}
                  max={qMax}
                  value={qtyText}
                  onInput={(e) => {
                    const t = (e.target as HTMLInputElement).value;
                    setQtyText(t);
                    const n = Number(t);
                    if (t && Number.isFinite(n) && n >= qMin) setQtyState(clamp(n, qMin, qMax));
                  }}
                  onBlur={() => setQty(Number(qtyText) || qMin)}
                />
                <span class="pz-qty-unit">шт</span>
                <button type="button" aria-label="Больше" onClick={() => setQty(qty + 1)} disabled={qty >= qMax}>
                  +
                </button>
              </div>
            </fieldset>
          </div>

          {/* ---------------------------------------------------- result */}
          <div class="pz-result" aria-live="polite">
            <div class="pz-result-head">
              <span class="pz-result-name">{product.name}</span>
              <span class="colorbar" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            {prints.length ? (
              <>
                <p class="pz-result-desc">{details}</p>
                <dl class="pz-sum">
                  <div>
                    <dt>За штуку</dt>
                    <dd class="mono">
                      {quote.from ? 'от ' : ''}
                      {rub(quote.unit)}
                    </dd>
                  </div>
                  <div class="pz-total">
                    <dt>Итого за {qty.toLocaleString('ru-RU')} шт</dt>
                    <dd class="mono">{priceText}</dd>
                  </div>
                </dl>
                <ul class="pz-breakdown">
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
                {quote.next && !quote.error && (
                  <button type="button" class="pz-nudge" onClick={() => setQty(quote.next!.qty)}>
                    От {quote.next.qty.toLocaleString('ru-RU')} шт — <b>{rub(quote.next.unit)}</b> за штуку. Показать
                  </button>
                )}
                {quote.error && (
                  <p class="pz-error" role="alert">
                    {quote.error}
                  </p>
                )}
                {quote.notes.map((n) => (
                  <p class="pz-result-note">{n}</p>
                ))}
              </>
            ) : (
              <p class="pz-result-empty">Нажмите на место, где хотите печать, — цена появится здесь.</p>
            )}

            <div class="pz-actions">
              <button
                type="button"
                class="btn btn-magenta btn-block"
                disabled={!canOrder}
                data-order={canOrder ? orderText : undefined}
                onClick={() => reachGoal('zones_order', { product: product.id, total: quote.total })}
              >
                Заказать
              </button>
              <button type="button" class="btn btn-yellow btn-block" disabled={!canOrder} onClick={addEstimate}>
                + В смету
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class={`pz-toast${toast ? ' show' : ''}`} role="status">
        {toast}
        {toast && (
          <button type="button" onClick={() => openOrder({ source: 'zones-toast' })}>
            Открыть смету
          </button>
        )}
      </div>
    </div>
  );
}
