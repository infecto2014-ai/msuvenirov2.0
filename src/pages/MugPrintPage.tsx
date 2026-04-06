import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Droplets, Zap, Printer,
  CheckCircle2, ChevronDown, Send,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import heroImg from '@/assets/mug-print/hero.jpg';
import sublimationImg from '@/assets/mug-print/sublimation-method.jpg';
import uvImg from '@/assets/mug-print/uv-method.jpg';
import gallery1 from '@/assets/mug-print/gallery-1.jpg';
import gallery2 from '@/assets/mug-print/gallery-2.jpg';
import gallery3 from '@/assets/mug-print/gallery-3.jpg';
import gallery4 from '@/assets/mug-print/gallery-4.jpg';
import gallery5 from '@/assets/mug-print/gallery-5.jpg';
import gallery6 from '@/assets/mug-print/gallery-6.jpg';

const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));

/* ═══════════════════════ DATA ═══════════════════════ */

const mugPrices = [
  { name: 'Кружка белая', qty1: '650', qty10: '450', qty30: '350', qty100: '315', qty200: '250' },
  { name: 'Кружка белая, цветная внутри или ручка', qty1: '750', qty10: '550', qty30: '470', qty100: '425', qty200: '340' },
  { name: 'Кружка ХАМЕЛЕОН', qty1: '1 100', qty10: '980', qty30: '890', qty100: '815', qty200: '650' },
  { name: 'Кружка глиттер градиент', qty1: '1 630', qty10: '980', qty30: '890', qty100: '815', qty200: '650' },
  { name: 'Кружка мрамор/зеркальное золото или серебро', qty1: '1 945', qty10: '1 170', qty30: '1 070', qty100: '970', qty200: '780' },
  { name: 'Кружка золото/серебро/стекло', qty1: '1 320', qty10: '790', qty30: '730', qty100: '660', qty200: '530' },
];

const methodComparison = [
  {
    method: 'Сублимация',
    icon: Droplets,
    image: sublimationImg,
    pros: ['Фотореалистичная печать', 'Стойкость 500+ моек', 'Безграничная палитра', 'Принт не ощущается на ощупь'],
    cons: ['Только белые/светлые кружки с полимерным покрытием'],
    best: 'Фотографии, полноцветные дизайны, подарки, корпоративный мерч',
  },
  {
    method: 'УФ-печать',
    icon: Printer,
    image: uvImg,
    pros: ['Любой цвет кружки', 'Высокая детализация', 'Белый цвет в печати', 'Рельефный эффект'],
    cons: ['Менее стойкая при частом мытье в посудомойке'],
    best: 'Тёмные кружки, логотипы с белым цветом, сувенирная продукция',
  },
];

const faqItems = [
  { q: 'Какой минимальный тираж?', a: 'Печатаем от 1 кружки. Идеально для персонального подарка или пробного заказа перед крупным тиражом.' },
  { q: 'Сколько моек выдерживает принт?', a: 'Сублимационная печать выдерживает 500+ моек. Рекомендуем ручную мойку для максимальной стойкости.' },
  { q: 'Чем сублимация отличается от УФ-печати?', a: 'Сублимация «впечатывает» краску в полимерное покрытие кружки — принт не ощущается тактильно. УФ-печать наносит краску поверх поверхности и позволяет печатать на тёмных кружках.' },
  { q: 'Можно напечатать фотографию?', a: 'Да, фотопечать — одна из самых популярных услуг. Принимаем файлы от 300 dpi для наилучшего качества.' },
  { q: 'Какой формат макета нужен?', a: 'Принимаем PNG, PDF, AI, PSD, CDR. Разрешение от 300 dpi. Если макета нет — поможем с дизайном.' },
  { q: 'Есть ли доставка?', a: 'Да, доставляем по Калининграду и области. Также возможна отправка по России транспортными компаниями с надёжной упаковкой.' },
];

