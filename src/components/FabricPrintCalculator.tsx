import { useState, useMemo } from 'react';
import { Shirt, ShoppingBag, Package, HelpCircle, Send } from 'lucide-react';

const garments = [
  { id: 'tshirt', label: 'Футболка', price: 500, icon: Shirt },
  { id: 'hoodie', label: 'Худи', price: 1200, icon: Package },
  { id: 'shopper', label: 'Шоппер', price: 300, icon: ShoppingBag },
  { id: 'own', label: 'Своё изделие', price: 0, icon: HelpCircle },
] as const;

const methods = [
  { id: 'dtf', label: 'DTF', price: 300, minQty: 1 },
  { id: 'sublimation', label: 'Сублимация', price: 200, minQty: 1 },
  { id: 'silkscreen', label: 'Шелкография', price: 150, minQty: 50 },
] as const;

function getDiscount(qty: number) {
  if (qty >= 100) return 0.3;
  if (qty >= 50) return 0.2;
  if (qty >= 10) return 0.1;
  return 0;
}

function getDiscountLabel(qty: number) {
  const d = getDiscount(qty);
  return d > 0 ? `-${d * 100}%` : null;
}

const FabricPrintCalculator = () => {
  const [garment, setGarment] = useState('tshirt');
  const [method, setMethod] = useState('dtf');
  const [qty, setQty] = useState(10);

  const calc = useMemo(() => {
    const g = garments.find(x => x.id === garment)!;
    const m = methods.find(x => x.id === method)!;
    const discount = getDiscount(qty);
    const printPrice = m.price * (1 - discount);
    const perPiece = g.price + printPrice;
    const total = perPiece * qty;
    return { perPiece: Math.round(perPiece), total: Math.round(total), discount };
  }, [garment, method, qty]);

  const activeMethod = methods.find(x => x.id === method)!;
  const silkscreenBlocked = method === 'silkscreen' && qty < 50;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
          Рассчитайте стоимость печати
        </h2>

        {/* Garment */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Выберите изделие</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {garments.map(g => {
              const active = garment === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGarment(g.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 text-sm font-medium
                    ${active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/30'
                    }`}
                >
                  <g.icon className="w-6 h-6" />
                  <span>{g.label}</span>
                  {g.price > 0 && <span className="text-xs opacity-70">{g.price} ₽</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Method */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Технология печати</p>
          <div className="flex flex-wrap gap-2">
            {methods.map(m => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2
                    ${active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                >
                  {m.label}
                  <span className="ml-1.5 text-xs opacity-70">{m.price} ₽/шт</span>
                </button>
              );
            })}
          </div>
          {silkscreenBlocked && (
            <p className="mt-2 text-xs text-destructive font-medium">
              ⚠ Шелкография доступна от 50 шт. Увеличьте тираж или выберите другой метод.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Тираж</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={500}
                value={qty}
                onChange={e => setQty(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">шт</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span>500</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-muted/30 border-t border-border px-5 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Цена за штуку</p>
            <p className="text-lg font-bold text-foreground">
              {calc.perPiece.toLocaleString('ru-RU')} ₽
              {calc.discount > 0 && (
                <span className="ml-2 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {getDiscountLabel(qty)}
                </span>
              )}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground mb-1">Итого за {qty} шт</p>
            <p className="text-2xl font-black neon-text">
              {silkscreenBlocked ? '—' : `${calc.total.toLocaleString('ru-RU')} ₽`}
            </p>
          </div>
        </div>

        <a
          href="https://t.me/msuvenirov"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
          Получить точный расчёт
        </a>
      </div>
    </div>
  );
};

export default FabricPrintCalculator;
