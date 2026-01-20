import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tshirtImage from '@/assets/product-tshirt.png';
import hoodieImage from '@/assets/product-hoodie.png';
import shopperImage from '@/assets/product-shopper.png';

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
];

const ShowcaseSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="витрина" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-4">
            3D ВИТРИНА
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
            <span className="neon-text">ВЫБЕРИТЕ</span>
            <span className="text-foreground"> ОСНОВУ</span>
          </h2>
        </div>

        <div className="relative flex items-center justify-center gap-4 md:gap-8">
          {/* Navigation Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 w-12 h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300 md:relative"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          {/* Products */}
          <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
            {products.map((product, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex;
              
              return (
                <div
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? 'scale-110 z-10' 
                      : 'scale-75 opacity-50 hover:opacity-75'
                  } ${Math.abs(offset) > 1 ? 'hidden md:block' : ''}`}
                >
                  {/* Neon rings */}
                  {isActive && (
                    <>
                      <div className="neon-ring w-64 h-64 -top-8 -left-8" style={{ animationDelay: '0s' }} />
                      <div className="neon-ring w-72 h-72 -top-12 -left-12" style={{ animationDelay: '0.5s', borderColor: 'hsl(var(--neon-magenta))', boxShadow: '0 0 15px hsl(var(--neon-magenta) / 0.6)' }} />
                    </>
                  )}

                  <div className={`relative glass-card rounded-2xl p-6 ${isActive ? 'neon-glow' : ''}`}>
                    <div className="w-48 h-48 flex items-center justify-center mb-4">
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
                        <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <span className="text-lg font-bold neon-text">{product.price}</span>
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
            className="absolute right-0 z-20 w-12 h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300 md:relative"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-primary neon-glow-cyan'
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
