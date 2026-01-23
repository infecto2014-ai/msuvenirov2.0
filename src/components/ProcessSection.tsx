import { MousePointer2, Send, Printer, Package } from 'lucide-react';

const steps = [
  {
    icon: MousePointer2,
    title: 'Выбор изделия',
    description: 'Выберите основу: футболка, худи, шопер или другое изделие',
    color: 'neon-cyan',
  },
  {
    icon: Send,
    title: 'Отправляем макет',
    description: 'Загрузите готовый макет или мы создадим согласно вашему пожеланию',
    color: 'neon-purple',
  },
  {
    icon: Printer,
    title: 'Печать',
    description: 'Наши мастера воплотят ваш дизайн',
    color: 'neon-magenta',
  },
  {
    icon: Package,
    title: 'Получение',
    description: 'Заберите заказ в нашей мастерской или получите с доставкой',
    color: 'neon-pink',
  },
];

const ProcessSection = () => {
  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) {
      orderButton.click();
    }
  };

  return (
    <section id="процесс" className="py-10 sm:py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="text-center mb-8 sm:mb-10">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">
            КАК ЭТО РАБОТАЕТ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
            <span className="neon-text">Этапы заказа</span>
            <span className="text-foreground"> печати</span>
          </h2>
        </header>

        {/* Process steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta opacity-30" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center group hover:neon-glow transition-all duration-300 h-full">
                    {/* Step number */}
                    <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background neon-border flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs font-bold neon-text">{index + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 mt-1 sm:mt-2 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                      step.color === 'neon-cyan' ? 'bg-neon-cyan/10 group-hover:bg-neon-cyan/20' :
                      step.color === 'neon-purple' ? 'bg-neon-purple/10 group-hover:bg-neon-purple/20' :
                      step.color === 'neon-magenta' ? 'bg-neon-magenta/10 group-hover:bg-neon-magenta/20' :
                      'bg-neon-pink/10 group-hover:bg-neon-pink/20'
                    }`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        step.color === 'neon-cyan' ? 'text-neon-cyan' :
                        step.color === 'neon-purple' ? 'text-neon-purple' :
                        step.color === 'neon-magenta' ? 'text-neon-magenta' :
                        'text-neon-pink'
                      }`} />
                    </div>

                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed line-clamp-3">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Button */}
        <div className="text-center mt-8 sm:mt-10">
          <button 
            onClick={handleOrderClick}
            className="gradient-btn-pulse px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-background"
          >
            <span className="relative z-10">ЗАКАЗАТЬ</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
