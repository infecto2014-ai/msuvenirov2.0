import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Shirt, ShieldCheck, Upload, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/* ─── Benefits ─── */
const benefits = [
  {
    icon: Factory,
    title: 'Своё производство',
    description: 'Печатаем на собственном оборудовании — без посредников. Срочные заказы готовы за 24 часа.',
  },
  {
    icon: Shirt,
    title: 'От 1 штуки',
    description: 'Никаких минимальных тиражей. Один принт или тысяча — цена честная в любом случае.',
  },
  {
    icon: ShieldCheck,
    title: 'Стойкость 60+ стирок',
    description: 'DTF-печать выдерживает десятки стирок без потери яркости и трещин.',
  },
];

/* ─── Pricing cards ─── */
const pricingItems = [
  {
    title: 'Футболки',
    price: 'от 1 350 ₽',
    description: 'Хлопок 100 %, плотность 190 г/м². Классический крой, унисекс.',
  },
  {
    title: 'Худи и свитшоты',
    price: 'от 2 350 ₽',
    description: 'Футер с начёсом 320 г/м². Тёплые, уютные, с капюшоном или без.',
  },
  {
    title: 'Шопперы',
    price: 'от 900 ₽',
    description: 'Плотная бязь 240 г/м². Экологичная альтернатива пакетам с вашим дизайном.',
  },
];

/* ─── Portfolio placeholders ─── */
const portfolioImages = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  alt: `Пример DTF-печати ${i + 1}`,
}));

/* ─── Form ─── */
const ContactForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', details: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: 'Заполните имя и телефон', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('phone', form.phone);
      payload.append('comment', `[DTF-печать] ${form.details}`);
      await supabase.functions.invoke('send-telegram', { body: payload });
      toast({ title: 'Заявка отправлена!' });
      setForm({ name: '', phone: '', details: '' });
    } catch {
      toast({ title: 'Ошибка отправки', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        name="name"
        placeholder="Ваше имя"
        value={form.name}
        onChange={handleChange}
        className="bg-background border-border focus-visible:ring-primary"
      />
      <Input
        name="phone"
        placeholder="Телефон"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        className="bg-background border-border focus-visible:ring-primary"
      />
      <textarea
        name="details"
        placeholder="Опишите заказ: тираж, изделие, пожелания..."
        value={form.details}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
      />
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <Upload className="w-4 h-4" />
        Загрузить макет
      </button>
      <button
        type="submit"
        disabled={sending}
        className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {sending ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
};

/* ─── Page ─── */
const DtfPrintPage = () => {
  const handleOrderClick = () => {
    const el = document.getElementById('dtf-form');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-cyan)/0.12)] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-purple)/0.10)] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary mb-6">
                <Sparkles className="w-3.5 h-3.5" /> DTF-технология
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="neon-text">DTF-печать</span> на одежде
                <br className="hidden sm:block" /> в Калининграде
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
                Создаём уникальный мерч: футболки, худи и шопперы от&nbsp;1&nbsp;штуки со&nbsp;стойким принтом
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleOrderClick}
                  className="px-8 py-3.5 rounded-xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity"
                >
                  Заказать печать
                </button>
                <Link
                  to="/price"
                  className="px-8 py-3.5 rounded-xl border-2 border-primary/50 text-primary font-bold text-base hover:bg-primary/10 transition-colors text-center"
                >
                  Смотреть прайс
                </Link>
              </div>
            </div>

            {/* Hero visual placeholder */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="aspect-square rounded-3xl bg-card border border-border flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.08)] to-[hsl(var(--neon-purple)/0.08)]" />
                <div className="text-center relative z-10">
                  <Shirt className="w-20 h-20 text-primary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">Hero-изображение</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl bg-card border border-border p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-[hsl(var(--neon-cyan)/0.03)]" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Что мы печатаем
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Популярные изделия с DTF-печатью — выбирайте основу, а мы нанесём ваш дизайн
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-card border border-border p-6 sm:p-8 flex flex-col"
              >
                <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                <span className="text-2xl font-black text-primary mb-3">{item.price}</span>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>
                <Link
                  to="/price"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Подробнее <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Наши работы
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Примеры DTF-печати на различных изделиях
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-2xl bg-card border border-border overflow-hidden group cursor-pointer relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan)/0.05)] to-[hsl(var(--neon-purple)/0.05)] group-hover:from-[hsl(var(--neon-cyan)/0.12)] group-hover:to-[hsl(var(--neon-purple)/0.12)] transition-all duration-300" />
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section id="dtf-form" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-[hsl(var(--neon-purple)/0.03)]" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
              Оставить заявку
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Опишите задачу — мы свяжемся и рассчитаем стоимость
            </p>
            <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DtfPrintPage;
