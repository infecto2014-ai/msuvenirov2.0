import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';
import portfolio6 from '@/assets/portfolio-6.jpg';
import portfolio7 from '@/assets/portfolio-7.jpg';
import portfolio8 from '@/assets/portfolio-8.jpg';
import portfolio9 from '@/assets/portfolio-9.jpg';
import portfolio10 from '@/assets/portfolio-10.jpg';
import portfolio11 from '@/assets/portfolio-11.jpg';
import portfolio12 from '@/assets/portfolio-12.jpg';
import portfolio13 from '@/assets/portfolio-13.jpg';
import portfolio14 from '@/assets/portfolio-14.jpg';
import portfolio15 from '@/assets/portfolio-15.jpg';
import portfolio16 from '@/assets/portfolio-16.jpg';
import portfolio17 from '@/assets/portfolio-17.jpg';
import portfolio18 from '@/assets/portfolio-18.jpg';
import portfolio19 from '@/assets/portfolio-19.jpg';
import portfolio20 from '@/assets/portfolio-20.jpg';
import portfolio21 from '@/assets/portfolio-21.jpg';
import portfolio22 from '@/assets/portfolio-22.jpg';
import portfolio23 from '@/assets/portfolio-23.jpg';
import portfolio24 from '@/assets/portfolio-24.jpg';
import portfolio25 from '@/assets/portfolio-25.jpg';
import portfolio26 from '@/assets/portfolio-26.jpg';
import portfolio27 from '@/assets/portfolio-27.jpg';
import portfolio28 from '@/assets/portfolio-28.jpg';
import portfolio29 from '@/assets/portfolio-29.jpg';
import portfolio30 from '@/assets/portfolio-30.jpg';

interface PortfolioItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  details: string;
}

const portfolioItems: PortfolioItem[] = [
  { id: 1, src: portfolio10, alt: 'Маски За Родину', title: 'Брендированные маски для компании «За Родину»', details: 'Красные хлопковые маски с белым DTF-принтом. Изготовлено для корпоративного мероприятия.' },
  { id: 2, src: portfolio29, alt: 'Магниты-календари', title: 'Сувенирные магниты-календари на 2025 год', details: 'Магниты с уникальным пейзажем и календарной сеткой. Сублимационная печать.' },
  { id: 3, src: portfolio23, alt: 'Футболка Dmitry', title: 'Персонализированная футболка «Dmitry»', details: 'Белая футболка с монохромным портретом и текстом. DTF-печать.' },
  { id: 4, src: portfolio1, alt: 'Мерч Harry Potter', title: 'Фанатский мерч по вселенной Harry Potter', details: 'Белая футболка с фирменной эмблемой факультета. DTF-печать.' },
  { id: 5, src: portfolio11, alt: 'Футболки BLACKPINK', title: 'Комплект футболок для фанатов BLACKPINK', details: 'Яркий дизайн с фото участниц группы. DTF-печать, стойкость 60+ стирок.' },
  { id: 6, src: portfolio18, alt: 'Бокалы с гравировкой', title: 'Подарочные бокалы с гравировкой', details: 'Персонализированная лазерная гравировка на стекле. Подарок на годовщину.' },
  { id: 7, src: portfolio25, alt: 'Кофейный набор', title: 'Кофейный набор с фотопечатью', details: 'Керамические кружки с индивидуальным дизайном. Сублимационная печать.' },
  { id: 8, src: portfolio3, alt: 'Футболка Punch-Out', title: 'Ретро-принт в стиле Punch-Out!!', details: 'Стилизованный арт из культовой игры. DTF-печать на белой футболке.' },
  { id: 9, src: portfolio20, alt: 'Корпоративные футболки', title: 'Корпоративная партия футболок', details: 'Тираж 50+ штук с логотипом компании. DTF-печать, единый стиль для команды.' },
  { id: 10, src: portfolio5, alt: 'Худи с мангой', title: 'Худи с иллюстрацией в стиле манга', details: 'Детализированный аниме-арт на чёрном худи. DTF-печать высокого разрешения.' },
  { id: 11, src: portfolio24, alt: 'Брелоки акриловые', title: 'Акриловые брелоки с полиграфической вставкой', details: 'Акриловые брелоки с тематическим дизайном и полиграфической вставкой.' },
  { id: 12, src: portfolio2, alt: 'Кружка Kaliningrad', title: 'Сувенирная кружка «Kaliningrad»', details: 'Кружка с авторской иллюстрацией города. Сублимационная печать 360°.' },
  { id: 13, src: portfolio12, alt: 'Мерч Stray Kids', title: 'Фанатский мерч Stray Kids', details: 'Футболка с принтом участников группы. DTF-печать, мягкий на ощупь принт.' },
  { id: 14, src: portfolio7, alt: 'Шоппер Калининград', title: 'Эко-шоппер с видами Калининграда', details: 'Авторский дизайн на хлопковой сумке. Сублимационная печать.' },
  { id: 15, src: portfolio21, alt: 'Футболка с фотоколлажем', title: 'Футболка с фотоколлажем на заказ', details: 'Персональный коллаж из семейных фотографий. DTF-печать с высокой детализацией.' },
  { id: 16, src: portfolio4, alt: 'Детская футболка', title: 'Детская футболка с любимым персонажем', details: 'Яркий принт на детском хлопке. DTF-печать.' },
  { id: 17, src: portfolio17, alt: 'Зонт с принтом', title: 'Зонт с индивидуальным принтом', details: 'Полноцветная DTF-печать на куполе зонта.' },
  { id: 18, src: portfolio30, alt: 'Кружки с детскими рисунками', title: 'Кружки с детскими рисунками', details: 'Детские рисунки на керамических кружках. Подарок бабушке и дедушке.' },
  { id: 19, src: portfolio6, alt: 'Новогодний шар', title: 'Новогодний ёлочный шар с фотопечатью', details: 'Персонализированный шар с семейным фото. Сублимационная печать.' },
  { id: 20, src: portfolio22, alt: 'Футболка с детскими фото', title: 'Футболка с детскими фотографиями', details: 'Коллаж из детских снимков на белой футболке. DTF-печать.' },
  { id: 21, src: portfolio8, alt: 'Футболка и кепка', title: 'Комплект: футболка + кепка с принтом', details: 'Единый стиль для кепки и футболки. Термотрансферная плёнка золотого цвета.' },
  { id: 22, src: portfolio13, alt: 'Игрушка с принтом', title: 'Мягкая игрушка с именным принтом', details: 'Персонализированная DTF-печать имени на плюшевом мишке.' },
  { id: 23, src: portfolio26, alt: 'Вымпел Гортранс', title: 'Корпоративный вымпел «Гортранс»', details: 'Двусторонний вымпел с логотипом. Сублимационная печать на атласе.' },
  { id: 24, src: portfolio14, alt: 'Кофейный набор', title: 'Кофейный набор с индивидуальным дизайном', details: 'Набор кружек с авторским оформлением. Сублимационная печать.' },
  { id: 25, src: portfolio27, alt: 'Футболка ITZY', title: 'Футболка с дизайном ITZY', details: 'K-pop мерч на белой футболке. DTF-печать с фотографическим качеством.' },
  { id: 26, src: portfolio15, alt: 'Футболки с котом', title: 'Парные футболки с авторским артом кота', details: 'Забавный кот в двух стилях для пары. DTF-печать на хлопке.' },
  { id: 27, src: portfolio19, alt: 'Кружки серебряные', title: 'Кружки с зеркальным серебряным покрытием', details: 'Премиальные кружки с металлизированным эффектом. Сублимация.' },
  { id: 28, src: portfolio9, alt: 'Футболка с принтом', title: 'Футболка с авторским принтом', details: 'Индивидуальный дизайн по эскизу клиента. DTF-печать.' },
  { id: 29, src: portfolio16, alt: 'Медаль', title: 'Наградная медаль с гравировкой', details: 'Металлическая медаль с лазерной гравировкой. Для спортивного мероприятия.' },
  { id: 30, src: portfolio28, alt: 'Футболка Кант', title: 'Футболка с портретом Иммануила Канта', details: 'Стилизованный портрет на чёрной футболке. DTF-печать, символ Калининграда.' },
];

