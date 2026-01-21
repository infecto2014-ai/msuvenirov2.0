import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';

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

// Duplicate clients 3x to ensure smooth looping on ultra-wide screens
const clients = [
  ...baseClients.map((c, i) => ({ ...c, id: i + 1 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 9 })),
  ...baseClients.map((c, i) => ({ ...c, id: i + 17 })),
];

const TrustSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleMouseEnter = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Title - centered with container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            НАМ <span className="neon-text">ДОВЕРЯЮТ</span>
          </h2>
        </div>
      </div>
      
      {/* Full-width Swiper Container - Edge to Edge */}
      <div 
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient fade edges - now at true viewport edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <Swiper
          modules={[Autoplay, FreeMode]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView="auto"
          loop={true}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.5,
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={4000}
          grabCursor={true}
          centeredSlides={true}
          className="!overflow-visible"
        >
          {clients.map((client) => (
            <SwiperSlide 
              key={client.id} 
              className="!w-auto"
            >
              <div className="relative flex items-center justify-center px-4 sm:px-6 py-4">
                {/* Neon glow background */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-60 transition-opacity duration-300"
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TrustSection;
