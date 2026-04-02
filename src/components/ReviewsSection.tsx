import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, ChevronDown, ChevronUp, MessageSquarePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const ReviewForm = lazy(() => import('@/components/ReviewForm'));

const staticReviews = [
  { id: 's1', name: 'Nataliya', content: 'Заказывала печать на футболке, выполнено идеально, все пожелания были учтены. Заказом осталась довольна, главное очень понравилась любимому человеку, подарок удался! Спасибо большое!', rating: 5, avatar: 'N' },
  { id: 's2', name: 'Кристина', content: 'Заказала нанесение принта на футболку и худик, получилось очень красочная передача цвета на худик и футболку, цена адекватная, буду и вновь обращаться', rating: 5, avatar: 'К' },
  { id: 's3', name: 'Александр', content: 'Быстро договорились с продавцом, согласовали макет, быстрое исполнение. Сочетание цены и качества. Советую к заказам.', rating: 5, avatar: 'А' },
  { id: 's4', name: 'Екатерина', content: 'Очень оперативно напечатали на футболке, вышло очень красиво и недорого', rating: 5, avatar: 'Е' },
  { id: 's5', name: 'Маргарита', content: 'Очень понравилось! Сделали быстро и получилось красиво 🥰', rating: 5, avatar: 'М' },
  { id: 's6', name: 'Nadezda', content: 'Хорошая компания 👍 всем рекомендую ❤️‍🩹 сделали все быстро и качественно ✅ Единственные кто ответил сразу после запроса 😊 Взяла кружку в подарок 🎁 Обязательно буду брать ещё ❤ Так же ребята делают футболки хорошего качества 👍 В общем всем рекомендую продавца 👍❤✅', rating: 5, avatar: 'N' },
  { id: 's7', name: 'Лель', content: 'Рекомендую к сотрудничеству 💯 Цена=качество 👍 Все пожелания были учтены на 100% Ребёнок в восторге, спасибо за пакетик с котиком 😉👌 Буду обращаться еще 🌸', rating: 5, avatar: 'Л' },
  { id: 's8', name: 'Евгения', content: 'Спасибо большое за оперативную печать: очень меня выручили! Ребенок получил на день рождения то, о чем даже мечтать не мог )))', rating: 5, avatar: 'Е' },
  { id: 's9', name: 'Мари', content: 'Благодарна за скорость и качество. Заказывала печать на футболке. Сделали за 2 часа и результат супер ❤️', rating: 5, avatar: 'М' },
  { id: 's10', name: 'Владимир', content: 'Договорились о встрече. На месте подробно рассказали о разных методах печати с их плюсами и минусами. Доработали мою картинку под задание. Напечатали за 15 минут! Очень рад что обратился в это место! Компетентная общительная девушка! Я очень доволен результатом!', rating: 5, avatar: 'В' },
  { id: 's11', name: 'Мария', content: 'Спасибо большое! Заказ выполнили на высшем уровне! Очень круто, что на месте помогаете с деталями и не только). Рекомендую всем, кому важно качество!', rating: 5, avatar: 'М' },
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
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col min-h-[200px]">
      <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary/30 mb-2 flex-shrink-0" />
      <div className="flex flex-col flex-1">
        <p className={`text-xs sm:text-sm text-foreground leading-relaxed ${!isExpanded && isLongText ? 'line-clamp-4' : ''}`}>
          "{review.content}"
        </p>
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-xs sm:text-sm hover:underline transition-all text-left mt-2 flex-shrink-0 flex items-center gap-1"
          >
            {isExpanded ? (<>Свернуть <ChevronUp className="w-3 h-3" /></>) : (<>Читать далее <ChevronDown className="w-3 h-3" /></>)}
          </button>
        )}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3 border-t border-primary/10 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full neon-border flex items-center justify-center bg-background">
            <span className="text-xs sm:text-sm font-bold neon-text">{review.avatar}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">{review.name}</h4>
        </div>
        <div className="flex gap-0.5">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-primary text-primary" />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [allReviews, setAllReviews] = useState<Review[]>(staticReviews);

  // Load approved reviews from DB
  useEffect(() => {
    const loadReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, name, content, rating, created_at')
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

  return (
    <section id="отзывы" className="py-10 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-neon-cyan/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-neon-magenta/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="text-center mb-6 sm:mb-10">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">
            ОТЗЫВЫ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
            <span className="text-foreground">Отзывы наших </span>
            <span className="neon-text">клиентов</span>
          </h2>
        </header>

        <div className="max-w-3xl mx-auto">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button onClick={handlePrev} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
            <div className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index * 2); }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 2) === index
                      ? 'w-4 sm:w-6 bg-primary neon-glow-cyan'
                      : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            <button onClick={handleNext} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
          </div>

          {/* Yandex Badge + Leave Review Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 sm:mt-8">
            <iframe
              src="https://yandex.ru/sprav/widget/rating-badge/105530576058?type=rating&theme=dark"
              width="150"
              height="50"
              frameBorder="0"
              title="Рейтинг на Яндекс"
              loading="lazy"
            />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Оставить отзыв
            </button>
          </div>
        </div>
      </div>

      {/* Review Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Оставить отзыв</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
            <ReviewForm onClose={() => setShowForm(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsSection;
