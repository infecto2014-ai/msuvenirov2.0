import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section id="главная" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        <h1 className="animate-fade-up text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-3" style={{ animationDelay: '0.2s' }}>
          <span className="neon-text">МАСТЕРСКАЯ СУВЕНИРОВ</span>
        </h1>

        <p className="animate-fade-up text-sm sm:text-base md:text-lg italic text-muted-foreground mb-5" style={{ animationDelay: '0.3s' }}>
          Впечатления для жизни, имидж для бизнеса
        </p>

        <div className="animate-fade-up mb-5" style={{ animationDelay: '0.4s' }}>
          <button className="gradient-btn-pulse px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg font-bold text-background">
            <span className="relative z-10">СДЕЛАТЬ ЗАКАЗ</span>
          </button>
        </div>

        <p className="animate-fade-up text-xs sm:text-sm md:text-base text-muted-foreground max-w-md mx-auto" style={{ animationDelay: '0.5s' }}>
          Создавай уникальные вещи с нами. От одной штуки до крупных тиражей.
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-7 h-10 sm:w-8 sm:h-12 rounded-full neon-border flex items-start justify-center p-2">
            <div className="w-1 sm:w-1.5 h-2 sm:h-3 rounded-full bg-primary animate-glow-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
