import { useRef, useCallback } from 'react';

import client1 from '@/assets/clients/client-1.webp';
import client2 from '@/assets/clients/client-2.webp';
import client3 from '@/assets/clients/client-3.webp';
import client4 from '@/assets/clients/client-4.webp';
import client5 from '@/assets/clients/client-5.webp';
import client6 from '@/assets/clients/client-6.webp';
import client7 from '@/assets/clients/client-7.webp';
import client8 from '@/assets/clients/client-8.webp';

const baseClients = [
  { id: 1, name: 'Корпоративный партнёр', logo: client1 },
  { id: 2, name: 'Арле Парк', logo: client2 },
  { id: 3, name: 'Fonbet', logo: client3 },
  { id: 4, name: 'Папаша Бенне', logo: client4 },
  { id: 5, name: 'Неудержимые', logo: client5 },
  { id: 6, name: 'Партнёр', logo: client6 },
  { id: 7, name: 'Постоянный клиент', logo: client7 },
  { id: 8, name: 'Котик', logo: client8 },
];

// Triple set for seamless CSS loop
const clients = [
  ...baseClients.map((c, i) => ({ ...c, id: i + 1 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 9 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 17 })),
];

const TrustSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePause = useCallback(() => {
    scrollRef.current?.style.setProperty('animation-play-state', 'paused');
  }, []);
  const handleResume = useCallback(() => {
    scrollRef.current?.style.setProperty('animation-play-state', 'running');
  }, []);

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden" aria-label="Корпоративные клиенты">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-muted/30 dark:to-[hsl(260,25%,6%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            <span className="text-foreground">Корпоративные клиенты </span>
            <span className="neon-text">доверяют нам</span>
          </h2>
        </header>
      </div>
      
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className="flex items-center will-change-transform animate-marquee"
          style={{ width: 'fit-content' }}
        >
          {clients.map((client) => (
            <div 
              key={client.id} 
              className="flex-shrink-0 px-4 sm:px-6"
            >
              <div className="relative flex items-center justify-center py-4">
                <div 
                  className="absolute inset-0 rounded-xl opacity-60"
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(var(--neon-cyan) / 0.12) 0%, hsl(var(--neon-purple) / 0.08) 30%, transparent 60%)',
                  }}
                />
                
                <img
                  src={client.logo}
                  alt=""
                  aria-hidden="true"
                  width={130}
                  height={80}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  loading="lazy"
                  decoding="async"
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
