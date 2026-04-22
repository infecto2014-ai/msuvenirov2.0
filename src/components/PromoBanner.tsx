import { useEffect, useState } from 'react';
import { X, Tag } from 'lucide-react';
import { reachGoal } from '@/lib/metrika';

const COOKIE_NAME = 'promo_banner_dismissed';
const COOKIE_DAYS = 7;
const PROMO_CODE = 'NEW15';

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const PromoBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Показываем через 3 сек, чтобы не мешать LCP
    const t = setTimeout(() => {
      if (!getCookie(COOKIE_NAME)) {
        setVisible(true);
        reachGoal('promo_banner_shown');
      }
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
    setVisible(false);
    reachGoal('promo_banner_dismissed');
  };

  const handleApply = () => {
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
    setVisible(false);
    reachGoal('promo_banner_applied');
    const btn = document.querySelector('[data-order-button]') as HTMLButtonElement | null;
    // Передадим промокод через URL — форма умеет читать ?promo=
    const url = new URL(window.location.href);
    url.searchParams.set('promo', PROMO_CODE);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    btn?.click();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Промокод на скидку"
      className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-[9997] w-[calc(100%-1rem)] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.25)] p-4 sm:p-5">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Закрыть баннер"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold text-foreground leading-tight">
              Скидка 15% на первый заказ
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Промокод <span className="font-mono font-bold text-primary">{PROMO_CODE}</span> — действует на любую печать
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="mt-3 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
        >
          Применить и оформить
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
