import { Clock, Package, Pencil, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: 'Срочные заказы за 24 часа',
    description: 'Успеем к любому дедлайну — даже если нужно вчера',
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
    <section className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="glass-card rounded-2xl p-8 sm:p-10 lg:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              <span className="text-foreground">Почему выбирают </span>
              <span className="neon-text">нас</span>
              <span className="text-foreground">?</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Более 5 лет мы помогаем клиентам создавать уникальные изделия
            </p>
          </div>

          {/* Reasons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{reason.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button 
              onClick={handleOrderClick}
              className="gradient-btn-pulse px-10 py-4 rounded-xl text-lg font-bold text-background"
            >
              <span className="relative z-10">ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
