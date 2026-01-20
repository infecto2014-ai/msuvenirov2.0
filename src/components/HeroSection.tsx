import { useEffect, useRef } from 'react';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-neon-cyan/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-neon-magenta/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-6">
            🎨 Создаём уникальное с 2018 года
          </span>
        </div>

        <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6" style={{ animationDelay: '0.4s' }}>
          <span className="text-foreground">МАСТЕРСКАЯ СУВЕНИРОВ:</span>
          <br />
          <span className="neon-text">ПЕЧАТЬ ВАШЕЙ ИСТОРИИ</span>
          <br />
          <span className="text-foreground">НА ТЕКСТИЛЕ</span>
        </h1>

        <p className="animate-fade-up text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10" style={{ animationDelay: '0.6s' }}>
          Создавайте уникальные вещи с нами. От футболок до шоперов, 
          от одной штуки до крупных тиражей.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <button className="gradient-btn px-8 py-4 rounded-xl text-lg font-bold text-background">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              ЗАПУСТИТЬ КОНФИГУРАТОР ДИЗАЙНА
            </span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full neon-border flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-glow-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
