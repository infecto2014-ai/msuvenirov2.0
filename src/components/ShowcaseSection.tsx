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
    <section id="витрина" className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="relative flex items-center justify-center gap-4">
          {/* Navigation Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Products */}
          <div className="flex items-center justify-center gap-4 py-6">
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
                      <div className="neon-ring w-48 h-48 -top-4 -left-4" style={{ animationDelay: '0s' }} />
                      <div className="neon-ring w-56 h-56 -top-8 -left-8" style={{ animationDelay: '0.5s', borderColor: 'hsl(var(--neon-magenta))', boxShadow: '0 0 15px hsl(var(--neon-magenta) / 0.6)' }} />
                    </>
                  )}

                  <div className={`relative glass-card rounded-2xl p-4 ${isActive ? 'neon-glow' : ''}`}>
                    <div className="w-36 h-36 flex items-center justify-center mb-3">
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
                        <h3 className="text-lg font-bold text-foreground mb-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                        <span className="text-base font-bold neon-text">{product.price}</span>
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
            className="absolute right-0 z-20 w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-primary neon-glow-cyan'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
