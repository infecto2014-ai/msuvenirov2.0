const AboutSection = () => {
  return (
    <section id="о-нас" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-3">
            О КОМПАНИИ
          </span>
        </div>
        <p className="text-foreground text-base sm:text-lg max-w-4xl mx-auto leading-relaxed text-center">
          Мы — команда профессионалов, специализирующаяся на <strong>печати на текстиле</strong> и
          изготовлении <strong>сувенирной продукции</strong>. С 2019 года наше собственное производство
          в Калининграде создаёт уникальные изделия для частных клиентов и корпоративных заказчиков.
          Используем <strong>DTF-печать</strong>, шелкографию, сублимацию и УФ-технологии для достижения
          максимального качества.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
