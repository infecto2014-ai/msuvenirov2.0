import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Алексей Морозов',
    role: 'CEO, TechStart',
    content: 'Заказывали мерч для всей команды — 50 футболок и 20 худи. Качество печати превосходное, сроки соблюдены. Ребята реально профессионалы!',
    rating: 5,
    avatar: 'А',
  },
  {
    id: 2,
    name: 'Мария Светлова',
    role: 'Дизайнер',
    content: 'Делала принты со своими иллюстрациями. Цветопередача идеальная, хлопок приятный. Теперь только сюда!',
    rating: 5,
    avatar: 'М',
  },
  {
    id: 3,
    name: 'Дмитрий Волков',
    role: 'Организатор мероприятий',
    content: 'Срочный заказ на 100 шоперов к фестивалю — сделали за 3 дня! Все гости были в восторге от качества.',
    rating: 5,
    avatar: 'Д',
  },
  {
    id: 4,
    name: 'Екатерина Новикова',
    role: 'Блогер',
    content: 'Создала свою линейку мерча для подписчиков. Мастерская помогла с дизайном и воплотила всё идеально!',
    rating: 5,
    avatar: 'Е',
  },
];

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  // Get 2 reviews at a time
  const getVisibleReviews = () => {
    const first = reviews[currentIndex];
    const second = reviews[(currentIndex + 1) % reviews.length];
    return [first, second];
  };

  const visibleReviews = getVisibleReviews();

  return (
    <section id="отзывы" className="py-10 sm:py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-neon-cyan/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-neon-magenta/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full neon-border text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">
            ОТЗЫВЫ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
            <span className="text-foreground">ЧТО ГОВОРЯТ </span>
            <span className="neon-text">КЛИЕНТЫ</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Two review cards side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {visibleReviews.map((review) => (
                <div key={review.id} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary/30 mb-2 sm:mb-3" />
                  
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-4">
                    "{review.content}"
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full neon-border flex items-center justify-center bg-background">
                        <span className="text-xs sm:text-sm font-bold neon-text">{review.avatar}</span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">{review.name}</h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{review.role}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handlePrev}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </button>

              <div className="flex gap-1.5 sm:gap-2">
                {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index * 2);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / 2) === index
                        ? 'w-4 sm:w-6 bg-primary neon-glow-cyan'
                        : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
