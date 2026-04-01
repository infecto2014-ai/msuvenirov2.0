import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ShoppingBag } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import imgTshirt from '@/assets/showcase/tshirt.jpg';
import imgHoodie from '@/assets/showcase/hoodie.jpg';
import imgShopper from '@/assets/showcase/shopper.jpg';
import imgMug from '@/assets/showcase/mug.jpg';
import imgStationery from '@/assets/showcase/stationery.jpg';
import imgBottle from '@/assets/showcase/bottle.jpg';
import imgKeychains from '@/assets/showcase/keychains.jpg';
import imgAcrylicStand from '@/assets/showcase/acrylic-stand.jpg';
import imgCap from '@/assets/showcase/cap.jpg';
import imgStickers3d from '@/assets/showcase/stickers-3d.jpg';

const products = [
  {
    id: 1,
    name: 'Футболка',
    methods: 'DTF, Шелкография, Сублимация',
    price: 'от 1 350 ₽',
    image: imgTshirt,
  },
  {
    id: 2,
    name: 'Худи',
    methods: 'DTF, Шелкография, Сублимация',
    price: 'от 2 350 ₽',
    image: imgHoodie,
  },
  {
    id: 3,
    name: 'Шоппер',
    methods: 'DTF, Шелкография, Сублимация',
    price: 'от 900 ₽',
    image: imgShopper,
  },
  {
    id: 4,
    name: 'Кружка',
    methods: 'Сублимация, Гравировка, УФ',
    price: 'от 450 ₽',
    image: imgMug,
  },
  {
    id: 5,
    name: 'Канцелярия',
    methods: 'Цифровая печать, УФ',
    price: 'от 60 ₽',
    image: imgStationery,
  },
  {
    id: 6,
    name: 'Бутылочка для воды',
    methods: 'УФ-печать',
    price: 'от 800 ₽',
    image: imgBottle,
  },
  {
    id: 7,
    name: 'Брелоки/Значки',
    methods: 'Цифровая печать, УФ',
    price: 'от 100 ₽',
    image: imgKeychains,
  },
  {
    id: 8,
    name: 'Акриловый стенд',
    methods: 'УФ-печать',
    price: 'от 500 ₽',
    image: imgAcrylicStand,
  },
  {
    id: 9,
    name: 'Бейсболка',
    methods: 'DTF, Шелкография',
    price: 'от 1 000 ₽',
    image: imgCap,
  },
  {
    id: 10,
    name: '3D стикеры',
    methods: 'Эпоксидная смола',
    price: 'от 500 ₽',
    image: imgStickers3d,
  },
];

const ShowcaseSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleOrderClick = () => {
    // Trigger the floating order button
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) {
      orderButton.click();
    }
  };

  return (
    <section id="витрина" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background with smooth transitions */}
      <div className="absolute inset-0 bg-[hsl(260,30%,8%)]" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--neon-magenta)/0.15)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(var(--neon-cyan)/0.1)] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <header className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text">Печать на текстиле и сувенирах</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Футболки, худи, кружки, шопперы и другие изделия с вашим дизайном
          </p>
        </header>

        {/* Swiper Carousel */}
        <div className="relative px-4 sm:px-8">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={0}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30 !w-2 !h-2 sm:!w-3 sm:!h-3 !mx-1 transition-all duration-300',
              bulletActiveClass: '!bg-primary !w-6 sm:!w-8 !rounded-full neon-glow-cyan',
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            modules={[EffectCoverflow, Navigation, Pagination]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="!pb-12 sm:!pb-16"
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={product.id}
                className="!w-[260px] sm:!w-[300px] md:!w-[340px]"
              >
                {({ isActive }) => (
                  <div
                    className={`relative transition-all duration-500 ${
                      isActive ? 'scale-100' : 'scale-90 opacity-60'
                    }`}
                    style={{ willChange: isActive ? 'auto' : 'transform, opacity' }}
                  >
                    {/* Card */}
                    <div
                      className={`relative rounded-[2rem] overflow-hidden transition-all duration-500 ${
                        isActive
                          ? 'shadow-[0_0_60px_-10px_hsl(var(--neon-cyan)/0.6),0_0_40px_-15px_hsl(var(--neon-magenta)/0.4)]'
                          : ''
                      }`}
                    >
                      {/* Image with lazy loading and GPU acceleration */}
                      <figure className="aspect-[3/4] w-full">
                        <img
                          src={product.image}
                          alt={`${product.name} с печатью на заказ в Калининграде — ${product.methods}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          style={{ willChange: 'transform' }}
                        />
                      </figure>

                      {/* Glassmorphism Info Panel - optimized blur for mobile */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-background/50 sm:bg-background/40 backdrop-blur-md sm:backdrop-blur-xl border-t border-white/10">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-sm sm:text-base truncate">
                              {product.name}
                            </h3>
                            <p className="text-white/80 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                              {product.methods}
                            </p>
                          </div>
                          
                          {isActive && (
                            <button
                              onClick={handleOrderClick}
                              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-[hsl(var(--neon-cyan)/0.3)]"
                            >
                              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Neon border glow for active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-[2rem] border-2 border-[hsl(var(--neon-cyan)/0.5)] pointer-events-none" />
                      )}
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - centered vertically relative to cards */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-[calc(50%-2rem)] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/80 backdrop-blur-sm hover:neon-glow transition-all duration-300 hidden sm:flex"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="swiper-button-next-custom absolute right-0 top-[calc(50%-2rem)] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/80 backdrop-blur-sm hover:neon-glow transition-all duration-300 hidden sm:flex"
            onClick={() => swiperInstance?.slideNext()}
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style>{`
        .swiper-pagination {
          position: relative !important;
          margin-top: 1.5rem !important;
        }
        .swiper-slide {
          transition: all 0.5s ease;
        }
      `}</style>
    </section>
  );
};

export default ShowcaseSection;
