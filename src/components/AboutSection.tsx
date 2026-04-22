const AboutSection = () => {
  return (
    <section id="о-нас" className="py-16 sm:py-24 relative overflow-hidden" aria-label="О компании">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-3">
            О КОМПАНИИ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Печать на футболках и сувенирах в Калининграде
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-5 text-foreground text-base sm:text-lg leading-relaxed">
          <p className="text-center">
            <strong>Мастерская сувениров</strong> — собственное производство полного цикла в Калининграде
            с опытом более 10 лет. Мы выполняем <strong>печать на футболках, худи, шопперах, кружках</strong>{' '}
            и других сувенирах от 1 штуки — без минимального тиража и наценки за срочность.
          </p>

          <p className="indent-8">
            Используем четыре современные технологии: <strong>DTF-печать</strong> (стойкость 50+ стирок,
            насыщенные цвета на любом текстиле), <strong>сублимация</strong> (для белых синтетических
            футболок и кружек), <strong>шелкография</strong> (для крупных тиражей корпоративного мерча) и{' '}
            <strong>УФ-печать</strong> (для жёстких поверхностей — кружки-хамелеон, ручки, флешки, стекло).
            Подбираем технологию индивидуально под каждый материал, чтобы обеспечить максимальную долговечность принта.
          </p>

          <p className="indent-8">
            Работаем с частными заказами и корпоративными клиентами: брендирование спортивной формы,
            пошив и печать корпоративного мерча, изготовление подарков на 23 февраля, 8 марта,
            Новый год и юбилеи компаний. Среди наших клиентов — ФК «Балтика», «Динамо-Калининград»,
            рестораны и салоны Калининграда. Срочные заказы готовим за 24 часа при наличии готового макета,
            стандартный срок — 2–5 рабочих дней.
          </p>

          <p className="indent-8">
            Принимаем макеты в любых форматах (PNG, PDF, AI, CDR, PSD от 300 dpi), а если макета нет —
            наши дизайнеры разработают его бесплатно при заказе печати. Самовывоз из ТЦ Экватор
            (ул. Ген. Челнокова 11, 2 этаж) или доставка по Калининграду и области.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
