import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, MessageCircle, Phone, Send, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FAQCategory = {
  id: string;
  label: string;
  icon: string;
  questions: { q: string; a: string }[];
};

const categories: FAQCategory[] = [
  {
    id: 'order',
    label: 'Заказ и сроки',
    icon: '📦',
    questions: [
      {
        q: 'Какие сроки изготовления заказа?',
        a: 'Стандартный срок изготовления — от 1 дня. Возможна срочная печать "день в день" в зависимости от загруженности нашего производства.',
      },
      {
        q: 'Какой минимальный тираж?',
        a: 'Минимального тиража нет — работаем от 1 штуки! Это идеально для создания уникальных подарков, тестовых образцов или индивидуальных заказов.',
      },
      {
        q: 'Можно ли принести свою футболку для печати?',
        a: 'Да, вы можете предоставить свои изделия. Главное требование — ткань должна подходить для выбранного метода печати (для DTF состав менее критичен, для сублимации нужна синтетика).',
      },
    ],
  },
  {
    id: 'price',
    label: 'Оплата и цены',
    icon: '💰',
    questions: [
      {
        q: 'Делаете ли вы скидки на оптовые и корпоративные заказы?',
        a: 'Да, у нас предусмотрена гибкая система скидок для корпоративных клиентов. Чем больше тираж футболок или кружек, тем ниже стоимость за единицу.',
      },
      {
        q: 'Сколько стоит печать на футболке?',
        a: 'Стоимость зависит от размера изображения, количества цветов и тиража. Точную стоимость рассчитаем после получения макета — отправьте заявку, и мы ответим в течение часа.',
      },
    ],
  },
  {
    id: 'design',
    label: 'Требования к макетам',
    icon: '🎨',
    questions: [
      {
        q: 'Как подготовить макет для печати?',
        a: 'Принимаем файлы в форматах PNG (на прозрачном фоне), векторные форматы (AI, CDR, EPS) или PDF. Разрешение для растра — не менее 300 dpi. Если макета нет, наши дизайнеры помогут его подготовить.',
      },
      {
        q: 'Какие виды печати вы используете?',
        a: 'Мы используем современное оборудование для различных задач, включая долговечную DTF-печать для текстиля и сублимацию для кружек. Принты получаются яркими и стойкими.',
      },
    ],
  },
  {
    id: 'care',
    label: 'Уход за изделиями',
    icon: '🧺',
    questions: [
      {
        q: 'Как правильно ухаживать за вещами с принтом?',
        a: 'Рекомендуется стирать изделия вывернутыми наизнанку при температуре не выше 30-40 градусов, без использования отбеливателей. Гладить также следует с изнаночной стороны.',
      },
      {
        q: 'Сколько стирок выдерживает принт?',
        a: 'DTF-печать выдерживает 50+ стирок без потери цвета при соблюдении рекомендаций по уходу. Сублимационная печать на кружках не стирается вообще.',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Доставка в Калининграде',
    icon: '🚚',
    questions: [
      {
        q: 'Есть ли доставка?',
        a: 'Да, мы осуществляем доставку по Калининграду и Калининградской области. Также вы можете забрать заказ самовывозом из нашей мастерской в ТЦ Экватор (2 этаж, ул. Генерала Челнокова 11, стр 1).',
      },
      {
        q: 'Сколько стоит доставка?',
        a: 'Стоимость доставки зависит от адреса и объёма заказа. При заказе от определённой суммы доставка может быть бесплатной. Уточняйте у менеджера.',
      },
    ],
  },
];

const allQuestions = categories.flatMap((cat) =>
  cat.questions.map((q) => ({ ...q, category: cat.label, categoryId: cat.id }))
);

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allQuestions.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const FAQPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = activeCategory
      ? allQuestions.filter((q) => q.categoryId === activeCategory)
      : allQuestions;

    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (q) => q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s)
      );
    }
    return items;
  }, [search, activeCategory]);

  return (
    <>
      <Helmet>
        <title>Частые вопросы — Мастерская сувениров | Печать на футболках в Калининграде</title>
        <meta
          name="description"
          content="Ответы на популярные вопросы о печати на футболках, кружках, DTF-печати и корпоративных заказах в Калининграде. Мастерская сувениров — опыт более 10 лет."
        />
        <link rel="canonical" href="https://msuvenirov39.ru/faq" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-4">
              FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              <span className="neon-text">Часто задаваемые вопросы</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Ответы на популярные вопросы о печати на футболках, кружках и корпоративных заказах
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по вопросам..."
                aria-label="Поиск по часто задаваемым вопросам"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-card border border-border/50 bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 sm:px-6 mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === null
                  ? 'bg-primary text-primary-foreground shadow-[var(--shadow-neon-cyan)]'
                  : 'glass-card text-muted-foreground hover:text-foreground border border-border/50'
              }`}
            >
              Все вопросы
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-neon-cyan)]'
                    : 'glass-card text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ List */}
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-xl">
                <p className="text-muted-foreground text-sm">
                  Ничего не найдено. Попробуйте изменить запрос или{' '}
                  <button
                    onClick={() => {
                      setSearch('');
                      setActiveCategory(null);
                    }}
                    className="text-primary underline underline-offset-4"
                  >
                    сбросить фильтры
                  </button>
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filtered.map((item, i) => (
                  <AccordionItem
                    key={`${item.categoryId}-${i}`}
                    value={`item-${i}`}
                    className="glass-card rounded-xl px-6 border-border/50 data-[state=open]:neon-glow transition-all duration-300"
                  >
                    <AccordionTrigger
                      className="text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary hover:no-underline py-5"
                      aria-label={item.q}
                    >
                      <div className="flex flex-col gap-1">
                        <span>{item.q}</span>
                        {!activeCategory && (
                          <span className="text-xs font-normal text-muted-foreground">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>

        {/* CTA Block */}
        <section className="container mx-auto px-4 sm:px-6 mt-16">
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative z-10">
              <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                Остались вопросы?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md mx-auto">
                Свяжитесь с нами — поможем подобрать оптимальный вариант печати и рассчитаем стоимость
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://t.me/Msuvenirov39zakaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-btn-pulse px-6 py-3 rounded-lg text-sm font-semibold text-primary-foreground inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="relative z-10">Написать в Telegram</span>
                </a>
                <a
                  href="tel:+79521142350"
                  className="px-6 py-3 rounded-lg text-sm font-semibold border border-border/50 text-foreground hover:border-primary/50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  Позвонить
                </a>
              </div>
              <Link
                to="/price"
                className="inline-block mt-4 text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                Смотреть прайс-лист →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FAQPage;
