import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Алексей Морозов',
    role: 'CEO, TechStart',
    content: 'Заказывали мерч для всей команды — 50 футболок и 20 худи. Качество печати превосходное, сроки соблюдены. Ребята реально профессионалы своего дела!',
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
    content: 'Создала свою линейку мерча для подписчиков. Мастерская помогла с дизайном и воплотила всё идеально. Рекомендую!',
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

  return (
    <section id="отзывы" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-neon-cyan/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-neon-magenta/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full neon-border text-sm font-medium text-primary mb-4">
            ОТЗЫВЫ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
            <span className="text-foreground">ЧТО ГОВОРЯТ </span>
            <span className="neon-text">КЛИЕНТЫ</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main review card */}
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <Quote className="w-12 h-12 text-primary/30 mb-6" />
              
              <div className="min-h-[150px]">
                <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                  "{reviews[currentIndex].content}"
                </p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full neon-border flex items-center justify-center bg-background">
                    <span className="text-xl font-bold neon-text">{reviews[currentIndex].avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{reviews[currentIndex].name}</h4>
                    <p className="text-muted-foreground">{reviews[currentIndex].role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>

              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-primary neon-glow-cyan'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
