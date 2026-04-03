import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, ChevronUp, ArrowRight, ExternalLink } from 'lucide-react';


const YANDEX_MAPS_URL = 'https://yandex.ru/maps/-/CHuaBZFR';

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

const TEXT_THRESHOLD = 150;

interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar: string;
}

const ReviewCard = ({ review }: { review: Review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = review.content.length > TEXT_THRESHOLD;

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 sm:p-6 flex flex-col min-h-[240px] hover:border-primary/20 transition-all duration-300">
      <Quote className="w-5 h-5 text-primary/20 mb-3 flex-shrink-0" />

      <div className="flex flex-col flex-1">
        <p className={`text-sm sm:text-[15px] text-foreground/80 leading-relaxed ${!isExpanded && isLongText ? 'line-clamp-4' : ''}`}>
          {review.content}
        </p>
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-xs sm:text-sm hover:text-primary/80 transition-all text-left mt-2 flex-shrink-0 flex items-center gap-1.5 group"
          >
            {isExpanded ? (
              <>Свернуть <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" /></>
            ) : (
              <>Читать далее <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border/20 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [allReviews, setAllReviews] = useState<Review[]>(staticReviews);

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

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % allReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, allReviews.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 1 ? allReviews.length - 2 : prev - 2));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 2) % allReviews.length);
  };

  const visibleReviews = [
    allReviews[currentIndex % allReviews.length],
    allReviews[(currentIndex + 1) % allReviews.length],
  ];
  const totalPages = Math.ceil(allReviews.length / 2);
  const activePage = Math.floor(currentIndex / 2);

  return (
    <section id="отзывы" className="py-16 sm:py-24 relative overflow-hidden" aria-label="Отзывы клиентов">
      {/* Background */}
      <div className="absolute inset-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-8 sm:mb-10">
          Отзывы наших клиентов
        </h2>

        {/* Yandex Rating Trust Block */}
        <a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
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
              Базируется на 120+ отзывах
            </p>
          </div>
        </a>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Side Arrows */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Mobile arrows + Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={handlePrev}
              className="sm:hidden w-10 h-10 rounded-full border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Предыдущий"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index * 2); }}
                  className="relative flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label={`Страница ${index + 1}`}
                >
                  <span className={`block rounded-full transition-all duration-300 ${
                    activePage === index
                      ? 'w-8 h-2.5 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]'
                      : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/40'
                  }`} />
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="sm:hidden w-10 h-10 rounded-full border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
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
