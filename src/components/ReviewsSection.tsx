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
    <section id="отзывы" className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-neon-cyan/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-neon-magenta/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-3">
            ОТЗЫВЫ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            <span className="text-foreground">ЧТО ГОВОРЯТ </span>
            <span className="neon-text">КЛИЕНТЫ</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Two review cards side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleReviews.map((review) => (
                <div key={review.id} className="glass-card rounded-2xl p-6">
                  <Quote className="w-6 h-6 text-primary/30 mb-3" />
                  
                  <p className="text-sm md:text-base text-foreground leading-relaxed mb-4">
                    "{review.content}"
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full neon-border flex items-center justify-center bg-background">
                        <span className="text-sm font-bold neon-text">{review.avatar}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                        <p className="text-xs text-muted-foreground">{review.role}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index * 2);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / 2) === index
                        ? 'w-6 bg-primary neon-glow-cyan'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
