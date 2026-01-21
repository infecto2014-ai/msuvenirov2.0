import heroImage from '@/assets/hero-bg.jpg';
import { ChevronDown } from 'lucide-react';

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
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10" />
      </div>

      {/* Neon decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 md:w-32 h-24 md:h-32 rounded-full bg-neon-cyan/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 md:w-40 h-32 md:h-40 rounded-full bg-neon-magenta/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 rounded-full bg-neon-purple/10 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 text-center pt-24">
        {/* Main Heading */}
        <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none mb-4 sm:mb-6" style={{ animationDelay: '0.2s' }}>
          <span className="neon-text uppercase tracking-tight">Мастерская</span>
          <br />
          <span className="neon-text uppercase tracking-tight">сувениров</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto mb-8 sm:mb-10" style={{ animationDelay: '0.3s' }}>
          Создавай уникальные вещи с нами. От одной штуки до крупных тиражей.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-up mb-10 sm:mb-14" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleOrderClick}
            className="gradient-btn-pulse px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg md:text-xl font-bold text-background"
          >
            <span className="relative z-10">СДЕЛАТЬ ЗАКАЗ</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-up flex flex-col items-center gap-2" style={{ animationDelay: '0.5s' }}>
          <div className="animate-bounce">
            <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-full neon-border flex items-center justify-center">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-glow-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner Slogan */}
      <div className="relative z-10 w-full py-6 sm:py-8 md:py-10 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta" style={{ WebkitTextStroke: '1px hsl(var(--primary) / 0.5)' }}>
            Впечатления для жизни, имидж для бизнеса
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
