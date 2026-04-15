import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, ArrowRight, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { reachGoal } from '@/lib/metrika';

const YANDEX_MAPS_URL = 'https://yandex.ru/maps/org/masterskaya_suvenirov/105530576058/?ll=20.487454%2C54.737492&z=17';

const staticReviews = [
  { id: 's1', name: 'Н. Смирнова', content: 'Заказывала печать на футболке, выполнено идеально, все пожелания были учтены. Заказом осталась довольна, главное очень понравилась любимому человеку, подарок удался! Спасибо большое!', rating: 5, avatar: 'Н' },
  { id: 's2', name: 'К. Волкова', content: 'Заказала нанесение принта на футболку и худик, получилось очень красочная передача цвета на худик и футболку, цена адекватная, буду и вновь обращаться', rating: 5, avatar: 'К' },
  { id: 's3', name: 'А. Петров', content: 'Быстро договорились с продавцом, согласовали макет, быстрое исполнение. Сочетание цены и качества. Советую к заказам.', rating: 5, avatar: 'А' },
  { id: 's4', name: 'Е. Козлова', content: 'Очень оперативно напечатали на футболке, вышло очень красиво и недорого', rating: 5, avatar: 'Е' },
  { id: 's5', name: 'М. Иванова', content: 'Очень понравилось! Сделали быстро и получилось красиво 🥰', rating: 5, avatar: 'М' },
  { id: 's6', name: 'Н. Соколова', content: 'Хорошая компания 👍 всем рекомендую ❤️‍🩹 сделали все быстро и качественно ✅ Единственные кто ответил сразу после запроса 😊 Взяла кружку в подарок 🎁 Обязательно буду брать ещё ❤ Так же ребята делают футболки хорошего качества 👍 В общем всем рекомендую продавца 👍❤✅', rating: 5, avatar: 'Н' },
  { id: 's7', name: 'Л. Морозова', content: 'Рекомендую к сотрудничеству 💯 Цена=качество 👍 Все пожелания были учтены на 100% Ребёнок в восторге, спасибо за пакетик с котиком 😉👌 Буду обращаться еще 🌸', rating: 5, avatar: 'Л' },
  { id: 's8', name: 'Е. Новикова', content: 'Спасибо большое за оперативную печать: очень меня выручили! Ребенок получил на день рождения то, о чем даже мечтать не мог )))', rating: 5, avatar: 'Е' },
  { id: 's9', name: 'М. Александрова', content: 'Благодарна за скорость и качество. Заказывала печать на футболке. Сделали за 2 часа и результат супер ❤️', rating: 5, avatar: 'М' },
  { id: 's10', name: 'В. Кириллов', content: 'Договорились о встрече. На месте подробно рассказали о разных методах печати с их плюсами и минусами. Доработали мою картинку под задание. Напечатали за 15 минут! Очень рад что обратился в это место! Компетентная общительная девушка! Я очень доволен результатом!', rating: 5, avatar: 'В' },
  { id: 's11', name: 'М. Лебедева', content: 'Спасибо большое! Заказ выполнили на высшем уровне! Очень круто, что на месте помогаете с деталями и не только). Рекомендую всем, кому важно качество!', rating: 5, avatar: 'М' },
];

interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar: string;
}

