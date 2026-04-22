import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Flame, Droplets, Zap,
  CheckCircle2, ChevronDown, Send,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FAQBlock from '@/components/fabric-print/FAQBlock';
import GalleryWithLightbox from '@/components/fabric-print/GalleryWithLightbox';
import { dtfPrices, methodComparison, productTags, videoItems } from '@/components/fabric-print/data';

const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));

const handleOrderClick = () => {
  const btn = document.querySelector('[data-order-button]') as HTMLButtonElement | null;
  btn?.click();
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Печать на футболках и спецодежде в Калининграде — DTF-печать, сублимация, брендирование',
  description: 'DTF-печать и сублимация на футболках, худи, шопперах, фартуках, спецодежде. Брендирование корпоративной одежды от 1 штуки. Собственное производство в Калининграде. Стойкость 50+ стирок.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Мастерская сувениров',
    address: { '@type': 'PostalAddress', addressLocality: 'Калининград', addressCountry: 'RU' },
  },
  areaServed: { '@type': 'City', name: 'Калининград' },
  offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: '280', offerCount: 9 },
};

const VIDEO_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Брендирование формы Динамо — Зенит | DTF печать Калининград',
    description: 'Печать на спортивной форме для матча Динамо — Зенит. Профессиональная DTF-печать на одежде в Калининграде.',
    uploadDate: '2025-01-01',
    contentUrl: 'https://rutube.ru/video/5aca36d827a345d86d32ac97df583899/',
    embedUrl: 'https://rutube.ru/play/embed/5aca36d827a345d86d32ac97df583899/',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Брендирование формы Балтика — Локомотив | DTF печать Калининград',
    description: 'Печать на спортивной форме для матча Балтика — Локомотив. Профессиональная DTF-печать на одежде в Калининграде.',
    uploadDate: '2025-01-01',
    contentUrl: 'https://rutube.ru/video/04e2c79246a3978989ff0a58b900efb1/',
    embedUrl: 'https://rutube.ru/play/embed/04e2c79246a3978989ff0a58b900efb1/',
  },
];

