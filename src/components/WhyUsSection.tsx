import { Clock, Package, Pencil, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: 'Срочные заказы за 1 час',
    description: 'Успеем к любому дедлайну — при наличии готового макета',
  },
  {
    icon: Package,
    title: 'Нет минимального заказа',
    description: 'Печатаем от 1 штуки без переплат и скрытых комиссий',
  },
  {
    icon: Pencil,
    title: 'Помощь с дизайном',
    description: 'Нет макета? Наши дизайнеры создадут его для вас',
  },
  {
    icon: HeartHandshake,
    title: 'Индивидуальный подход',
    description: 'Подберём оптимальное решение под ваш бюджет и задачу',
  },
];

const WhyUsSection = () => {
  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) {
      orderButton.click();
    }
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(var(--neon-magenta)/0.05)] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Почему выбирают нас?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Более 5 лет мы помогаем клиентам создавать уникальные изделия
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group text-center p-6 sm:p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-400"
              >
                {/* Glassmorphism icon container */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.1)] group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] group-hover:border-primary/40 group-hover:bg-primary/15 transition-all duration-400">
                  <Icon className="w-7 h-7 text-primary transition-transform duration-400 group-hover:scale-110" />
                </div>
                <h3 className="text-sm sm:text-[15px] font-bold text-foreground mb-2 transition-transform duration-400 group-hover:-translate-y-0.5">
                  {reason.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed transition-transform duration-400 group-hover:-translate-y-0.5">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleOrderClick}
            className="relative px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3),0_0_60px_hsl(var(--neon-magenta)/0.2)] hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.5),0_0_80px_hsl(var(--neon-magenta)/0.35)] hover:scale-105 transition-all duration-300 animate-[cta-breathe_3s_ease-in-out_infinite]"
          >
            ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cta-breathe {
          0%, 100% {
            box-shadow: 0 0 25px hsl(var(--neon-cyan) / 0.25), 0 0 50px hsl(var(--neon-magenta) / 0.15);
          }
          50% {
            box-shadow: 0 0 40px hsl(var(--neon-cyan) / 0.4), 0 0 80px hsl(var(--neon-magenta) / 0.3);
          }
        }
      `}</style>
    </section>
  );
};

export default WhyUsSection;
