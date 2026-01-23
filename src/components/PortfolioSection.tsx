import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';

const portfolioImages = [
  { id: 1, src: portfolio1, alt: 'Работа 1' },
  { id: 2, src: portfolio2, alt: 'Работа 2' },
  { id: 3, src: portfolio3, alt: 'Работа 3' },
  { id: 4, src: portfolio4, alt: 'Работа 4' },
  { id: 5, src: portfolio5, alt: 'Работа 5' },
  { id: 6, src: portfolio1, alt: 'Работа 6' },
  { id: 7, src: portfolio2, alt: 'Работа 7' },
  { id: 8, src: portfolio3, alt: 'Работа 8' },
];

const PortfolioSection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? portfolioImages.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % portfolioImages.length);
    }
  }, [selectedIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  // Swipe handlers for lightbox
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section id="работы" className="py-12 sm:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
            <span className="text-foreground">НАШИ </span>
            <span className="neon-text">РАБОТЫ</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-4">
            От единичных подарков до корпоративных тиражей. Посмотрите, как мы воплощаем идеи в жизнь.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            grabCursor={true}
            loop={true}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30 !w-2 !h-2 sm:!w-3 sm:!h-3 !mx-1 transition-all duration-300',
              bulletActiveClass: '!bg-primary !w-6 sm:!w-8 !rounded-full neon-glow-cyan',
            }}
            navigation={{
              nextEl: '.portfolio-next',
              prevEl: '.portfolio-prev',
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
            modules={[Navigation, Pagination]}
            onSwiper={setSwiperInstance}
            className="!pb-12 sm:!pb-14"
          >
            {portfolioImages.map((image, index) => (
              <SwiperSlide key={image.id}>
                <div
                  className="relative group overflow-hidden cursor-pointer aspect-[4/3] rounded-xl sm:rounded-2xl"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-inset ring-primary/50 rounded-xl sm:rounded-2xl" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="portfolio-prev absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/90 backdrop-blur-sm hover:neon-glow transition-all duration-300"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>
          <button
            className="portfolio-next absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/90 backdrop-blur-sm hover:neon-glow transition-all duration-300"
            onClick={() => swiperInstance?.slideNext()}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
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
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300 z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300 z-10"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>

          {/* Image */}
          <img
            src={portfolioImages[selectedIndex].src}
            alt={portfolioImages[selectedIndex].alt}
            className="max-w-[85vw] max-h-[80vh] object-contain rounded-2xl neon-glow"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image counter */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm neon-border">
            <span className="text-sm text-foreground">
              {selectedIndex + 1} / {portfolioImages.length}
            </span>
          </div>
        </div>
      )}

      {/* Custom Swiper Styles */}
      <style>{`
        #работы .swiper-pagination {
          position: relative !important;
          margin-top: 0.5rem !important;
        }
      `}</style>
    </section>
  );
};

export default PortfolioSection;
