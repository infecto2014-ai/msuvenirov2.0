import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, portfolioImages.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const visibleImages = portfolioImages.slice(currentIndex, currentIndex + itemsPerView);

  // If we're near the end, wrap around
  if (visibleImages.length < itemsPerView) {
    visibleImages.push(...portfolioImages.slice(0, itemsPerView - visibleImages.length));
  }

  const sizes = ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-2', 'col-span-2 row-span-1'];

  return (
    <section id="работы" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            <span className="text-foreground">НАШИ </span>
            <span className="neon-text">РАБОТЫ</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            От единичных подарков до корпоративных тиражей. Посмотрите, как мы воплощаем идеи в жизнь.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px] md:auto-rows-[150px]">
            {visibleImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`relative group overflow-hidden rounded-xl cursor-pointer ${sizes[index % sizes.length]}`}
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-border rounded-xl" />
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-primary neon-glow-cyan'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
          <img
            src={selectedImage}
            alt="Увеличенное изображение"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl neon-glow"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
