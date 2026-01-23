import { Award, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Собственное производство',
    description: 'Полный цикл работ в Калининграде — от дизайна до готового изделия',
  },
  {
    icon: Users,
    title: 'Работаем с 2019 года',
    description: 'Более 5 лет опыта и тысячи выполненных заказов',
  },
  {
    icon: Zap,
    title: 'Срочные заказы',
    description: 'Изготовление за 24 часа при наличии готового макета',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Используем сертифицированные материалы и современное оборудование',
  },
];

const AboutSection = () => {
  return (
    <section id="о-нас" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-3">
            О КОМПАНИИ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6">
            <span className="neon-text">Мастерская сувениров</span>
            <span className="text-foreground"> в Калининграде</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Мы — команда профессионалов, специализирующаяся на <strong>печати на текстиле</strong> и 
            изготовлении <strong>сувенирной продукции</strong>. С 2019 года наше собственное производство 
            в Калининграде создаёт уникальные изделия для частных клиентов и корпоративных заказчиков. 
            Используем <strong>DTF-печать</strong>, шелкографию, сублимацию и УФ-технологии для достижения 
            максимального качества.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={index} className="glass-card p-6 rounded-xl text-center group hover:neon-glow transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
