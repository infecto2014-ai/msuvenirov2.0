import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Shirt, Flame, Droplets,
  CheckCircle2, ChevronDown, Send,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import FabricPrintCalculator from '@/components/FabricPrintCalculator';
import heroImg from '@/assets/fabric-print/hero.jpg';
import dtfImg from '@/assets/fabric-print/dtf-method.jpg';
import sublimationImg from '@/assets/fabric-print/sublimation-method.jpg';

/* ═══════════════════════ DATA ═══════════════════════ */


const dtfPrices = [
  { format: 'А6', qty1: '600 ₽', qty5: '350 ₽', qty20: '280 ₽' },
  { format: 'А5', qty1: '600 ₽', qty5: '450 ₽', qty20: '330 ₽' },
  { format: 'А4', qty1: '900 ₽', qty5: '650 ₽', qty20: '450 ₽' },
  { format: 'А3', qty1: '1 300 ₽', qty5: '900 ₽', qty20: '680 ₽' },
];

const methodComparison = [
  {
    method: 'DTF-печать',
    icon: Flame,
    image: dtfImg,
    pros: ['Любой цвет ткани', 'Фотореалистичная печать', 'От 1 штуки', '60+ стирок', 'Быстрое изготовление'],
    cons: ['Ощущается на ощупь'],
    best: 'Мелкие тиражи, сложные полноцветные дизайны, срочные заказы',
  },
  {
    method: 'Сублимация',
    icon: Droplets,
    image: sublimationImg,
    pros: ['Принт «впечатан» в ткань', 'Не ощущается на ощупь', 'Безграничная палитра', 'Не трескается'],
    cons: ['Только белая/светлая синтетика', 'Не подходит для хлопка'],
    best: 'Спортивная форма, сувенирная продукция, кружки, полный запечат',
  },
];

const faqItems = [
  { q: 'Какой минимальный тираж?', a: 'Печатаем от 1 штуки. Нет ограничений на минимальный заказ — можно заказать даже одну футболку с уникальным дизайном.' },
  { q: 'Сколько стирок выдерживает DTF-печать?', a: 'При правильном уходе (стирка до 40°C наизнанку) — более 60 стирок без потери яркости и трещин.' },
  { q: 'Чем DTF отличается от сублимации?', a: 'DTF переносит принт плёнкой на любую ткань. Сублимация «впечатывает» краску в синтетические волокна — принт не ощущается тактильно, но работает только на белой синтетике.' },
  { q: 'Можно печатать на своих изделиях?', a: 'Да, вы можете привезти свои футболки, худи или шопперы. Мы нанесём принт на ваше изделие.' },
  { q: 'Какой формат макета нужен?', a: 'Принимаем PNG, PDF, AI, PSD, CDR. Разрешение от 300 dpi. Если макета нет — поможем с дизайном.' },
  { q: 'Есть ли доставка?', a: 'Да, доставляем по Калининграду и области. Также возможна отправка по России транспортными компаниями.' },
];

/* ═══════════════════════ FORM ═══════════════════════ */

const QuickForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', details: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: 'Заполните имя и телефон', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('phone', form.phone);
      fd.append('comment', `[Печать на ткани] ${form.details}`);
      await supabase.functions.invoke('send-telegram', { body: fd });
      toast({ title: 'Заявка отправлена! Свяжемся в течение часа.' });
      setForm({ name: '', phone: '', details: '' });
    } catch {
      toast({ title: 'Ошибка, попробуйте позже', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="name" placeholder="Имя" value={form.name} onChange={handleChange} className="bg-background border-border" />
        <Input name="phone" placeholder="Телефон" type="tel" value={form.phone} onChange={handleChange} className="bg-background border-border" />
      </div>
      <textarea
        name="details"
        placeholder="Тираж, изделие, пожелания..."
        value={form.details}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto px-10 py-3 rounded-xl bg-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mx-auto sm:mx-0"
      >
        <Send className="w-4 h-4" />
        {sending ? 'Отправка...' : 'Получить расчёт'}
      </button>
    </form>
  );
};

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

/* ═══════════════════════ PAGE ═══════════════════════ */

const FabricPrintPage = () => {
  const scrollToForm = () => {
    document.getElementById('fabric-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Печать на ткани в Калининграде — DTF и сублимация',
    description: 'DTF-печать и сублимация на футболках, худи, шопперах от 1 штуки. Собственное производство в Калининграде. Стойкость 60+ стирок.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Мастерская сувениров',
      address: { '@type': 'PostalAddress', addressLocality: 'Калининград', addressCountry: 'RU' },
    },
    areaServed: { '@type': 'City', name: 'Калининград' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: '280', offerCount: fabricProducts.length },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Печать на ткани в Калининграде — DTF и сублимация от 280 ₽ | Мастерская сувениров</title>
        <meta name="description" content="DTF-печать и сублимация на футболках, худи, шопперах от 1 штуки. Собственное производство, стойкость 60+ стирок. Срочные заказы за 24 часа в Калининграде." />
        <link rel="canonical" href="https://msuvenirov.ru/fabric-print" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="DTF-печать на футболке" className="w-full h-full object-cover opacity-20" loading="eager" fetchPriority="high" width={1280} height={720} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary mb-6">
            <Shirt className="w-3.5 h-3.5" /> Опыт более 10 лет. Собственное производство
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Печать на ткани
            <br />
            <span className="neon-text">в Калининграде</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            DTF-печать и сублимация на футболках, худи, шопперах и другом текстиле.
            От&nbsp;1&nbsp;штуки, срочные заказы за&nbsp;24&nbsp;часа. Стойкость принта — 60+&nbsp;стирок.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="gradient-btn-pulse px-8 py-3.5 rounded-xl text-base font-bold text-background">
              <span className="relative z-10">Рассчитать стоимость</span>
            </button>
            <Link to="/price" className="px-8 py-3.5 rounded-xl border-2 border-primary/40 text-primary font-bold text-base hover:bg-primary/10 transition-colors text-center">
              Полный прайс-лист
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> От 1 штуки</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> 60+ стирок</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Срочно за 24ч</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Своё оборудование</span>
          </div>
        </div>
      </section>

      {/* ═══ METHODS COMPARISON ═══ */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">DTF vs Сублимация — какой метод выбрать?</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Мы используем оба метода и подбираем оптимальный под вашу задачу
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodComparison.map((m) => (
              <div key={m.method} className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                {/* Method image */}
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

      {/* ═══ FULL PRICE ═══ */}
      <section className="py-14 sm:py-20" id="prices">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Прайс-лист на печать</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
            Цены указаны за изделие без нанесения. Стоимость нанесения зависит от формата принта и тиража.
          </p>

          {/* ═══ SEO-текст: ассортимент изделий ═══ */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-primary" /> На чём печатаем
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
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
            <div className="flex flex-wrap gap-2 mt-5">
              {['Футболки', 'Поло', 'Лонгсливы', 'Худи', 'Свитшоты', 'Шопперы', 'Фартуки', 'Бейсболки', 'Своё изделие'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

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
            <div className="px-5 py-3 bg-muted/20 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Тираж 50+ шт — <button onClick={scrollToForm} className="text-primary hover:underline font-semibold">запросите индивидуальный расчёт</button>
              </p>
            </div>
          </div>

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
        </div>
      </section>


      {/* ═══ CALCULATOR ═══ */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <FabricPrintCalculator />
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Частые вопросы</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">О печати на ткани, тиражах и сроках</p>
          <FAQBlock />
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Готовы заказать печать на ткани?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Свяжитесь с нами — подберём метод печати, рассчитаем стоимость и изготовим заказ в кратчайшие сроки
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/msuvenirov" target="_blank" rel="noopener noreferrer" className="gradient-btn-pulse px-8 py-3 rounded-xl text-base font-bold text-background inline-flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center gap-2"><Send className="w-4 h-4" /> Написать в Telegram</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FabricPrintPage;
