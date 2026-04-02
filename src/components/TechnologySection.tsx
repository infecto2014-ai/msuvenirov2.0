import { Palette, Droplets, Timer, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: Palette,
    title: 'Яркие цвета',
    description: 'Фотографическое качество печати с передачей до 16 миллионов оттенков',
  },
  {
    icon: Droplets,
    title: 'Стойкость к стирке',
    description: 'Изображение выдерживает более 60 стирок без потери качества',
  },
  {
    icon: Timer,
    title: 'Быстрое изготовление',
    description: 'Печать занимает считанные минуты — идеально для срочных заказов',
  },
  {
    icon: Sparkles,
    title: 'Любая ткань',
    description: 'Подходит для хлопка, синтетики, смесовых тканей светлых и тёмных цветов',
  },
];

const TechnologySection = () => {
  return (
    <section id="технология" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-3">
            ТЕХНОЛОГИИ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
            <span className="text-foreground">Что такое </span>
            <span className="neon-text">DTF-печать</span>
            <span className="text-foreground">?</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              <strong className="text-foreground">DTF (Direct to Film)</strong> — это современная технология 
              прямой печати на плёнку с последующим термопереносом на ткань. Этот метод объединяет 
              преимущества шелкографии и цифровой печати.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              В отличие от классических методов, <strong className="text-foreground">DTF-печать</strong> позволяет 
              переносить изображения с <strong className="text-foreground">фотографической точностью</strong> на 
              любой цвет ткани — от белоснежного до чёрного. Принт получается мягким, эластичным и 
              устойчивым к многократным стиркам.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Мы используем <strong className="text-foreground">профессиональное оборудование</strong> и 
              сертифицированные чернила, что гарантирует долговечность и безопасность готовых изделий.
            </p>

            <Link
              to="/faq"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full neon-border text-sm font-medium text-primary hover:neon-glow transition-all duration-300"
            >
              <HelpCircle className="w-4 h-4" />
              Другие методы печати, сроки и ответы на вопросы
            </Link>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <article key={index} className="glass-card p-5 rounded-xl group hover:neon-glow transition-all duration-300">
                  <div className="w-12 h-12 mb-3 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
