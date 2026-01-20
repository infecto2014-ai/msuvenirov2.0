import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tshirtImage from '@/assets/product-tshirt.png';
import hoodieImage from '@/assets/product-hoodie.png';
import shopperImage from '@/assets/product-shopper.png';
import notebookImage from '@/assets/product-notebook.png';
import puzzleImage from '@/assets/product-puzzle.png';
import cardsImage from '@/assets/product-cards.png';

const products = [
  {
    id: 1,
    name: 'Футболка',
    description: 'Премиум хлопок, DTG печать',
    price: 'от 990 ₽',
    image: tshirtImage,
  },
  {
    id: 2,
    name: 'Худи',
    description: 'Утеплённый флис, вышивка',
    price: 'от 2490 ₽',
    image: hoodieImage,
  },
  {
    id: 3,
    name: 'Шопер',
    description: 'Эко-материал, шелкография',
    price: 'от 490 ₽',
    image: shopperImage,
  },
  {
    id: 4,
    name: 'Блокнот с ручкой',
    description: 'Премиум качество, персонализация',
    price: 'от 590 ₽',
    image: notebookImage,
  },
  {
    id: 5,
    name: 'Пазл',
    description: 'Фотопечать, подарочная упаковка',
    price: 'от 790 ₽',
    image: puzzleImage,
  },
  {
    id: 6,
    name: 'Визитки',
    description: 'Премиум бумага, дизайн',
    price: 'от 290 ₽',
    image: cardsImage,
  },
];

const ShowcaseSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const getVisibleProducts = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + products.length) % products.length;
      visible.push({ ...products[index], offset: i });
    }
    return visible;
  };

  return (
    <section id="витрина" className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Navigation Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>

          {/* Products */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6 px-8 sm:px-12">
            {getVisibleProducts().map((product) => {
              const isActive = product.offset === 0;
              
              return (
                <div
                  key={`${product.id}-${product.offset}`}
                  onClick={() => {
                    if (product.offset !== 0) {
                      setActiveIndex((activeIndex + product.offset + products.length) % products.length);
                    }
                  }}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? 'scale-100 z-10' 
                      : 'scale-75 opacity-50 hover:opacity-75 hidden sm:block'
                  }`}
                >
                  {/* Neon rings */}
                  {isActive && (
                    <>
                      <div className="neon-ring w-36 sm:w-44 h-36 sm:h-44 -top-2 sm:-top-4 -left-2 sm:-left-4" style={{ animationDelay: '0s' }} />
                      <div className="neon-ring w-44 sm:w-52 h-44 sm:h-52 -top-6 sm:-top-8 -left-6 sm:-left-8" style={{ animationDelay: '0.5s', borderColor: 'hsl(var(--neon-magenta))', boxShadow: '0 0 15px hsl(var(--neon-magenta) / 0.6)' }} />
                    </>
                  )}

                  <div className={`relative glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 ${isActive ? 'neon-glow' : ''}`}>
                    <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-2 sm:mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`max-w-full max-h-full object-contain transition-transform duration-500 ${
                          isActive ? 'animate-float' : ''
                        }`}
                      />
                    </div>
                    
                    {isActive && (
                      <div className="text-center">
                        <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">{product.name}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">{product.description}</p>
                        <span className="text-sm sm:text-base font-bold neon-text">{product.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Right */}
          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-4 sm:w-6 bg-primary neon-glow-cyan'
                  : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
