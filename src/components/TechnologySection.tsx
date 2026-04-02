import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnologySection = () => {
  return (
    <section id="технология" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Технология DTF-печати">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
            <span className="text-foreground">Что такое </span>
            <span className="neon-text">DTF-печать</span>
            <span className="text-foreground">?</span>
          </h2>
        </div>

        {/* Text Content */}
        <div className="space-y-6 text-center">
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

          <div className="pt-2">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary bg-transparent text-sm font-semibold text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 group"
            >
              Цены, сроки и частые вопросы
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
