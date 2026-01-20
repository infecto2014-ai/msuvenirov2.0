import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';

const PortfolioSection = () => {
  return (
    <section id="работы" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-4">
            ПОРТФОЛИО
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
            <span className="text-foreground">НАШИ </span>
            <span className="neon-text">РАБОТЫ</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Вдохновлённые стилем глянцевых журналов, мы создаём принты, которые становятся частью вашего образа
          </p>
        </div>

        {/* Magazine-style grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large feature image */}
          <div className="col-span-12 md:col-span-7">
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={portfolio1}
                alt="Модель в брендированной футболке"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-neon-cyan/20 text-primary text-xs font-medium mb-2">
                  КОЛЛЕКЦИЯ 2024
                </span>
                <h3 className="text-2xl font-bold text-foreground">Streetwear Vibes</h3>
              </div>
              <div className="absolute inset-0 neon-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
          </div>

          {/* Side column */}
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
            <div>
              <div className="relative group overflow-hidden rounded-2xl h-full min-h-[200px]">
                <img
                  src={portfolio2}
                  alt="Корпоративный мерч"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs text-primary font-medium">КОРПОРАТИВ</span>
                  <h4 className="text-lg font-bold text-foreground">Командный дух</h4>
                </div>
              </div>
            </div>
            <div>
              <div className="relative group overflow-hidden rounded-2xl h-full min-h-[200px]">
                <img
                  src={portfolio3}
                  alt="Творческий принт"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs text-secondary font-medium">АРТЫ</span>
                  <h4 className="text-lg font-bold text-foreground">Творчество на ткани</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="col-span-6 md:col-span-4">
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src={portfolio4}
                alt="Худи с принтом"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold text-foreground">Тёплый сезон</h4>
              </div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-4">
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src={portfolio5}
                alt="Эко шопер"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold text-foreground">Эко стиль</h4>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center min-h-[200px]">
              <span className="text-6xl font-black neon-text mb-2">500+</span>
              <span className="text-muted-foreground">довольных клиентов</span>
              <button className="mt-4 gradient-btn px-6 py-2 rounded-lg text-sm font-semibold text-background">
                <span className="relative z-10">Смотреть все работы</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