const ReviewModal = ({ review, open, onClose }: { review: Review | null; open: boolean; onClose: () => void }) => {
  if (!review) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-lg p-6 sm:p-8">
        <Quote className="w-6 h-6 text-primary/20 mb-4" />
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
        <div className="mt-6 pt-4 border-t border-border/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-base font-semibold text-primary">{review.avatar}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">{review.name}</span>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </div>
          <a
            href={YANDEX_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors group"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Оригинал на Яндекс Картах</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReviewCard = ({ review, onReadMore }: { review: Review; onReadMore: (review: Review) => void }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [review.content]);

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 sm:p-6 flex flex-col h-[300px] hover:border-primary/20 transition-all duration-300 select-none">
      <Quote className="w-5 h-5 text-primary/20 mb-3 flex-shrink-0" />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <p
          ref={textRef}
          className="text-sm sm:text-[15px] text-foreground/80 leading-relaxed line-clamp-4"
        >
          {review.content}
        </p>
        {isClamped && (
          <button
            onClick={() => onReadMore(review)}
            className="text-primary text-xs sm:text-sm hover:text-primary/80 transition-all text-left mt-2 flex-shrink-0 flex items-center gap-1.5 group"
          >
            Читать далее <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border/20 flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{review.avatar}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">{review.name}</span>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
          </div>
        </div>

        <a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors group"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Оригинал на Яндекс Картах</span>
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [allReviews, setAllReviews] = useState<Review[]>(staticReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Attach touchmove with passive:false so we can preventDefault on horizontal swipes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      const dx = Math.abs(touchEndX.current - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dx > 10 && dx > dy) {
        isHorizontalSwipe.current = true;
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      const supabase = await import('@/integrations/supabase/client').then(m => m.supabase);
      const { data } = await supabase
        .from('reviews')
        .select('id, name, content, rating, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const dbReviews: Review[] = data.map((r) => ({
          id: r.id,
          name: r.name,
          content: r.content,
          rating: r.rating,
          avatar: r.name.charAt(0).toUpperCase(),
        }));
        setAllReviews([...dbReviews, ...staticReviews]);
      }
    };
    loadReviews();
  }, []);

  const perPage = isMobile ? 1 : 2;

  const slideTo = useCallback((newIndex: number, direction: 'left' | 'right' = 'right') => {
    if (isTransitioning) return;
    setSlideDirection(direction);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 250);
  }, [isTransitioning]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      const next = (currentIndex + perPage) % allReviews.length;
      slideTo(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, allReviews.length, currentIndex, isTransitioning, perPage, slideTo]);

  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false);
    const prev = currentIndex - perPage < 0 ? allReviews.length - perPage : currentIndex - perPage;
    slideTo(prev, 'left');
  }, [currentIndex, perPage, allReviews.length, slideTo]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    slideTo((currentIndex + perPage) % allReviews.length, 'right');
  }, [currentIndex, perPage, allReviews.length, slideTo]);

  // Touch handlers for swipe — prevent vertical scroll during horizontal swipe
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
  };


  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const visibleReviews = Array.from({ length: perPage }, (_, i) =>
    allReviews[(currentIndex + i) % allReviews.length]
  );
  const totalPages = Math.ceil(allReviews.length / perPage);
  const activePage = Math.floor(currentIndex / perPage) % totalPages;

  return (
    <section id="отзывы" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Отзывы клиентов">
      <div className="absolute inset-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-8 sm:mb-10">
          Отзывы наших клиентов
        </h2>

        {/* Yandex Rating Trust Block */}
        <a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reachGoal('yandex_maps_click')}
          className="flex flex-col items-center gap-3 mb-10 sm:mb-14 group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">4.9</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 sm:w-7 sm:h-7 fill-primary text-primary" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-foreground/80 group-hover:text-primary transition-colors">
              Рейтинг на Яндекс Картах
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Базируется на 150+ отзывах
            </p>
          </div>
        </a>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Desktop side arrows */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute -left-14 lg:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border/40 bg-card/50 backdrop-blur-sm items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 z-10"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="hidden sm:flex absolute -right-14 lg:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border/40 bg-card/50 backdrop-blur-sm items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 z-10"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards with swipe support */}
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 sm:gap-5 transition-all duration-250 ease-out will-change-transform`}
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning
                ? `translate3d(${slideDirection === 'right' ? '-30px' : '30px'}, 0, 0)`
                : 'translate3d(0, 0, 0)',
            }}
          >
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onReadMore={setSelectedReview} />
            ))}
          </div>

          <ReviewModal review={selectedReview} open={!!selectedReview} onClose={() => setSelectedReview(null)} />

          {/* Mobile arrows */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:hidden">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Предыдущий"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Следующий"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
