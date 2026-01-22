import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ShoppingBag } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import nftTshirt from '@/assets/nft-tshirt.jpg';
import nftHoodie from '@/assets/nft-hoodie.jpg';
import nftMug from '@/assets/nft-mug.jpg';
import nftShopper from '@/assets/nft-shopper.jpg';
import nftNotebook from '@/assets/nft-notebook.jpg';
import nftCards from '@/assets/nft-cards.jpg';

const products = [
  {
    id: 1,
    name: 'Футболка',
    methods: 'DTF, Шелкография, Сублимация',
    image: nftTshirt,
  },
  {
    id: 2,
    name: 'Худи',
    methods: 'DTF, Шелкография, Сублимация',
    image: nftHoodie,
  },
  {
    id: 3,
    name: 'Кружка',
    methods: 'Сублимация, Гравировка, УФ',
    image: nftMug,
  },
  {
    id: 4,
    name: 'Шоппер',
    methods: 'DTF, Шелкография, Сублимация',
    image: nftShopper,
  },
  {
    id: 5,
    name: 'Канцелярия',
    methods: 'Цифровая печать, УФ',
    image: nftNotebook,
  },
  {
    id: 6,
    name: 'Бейсболка',
    methods: 'DTF, Шелкография',
    image: nftCards,
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(260,30%,8%)] to-background" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--neon-magenta)/0.15)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(var(--neon-cyan)/0.1)] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text">Наша продукция</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите товар и создайте уникальный дизайн
          </p>
        </div>

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
                  >
                    {/* Card */}
                    <div
                      className={`relative rounded-[2rem] overflow-hidden transition-all duration-500 ${
                        isActive
                          ? 'shadow-[0_0_60px_-10px_hsl(var(--neon-cyan)/0.6),0_0_40px_-15px_hsl(var(--neon-magenta)/0.4)]'
                          : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-[3/4] w-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Glassmorphism Info Panel */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-background/40 backdrop-blur-xl border-t border-white/10">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base sm:text-lg truncate">
                              {product.name}
                            </h3>
                            <p className="text-white/90 text-[11px] sm:text-xs leading-tight">
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

          {/* Custom Navigation Buttons */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/80 backdrop-blur-sm hover:neon-glow transition-all duration-300 hidden sm:flex"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full neon-border flex items-center justify-center bg-background/80 backdrop-blur-sm hover:neon-glow transition-all duration-300 hidden sm:flex"
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
