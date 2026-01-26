import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, ChevronDown, ChevronUp, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const reviews = [
  {
    id: 1,
    name: 'Nataliya',
    content: 'Заказывала печать на футболке, выполнено идеально, все пожелания были учтены. Заказом осталась довольна, главное очень понравилась любимому человеку, подарок удался! Спасибо большое!',
    rating: 5,
    avatar: 'N',
  },
  {
    id: 2,
    name: 'Кристина',
    content: 'Заказала нанесение принта на футболку и худик, получилось очень красочная передача цвета на худик и футболку, цена адекватная, буду и вновь обращаться',
    rating: 5,
    avatar: 'К',
  },
  {
    id: 3,
    name: 'Александр',
    content: 'Быстро договорились с продавцом, согласовали макет, быстрое исполнение. Сочетание цены и качества. Советую к заказам.',
    rating: 5,
    avatar: 'А',
  },
  {
    id: 4,
    name: 'Екатерина',
    content: 'Очень оперативно напечатали на футболке, вышло очень красиво и недорого',
    rating: 5,
    avatar: 'Е',
  },
  {
    id: 5,
    name: 'Маргарита',
    content: 'Очень понравилось! Сделали быстро и получилось красиво 🥰',
    rating: 5,
    avatar: 'М',
  },
  {
    id: 6,
    name: 'Nadezda',
    content: 'Хорошая компания 👍 всем рекомендую ❤️‍🩹 сделали все быстро и качественно ✅ Единственные кто ответил сразу после запроса 😊 Взяла кружку в подарок 🎁 Обязательно буду брать ещё ❤ Так же ребята делают футболки хорошего качества 👍 В общем всем рекомендую продавца 👍❤✅',
    rating: 5,
    avatar: 'N',
  },
  {
    id: 7,
    name: 'Лель',
    content: 'Рекомендую к сотрудничеству 💯 Цена=качество 👍 Все пожелания были учтены на 100% Ребёнок в восторге, спасибо за пакетик с котиком 😉👌 Буду обращаться еще 🌸',
    rating: 5,
    avatar: 'Л',
  },
  {
    id: 8,
    name: 'Евгения',
    content: 'Спасибо большое за оперативную печать: очень меня выручили! Ребенок получил на день рождения то, о чем даже мечтать не мог )))',
    rating: 5,
    avatar: 'Е',
  },
  {
    id: 9,
    name: 'Мари',
    content: 'Благодарна за скорость и качество. Заказывала печать на футболке. Сделали за 2 часа и результат супер ❤️',
    rating: 5,
    avatar: 'М',
  },
  {
    id: 10,
    name: 'Владимир',
    content: 'Договорились о встрече. На месте подробно рассказали о разных методах печати с их плюсами и минусами. Доработали мою картинку под задание. Напечатали за 15 минут! Очень рад что обратился в это место! Компетентная общительная девушка! Я очень доволен результатом!',
    rating: 5,
    avatar: 'В',
  },
  {
    id: 11,
    name: 'Мария',
    content: 'Спасибо большое! Заказ выполнили на высшем уровне! Очень круто, что на месте помогаете с деталями и не только). Рекомендую всем, кому важно качество!',
    rating: 5,
    avatar: 'М',
  },
];

const TEXT_THRESHOLD = 150;

interface ReviewCardProps {
  review: typeof reviews[0];
}

const ReviewCard = ({ review }: ReviewCardProps) => {
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
            {isExpanded ? (
              <>
                Свернуть
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Читать далее
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3 border-t border-primary/10 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full neon-border flex items-center justify-center bg-background">
            <span className="text-xs sm:text-sm font-bold neon-text">{review.avatar}</span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">{review.name}</h4>
          </div>
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

// Star Rating Component for the form
interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
              star <= (hoverRating || rating)
                ? 'fill-primary text-primary'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Пожалуйста, введите ваше имя');
      return;
    }
    if (!content.trim()) {
      toast.error('Пожалуйста, напишите отзыв');
      return;
    }
    if (rating === 0) {
      toast.error('Пожалуйста, поставьте оценку');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission (can be connected to backend later)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Спасибо за ваш отзыв! Он будет опубликован после модерации.');
    setName('');
    setContent('');
    setRating(0);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-1.5">
          Ваше имя
        </label>
        <Input
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          className="bg-background border-primary/20 focus:border-primary"
          maxLength={50}
        />
      </div>

      <div>
        <label htmlFor="review-content" className="block text-sm font-medium text-foreground mb-1.5">
          Ваш отзыв
        </label>
        <Textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Расскажите о вашем опыте..."
          className="bg-background border-primary/20 focus:border-primary min-h-[100px]"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {content.length}/500
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Ваша оценка
        </label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full neon-border bg-primary/10 hover:bg-primary/20 text-primary font-semibold"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Отправка...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Отправить отзыв
          </span>
        )}
      </Button>
    </form>
  );
};

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 1 ? reviews.length - 2 : prev - 2));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 2) % reviews.length);
  };

  // Get 2 reviews at a time
  const getVisibleReviews = () => {
    const first = reviews[currentIndex % reviews.length];
    const second = reviews[(currentIndex + 1) % reviews.length];
    return [first, second];
  };

  const visibleReviews = getVisibleReviews();
  const totalPages = Math.ceil(reviews.length / 2);

  return (
    <section id="отзывы" className="py-10 sm:py-12 relative overflow-hidden">
      {/* Background */}
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
          <div className="relative">
            {/* Cards container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
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
                {Array.from({ length: totalPages }).map((_, index) => (
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

            {/* Write Review Button */}
            <div className="flex justify-center mt-6">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="neon-border bg-primary/10 hover:bg-primary/20 text-primary font-semibold px-6"
                  >
                    Написать отзыв
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold neon-text">
                      Оставить отзыв
                    </DialogTitle>
                  </DialogHeader>
                  <ReviewForm onClose={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