const PortfolioCard = ({ item, onClick }: { item: PortfolioItem; onClick: () => void }) => (
  <div className="group cursor-pointer" onClick={onClick}>
    <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.src}
          alt={`${item.alt} — печать на заказ в Калининграде`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="bg-card p-3.5 sm:p-4 space-y-1.5">
        <h3 className="text-sm sm:text-[15px] font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
          {item.details}
        </p>
      </div>
    </div>
  </div>
);

const PortfolioSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const minSwipeDistance = 50;

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? portfolioItems.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % portfolioItems.length);
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
  };

  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) orderButton.click();
  };

  return (
    <section id="работы" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Портфолио работ" role="region">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
            Примеры наших работ
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
            Создаём уникальные вещи — от масок и футболок до сложных календарей и корпоративных подарков.
            Единичные экземпляры и крупные тиражи. Работаем с 10+ современными технологиями печати.
          </p>
        </header>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            grabCursor={true}
            loop={true}
            pagination={false}
            navigation={{
              nextEl: '.portfolio-next',
              prevEl: '.portfolio-prev',
            }}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            modules={[Navigation, Pagination]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
            className="!pb-4"
          >
            {portfolioItems.map((item, index) => (
              <SwiperSlide key={item.id}>
                <PortfolioCard item={item} onClick={() => setSelectedIndex(index)} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="portfolio-prev absolute left-0 sm:-left-5 lg:-left-7 top-[35%] -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            className="portfolio-next absolute right-0 sm:-right-5 lg:-right-7 top-[35%] -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Slide Counter + CTA */}
        <div className="flex items-center justify-center gap-6 mt-5 sm:mt-6">
          <span className="text-sm font-semibold text-primary tabular-nums tracking-wide drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
            {activeSlide + 1} <span className="text-muted-foreground/60">/</span> {portfolioItems.length}
          </span>
          <button
            onClick={handleOrderClick}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300"
          >
            <MessageSquare className="w-5 h-5" />
            Хочу похожий принт!
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="max-w-[85vw] max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={portfolioItems[selectedIndex].src}
              alt={portfolioItems[selectedIndex].alt}
              className="max-w-full max-h-[65vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center max-w-lg px-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">{portfolioItems[selectedIndex].title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{portfolioItems[selectedIndex].details}</p>
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card border border-border/40">
            <span className="text-sm text-muted-foreground">
              {selectedIndex + 1} / {portfolioItems.length}
            </span>
          </div>
        </div>
      )}

    </section>
  );
};

export default PortfolioSection;