/* ═══════════════════════ FAQ ═══════════════════════ */

const FAQBlock = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
            aria-expanded={openIdx === i}
          >
            <span className="font-semibold text-foreground text-sm sm:text-base pr-4">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-60' : 'max-h-0'}`}>
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════ HELPERS ═══════════════════════ */

const handleOrderClick = () => {
  const btn = document.querySelector('[data-order-button]') as HTMLButtonElement | null;
  btn?.click();
};

/* ═══════════════════════ PAGE ═══════════════════════ */

const MugPrintPage = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Печать на кружках в Калининграде — сублимация и УФ-печать',
    description: 'Печать на кружках от 1 штуки: сублимация и УФ-печать. Фотографии, логотипы, дизайны. Собственное производство в Калининграде.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Мастерская сувениров',
      address: { '@type': 'PostalAddress', addressLocality: 'Калининград', addressCountry: 'RU' },
    },
    areaServed: { '@type': 'City', name: 'Калининград' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: '250', offerCount: 6 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Печать на кружках в Калининграде — сублимация от 250 ₽ | Мастерская сувениров</title>
        <meta name="description" content="Печать на кружках от 1 штуки в Калининграде. Сублимация: белые, хамелеоны, глиттер, мрамор, золото, серебро, стекло. Собственное производство, от 250 ₽." />
        <link rel="canonical" href="https://msuvenirov.ru/mug-print" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Печать на кружках — производственная линия" className="w-full h-full object-cover opacity-20" loading="eager" fetchPriority="high" width={1280} height={720} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary mb-6">
            <Zap className="w-3.5 h-3.5" /> Опыт более 10 лет. Собственное производство
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Печать на кружках
            <br />
            <span className="neon-text">в Калининграде</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Сублимация и УФ-печать на кружках любых типов.
            От&nbsp;1&nbsp;штуки, фотографии, логотипы, авторские дизайны. Стойкость принта — 500+&nbsp;моек.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleOrderClick}
              className="gradient-btn-pulse px-8 py-3.5 rounded-xl text-base font-bold text-background inline-flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center gap-2"><Send className="w-4 h-4" /> Сделать заказ</span>
            </button>
            <Link to="/price" className="px-8 py-3.5 rounded-xl border-2 border-primary/40 text-primary font-bold text-base hover:bg-primary/10 transition-colors text-center">
              Полный прайс-лист
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> От 1 штуки</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> 500+ моек</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Срочно за 24ч</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Своё оборудование</span>
          </div>
        </div>

        <button
          onClick={() => document.getElementById('methods')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-300 z-10"
          aria-label="Прокрутить вниз"
        >
          <div className="animate-bounce" style={{ willChange: 'transform' }}>
            <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-primary" aria-hidden="true" />
          </div>
        </button>
      </section>

      {/* ═══ METHODS COMPARISON ═══ */}
      <section className="py-14 sm:py-20" id="methods">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Сублимация vs УФ-печать — какой метод выбрать?</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Подбираем оптимальную технологию под ваш дизайн и тип кружки
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodComparison.map((m) => (
              <div key={m.method} className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={m.image}
                    alt={`${m.method} на кружке — процесс печати`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={640}
                    height={640}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <m.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground drop-shadow-lg">{m.method}</h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="space-y-2 mb-4">
                    {m.pros.map((p) => (
                      <div key={p} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{p}</span>
                      </div>
                    ))}
                    {m.cons.map((c) => (
                      <div key={c} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">—</span>
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Лучше всего для:</span> {m.best}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="py-14 sm:py-20 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Примеры наших работ</h2>
          <p className="text-muted-foreground text-center text-sm mb-10 max-w-xl mx-auto">
            Фотопечать, корпоративные кружки, кружки-хамелеоны и авторские дизайны
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: gallery1, alt: 'Кружка с фотопечатью пейзажа — сублимация', label: 'Сублимация' },
              { src: gallery2, alt: 'Кружка-хамелеон — проявляющийся принт от горячей воды', label: 'Хамелеон' },
              { src: gallery3, alt: 'Корпоративные кружки с логотипом компании', label: 'Корпоративные' },
              { src: gallery4, alt: 'Кружка с иллюстрацией кота — подарочная печать', label: 'Сублимация' },
              { src: gallery5, alt: 'Эмалированная кружка с принтом для туризма', label: 'УФ-печать' },
              { src: gallery6, alt: 'Кружка с цветочным принтом — акварельный дизайн', label: 'Сублимация' },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden border border-border bg-card aspect-square">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={640}
                  height={640}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/90 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICE ═══ */}
      <section className="py-14 sm:py-20" id="prices">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Прайс-лист на печать</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
            Цены указаны за кружку с нанесением. Стоимость зависит от типа кружки и тиража.
          </p>

          {/* ═══ SEO-текст: виды кружек ═══ */}
          <div className="mb-12">
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed [&>p]:indent-8">
              <p>
                Печатаем на <strong className="text-foreground">классических белых кружках</strong> — универсальный вариант для фотографий, поздравлений и корпоративных подарков. Сублимационная печать обеспечивает фотореалистичное качество и стойкость более 500 моек. Доступны <strong className="text-foreground">кружки с цветной ручкой и внутренней частью</strong> — жёлтые, красные, зелёные, синие, розовые и оранжевые.
              </p>
              <p>
                <strong className="text-foreground">Кружки-хамелеоны</strong> — эффектный подарок: при наливании горячей воды чёрное покрытие становится прозрачным и проявляется скрытый дизайн. Также в ассортименте — <strong className="text-foreground">кружки глиттер градиент</strong>, <strong className="text-foreground">мраморные</strong>, с <strong className="text-foreground">зеркальным золотом или серебром</strong>, а также кружки из <strong className="text-foreground">золота, серебра и стекла</strong>.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Белые', 'Цветные внутри', 'Хамелеоны', 'Глиттер градиент', 'Мрамор', 'Золото/серебро', 'Стекло'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden mb-8">
            <div className="px-5 py-3 bg-muted/30 border-b border-border">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" /> Стоимость кружки с печатью
              </h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-bold text-foreground">Наименование</TableHead>
                    <TableHead className="font-bold text-foreground text-center">1 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">10 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">30 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">100 шт</TableHead>
                    <TableHead className="font-bold text-foreground text-center">200 шт</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mugPrices.map((row) => (
                    <TableRow key={row.name} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-foreground text-sm">{row.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty1} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty10} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty30} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty100} ₽</TableCell>
                      <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty200} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-5 py-4 bg-muted/20 border-t border-border space-y-1.5">
              <p className="text-xs text-muted-foreground">
                Тираж 200+ шт — <button onClick={handleOrderClick} className="text-primary hover:underline font-semibold">запросите индивидуальный расчёт</button>
              </p>
              <p className="text-xs text-primary/80 font-medium">
                * Цены не являются окончательными — подберём оптимальный вариант под ваш бюджет
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Частые вопросы</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">О печати на кружках, тиражах и стойкости</p>
          <FAQBlock />
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Готовы заказать печать на кружках?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Свяжитесь с нами — подберём тип кружки, рассчитаем стоимость и изготовим заказ в кратчайшие сроки
          </p>
          <button
            onClick={handleOrderClick}
            className="gradient-btn-pulse px-8 py-3 rounded-xl text-base font-bold text-background inline-flex items-center justify-center gap-2 mx-auto"
          >
            <span className="relative z-10 flex items-center gap-2"><Send className="w-4 h-4" /> Сделать заказ</span>
          </button>
        </div>
      </section>

      <Footer />

      <Suspense fallback={null}>
        <FloatingOrderButton />
      </Suspense>
    </div>
  );
};

export default MugPrintPage;
