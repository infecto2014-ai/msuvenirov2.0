import { useState } from 'react';
import { X } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          {portfolioImages.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden cursor-pointer aspect-square rounded-lg sm:rounded-xl"
              onClick={() => setSelectedImage(image.src)}
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

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
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