const FabricPrintPage = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Helmet>
      <title>Печать на футболках в Калининграде | DTF-печать на одежде и спецодежде — Мастерская сувениров</title>
      <meta name="description" content="Печать на футболках, худи, спецодежде и текстиле в Калининграде. DTF-печать и сублимация от 280 ₽. Брендирование корпоративной одежды, печать на худи, шопперах, фартуках. От 1 шт, за 24 часа." />
      <meta name="keywords" content="печать на футболках Калининград, DTF печать, печать на спецодежде, брендирование одежды, печать на худи, печать на шопперах, сублимация на ткани, печать на текстиле Калининград" />
      <link rel="canonical" href="https://msuvenirov.ru/pechat_na_tkani" />
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://msuvenirov.ru/" },
          { "@type": "ListItem", "position": 2, "name": "Услуги", "item": "https://msuvenirov.ru/price" },
          { "@type": "ListItem", "position": 3, "name": "Печать на ткани", "item": "https://msuvenirov.ru/pechat_na_tkani" }
        ]
      })}</script>
    </Helmet>

    <Header />

    {/* ═══ HERO ═══ */}
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/fabric-hero-bg-mobile.webp" width={768} height={574} />
          <img
            src="/images/fabric-hero-bg.webp"
            alt="DTF-печать на футболках и текстиле — Мастерская сувениров"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={1024}
            height={765}
            sizes="100vw"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary mb-6">
          <Zap className="w-3.5 h-3.5" /> Опыт более 10 лет. Собственное производство
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
          Печать на футболках
          <br />
          <span className="neon-text">и спецодежде в Калининграде</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          DTF-печать и сублимация на&nbsp;футболках, худи, шопперах, фартуках и&nbsp;спецодежде.
          Брендирование корпоративной одежды от&nbsp;1&nbsp;штуки, срочные заказы за&nbsp;24&nbsp;часа. Стойкость принта — 50+&nbsp;стирок.
        </p>

        <button
          onClick={handleOrderClick}
          className="gradient-btn-pulse px-8 py-3.5 rounded-xl text-base font-bold text-background inline-flex items-center justify-center"
        >
          <span className="relative z-10 flex items-center gap-2"><Send className="w-4 h-4" /> Сделать заказ</span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-xs sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> От 1 штуки</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> 50+ стирок</span>
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
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">DTF vs Сублимация — какой метод выбрать?</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          Мы используем оба метода и подбираем оптимальный под вашу задачу
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodComparison.map((m) => (
            <div key={m.method} className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-colors duration-300">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={m.image}
                  alt={`${m.method} — процесс печати`}
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
    <GalleryWithLightbox />

    {/* ═══ PRICE LIST ═══ */}
    <section className="py-14 sm:py-20" id="prices">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Прайс-лист на печать</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
          Цены указаны за изделие без нанесения. Стоимость нанесения зависит от формата принта и тиража.
        </p>

        {/* SEO-текст: ассортимент */}
        <div className="mb-12">
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed [&>p]:indent-8">
            <p>
              Наносим принты на <strong className="text-foreground">футболки</strong> любых фасонов — классические, оверсайз, детские, — плотностью от&nbsp;140 до&nbsp;220&nbsp;г/м² из&nbsp;хлопка, полиэстера и&nbsp;смесовых тканей. Работаем с&nbsp;<strong className="text-foreground">поло</strong>, <strong className="text-foreground">лонгсливами</strong>, <strong className="text-foreground">свитшотами</strong> и&nbsp;<strong className="text-foreground">худи</strong> — идеально для корпоративного мерча и&nbsp;командной формы.
            </p>
            <p>
              Печатаем на&nbsp;<strong className="text-foreground">шопперах</strong> и&nbsp;<strong className="text-foreground">фартуках</strong> для брендированных подарков и&nbsp;промо-акций, а&nbsp;также на&nbsp;<strong className="text-foreground">бейсболках</strong> любого цвета и&nbsp;кроя. Каждое изделие доступно в&nbsp;широкой палитре оттенков — от&nbsp;классического белого до&nbsp;нестандартных ярких цветов.
            </p>
            <p>
              <strong className="text-foreground">Принесите своё изделие</strong> — нанесём принт на&nbsp;вашу ткань из&nbsp;любого материала: хлопок, синтетика, смесовые ткани, спецодежда. Главное — ровная поверхность для качественного переноса. Подберём оптимальную технологию печати под ваш текстиль.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {productTags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* DTF price table */}
        <div className="rounded-2xl border border-border overflow-hidden mb-8">
          <div className="px-5 py-3 bg-muted/30 border-b border-border">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" /> Нанесение DTF-печатью
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="font-bold text-foreground">Формат</TableHead>
                  <TableHead className="font-bold text-foreground text-center">1–4 шт</TableHead>
                  <TableHead className="font-bold text-foreground text-center">5–10 шт</TableHead>
                  <TableHead className="font-bold text-foreground text-center">20–50 шт</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dtfPrices.map((row) => (
                  <TableRow key={row.format} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-foreground text-sm">{row.format}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty1}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty5}</TableCell>
                    <TableCell className="text-center whitespace-nowrap neon-text font-semibold text-sm">{row.qty20}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-5 py-4 bg-muted/20 border-t border-border space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Тираж 50+ шт — <button onClick={handleOrderClick} className="text-primary hover:underline font-semibold">запросите индивидуальный расчёт</button>
            </p>
            <p className="text-xs text-muted-foreground">
              Дополнительный принт на том же изделии — <span className="text-foreground font-semibold">70% от стоимости</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Третий и последующие принты — <span className="text-foreground font-semibold">50% от стоимости</span>
            </p>
            <p className="text-xs text-primary/80 font-medium">
              * Цены не являются окончательными — подберём оптимальный вариант под ваш бюджет
            </p>
          </div>
        </div>

        {/* Sublimation */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Droplets className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-1">Сублимация — по запросу</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Стоимость сублимационной печати зависит от площади нанесения и типа изделия.
                Подходит для полного запечата, спортивной формы и синтетических тканей.
                Оставьте заявку — рассчитаем за 15 минут.
              </p>
            </div>
          </div>
        </div>

        {/* Full price link */}
        <div className="mt-8 text-center">
          <Link to="/price" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary/40 text-primary font-bold text-base hover:bg-primary/10 transition-colors">
            Полный прайс-лист
          </Link>
        </div>
      </div>
    </section>

    {/* ═══ VIDEO SHOWCASE ═══ */}
    <section className="py-14 sm:py-20 bg-muted/10" id="video-cases" aria-labelledby="video-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h2 id="video-heading" className="text-2xl sm:text-3xl font-bold text-center mb-3 neon-text">
          Брендирование формы для матчей «Динамо»&nbsp;— «Зенит» и «Балтика»&nbsp;— «Локомотив»
        </h2>
        <p className="text-muted-foreground text-center text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Качественная печать на спортивной одежде на заказ. Подготовили партию футболок
          с&nbsp;эксклюзивным дизайном. Работаем с&nbsp;любыми тиражами: от&nbsp;одного изделия
          до&nbsp;полного обеспечения спортивных команд.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {videoItems.map((v) => (
            <div key={v.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
                <iframe
                  src={`https://rutube.ru/play/embed/${v.id}/?p=${v.token}`}
                  title={v.title}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <p className="p-3 text-center text-xs md:text-sm text-muted-foreground">{v.title}</p>
            </div>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_JSON_LD) }}
      />
    </section>

    {/* ═══ FAQ ═══ */}
    <section className="py-14 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Частые вопросы</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">О печати на ткани, тиражах и сроках</p>
        <FAQBlock />
        <div className="mt-8 text-center">
          <Link to="/faq" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary/40 text-primary font-bold text-base hover:bg-primary/10 transition-colors">
            Все вопросы и ответы
          </Link>
        </div>
      </div>
    </section>

    {/* ═══ BOTTOM CTA ═══ */}
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Готовы заказать печать на ткани?</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Свяжитесь с нами — подберём метод печати, рассчитаем стоимость и изготовим заказ в кратчайшие сроки
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

export default FabricPrintPage;
