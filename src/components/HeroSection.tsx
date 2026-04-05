import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) {
      orderButton.click();
    }
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('витрина');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="главная" className="relative min-h-screen flex flex-col overflow-hidden" aria-label="Главный экран">
      {/* Background - responsive hero image */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/hero-bg-mobile.webp" width={768} height={432} />
          <img 
            src="/images/hero-bg.webp" 
            alt="DTF-печать на футболках и текстиле в Калининграде — Мастерская сувениров" 
            className="w-full h-full object-cover opacity-30"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={1920}
            height={1080}
            sizes="100vw"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10" />
      </div>
      
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background z-0" />

      {/* Neon decorative elements - hidden on mobile for performance */}
      <div 
        className="hidden md:block absolute top-1/4 left-10 w-32 h-32 rounded-full bg-neon-cyan/20 blur-3xl animate-float" 
        aria-hidden="true"
        style={{ willChange: 'transform' }}
      />
      <div 
        className="hidden md:block absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-neon-magenta/20 blur-3xl animate-float" 
        style={{ animationDelay: '1s', willChange: 'transform' }} 
        aria-hidden="true"
      />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl" aria-hidden="true" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-6 sm:mb-6 px-8 sm:px-0">
          <span className="neon-text uppercase tracking-tight">МАСТЕРСКАЯ</span>
          <br />
          <span className="text-foreground uppercase tracking-tight text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">СУВЕНИРОВ</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6">
          Впечатления для близких, имидж для бизнеса
        </p>

        {/* Price badge */}
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/30 bg-primary/5 text-xs sm:text-base font-semibold text-primary">
            DTF-печать от 280 ₽
          </span>
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border/30 bg-card/30 text-xs sm:text-base font-semibold text-foreground">
            ⚡ Срочно за 24ч
          </span>
        </div>

        {/* CTA Button */}
        <div className="mb-10 sm:mb-16">
          <button 
            onClick={handleOrderClick} 
            className="gradient-btn-pulse px-10 sm:px-12 py-4 sm:py-5 rounded-xl text-lg sm:text-xl md:text-2xl font-bold text-background" 
            aria-label="Оформить заказ на печать"
          >
            <span className="relative z-10">СДЕЛАТЬ ЗАКАЗ</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <button 
          onClick={handleScrollDown} 
          className="cursor-pointer hover:scale-110 transition-transform duration-300" 
          aria-label="Прокрутить к каталогу продукции"
        >
          <div className="animate-bounce" style={{ willChange: 'transform' }}>
            <ChevronDown 
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary" 
              aria-hidden="true" 
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
