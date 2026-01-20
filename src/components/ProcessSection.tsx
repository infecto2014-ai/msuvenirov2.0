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
    description: 'Наши мастера воплотят ваш дизайн с использованием лучших технологий',
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
  return (
    <section id="процесс" className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-3">
            КАК ЭТО РАБОТАЕТ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            <span className="neon-text">ПРОЦЕСС</span>
            <span className="text-foreground"> СОЗДАНИЯ</span>
          </h2>
        </div>

        {/* Process steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta opacity-30" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="glass-card rounded-xl p-4 text-center group hover:neon-glow transition-all duration-300 h-full">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background neon-border flex items-center justify-center">
                      <span className="text-xs font-bold neon-text">{index + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 mx-auto mb-3 mt-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      step.color === 'neon-cyan' ? 'bg-neon-cyan/10 group-hover:bg-neon-cyan/20' :
                      step.color === 'neon-purple' ? 'bg-neon-purple/10 group-hover:bg-neon-purple/20' :
                      step.color === 'neon-magenta' ? 'bg-neon-magenta/10 group-hover:bg-neon-magenta/20' :
                      'bg-neon-pink/10 group-hover:bg-neon-pink/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        step.color === 'neon-cyan' ? 'text-neon-cyan' :
                        step.color === 'neon-purple' ? 'text-neon-purple' :
                        step.color === 'neon-magenta' ? 'text-neon-magenta' :
                        'text-neon-pink'
                      }`} />
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && index % 2 === 1 && (
                    <div className="lg:hidden flex justify-center my-2">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-primary to-secondary" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
