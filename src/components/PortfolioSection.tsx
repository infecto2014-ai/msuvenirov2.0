import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Keyboard navigation
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

  // Swipe handlers
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
    <section id="работы" className="py-10 sm:py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
            <span className="text-foreground">НАШИ </span>
            <span className="neon-text">РАБОТЫ</span>
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base px-4">
            От единичных подарков до корпоративных тиражей. Посмотрите, как мы воплощаем идеи в жизнь.
          </p>
        </div>

        {/* 2 rows x 4 columns Static Grid - Compact squares */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-5xl mx-auto">
          {portfolioImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group overflow-hidden cursor-pointer aspect-square rounded-lg sm:rounded-xl"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-inset ring-primary/50 rounded-lg sm:rounded-xl" />
            </div>
          ))}
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
    </section>
  );
};

export default PortfolioSection;
