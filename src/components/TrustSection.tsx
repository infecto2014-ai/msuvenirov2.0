import { useRef, useEffect, useState } from 'react';

import client1 from '@/assets/clients/client-1.png';
import client2 from '@/assets/clients/client-2.png';
import client3 from '@/assets/clients/client-3.png';
import client4 from '@/assets/clients/client-4.png';
import client5 from '@/assets/clients/client-5.png';
import client6 from '@/assets/clients/client-6.png';
import client7 from '@/assets/clients/client-7.png';
import client8 from '@/assets/clients/client-8.png';

const baseClients = [
  { id: 1, name: 'Клиент 1', logo: client1 },
  { id: 2, name: 'Арле Парк', logo: client2 },
  { id: 3, name: 'Fonbet', logo: client3 },
  { id: 4, name: 'Папаша Бенне', logo: client4 },
  { id: 5, name: 'Неудержимые', logo: client5 },
  { id: 6, name: 'Клиент 6', logo: client6 },
  { id: 7, name: 'Клиент 7', logo: client7 },
  { id: 8, name: 'Котик', logo: client8 },
];

// Duplicate 4x to ensure smooth looping on ultra-wide screens
const clients = [
  ...baseClients.map((c, i) => ({ ...c, id: i + 1 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 9 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 17 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 25 })),
];

const TrustSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth / 2;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused) {
        scrollPositionRef.current += speed;
        
        // Reset position when we've scrolled half the content (seamless loop)
        if (scrollPositionRef.current >= scrollWidth) {
          scrollPositionRef.current = 0;
        }
        
        if (scrollContainer) {
          scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      {/* Background with smooth transition to ContactSection */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[hsl(260,25%,6%)]" />
      
      {/* Title - centered with container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            <span className="text-foreground">Корпоративные клиенты </span>
            <span className="neon-text">доверяют нам</span>
          </h2>
        </header>
      </div>
      
      {/* Full-width carousel - Edge to Edge */}
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div 
          ref={scrollRef}
          className="flex items-center will-change-transform"
          style={{ width: 'fit-content' }}
        >
          {clients.map((client) => (
            <div 
              key={client.id} 
              className="flex-shrink-0 px-4 sm:px-6"
            >
              <div className="relative flex items-center justify-center py-4">
                {/* Neon glow background */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-60"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.12) 0%, rgba(168, 85, 247, 0.08) 30%, transparent 60%)',
                  }}
                />
                
                {/* Protected Logo */}
                <img
                  src={client.logo}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative z-10 h-12 sm:h-16 md:h-20 w-auto max-w-[100px] sm:max-w-[130px] md:max-w-[150px] object-contain select-none pointer-events-none"
                  style={{
                    WebkitUserDrag: 'none',
                    userSelect: 'none',
                  } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
