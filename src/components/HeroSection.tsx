import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) {
      orderButton.click();
    }
  };

  return (
    <section id="главная" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Печать на текстиле"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10" />
      </div>

      {/* Neon decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 md:w-32 h-24 md:h-32 rounded-full bg-neon-cyan/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 md:w-40 h-32 md:h-40 rounded-full bg-neon-magenta/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 rounded-full bg-neon-purple/10 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Main Heading */}
        <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-6 sm:mb-6" style={{ animationDelay: '0.2s' }}>
          <span className="neon-text uppercase tracking-tight">Мастерская</span>
          <br />
          <span className="neon-text uppercase tracking-tight">сувениров</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12" style={{ animationDelay: '0.3s' }}>
          Создавай уникальные вещи с нами. От одной штуки до крупных тиражей.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-up mb-10 sm:mb-16" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleOrderClick}
            className="gradient-btn-pulse px-10 sm:px-12 py-4 sm:py-5 rounded-xl text-lg sm:text-xl md:text-2xl font-bold text-background"
          >
            <span className="relative z-10">СДЕЛАТЬ ЗАКАЗ</span>
          </button>
        </div>

        {/* Scroll indicator - Clean animated arrow */}
        <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="animate-bounce">
            <ChevronDown 
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
              style={{ filter: 'drop-shadow(0 0 12px hsl(var(--primary))) drop-shadow(0 0 24px hsl(var(--primary)))' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
