import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ReviewForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    if (!trimmedName || trimmedName.length > 100) {
      toast.error('Введите имя (до 100 символов)');
      return;
    }
    if (!trimmedContent || trimmedContent.length < 10 || trimmedContent.length > 1000) {
      toast.error('Отзыв должен содержать от 10 до 1000 символов');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        name: trimmedName,
        content: trimmedContent,
        rating,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch {
      toast.error('Ошибка при отправке. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6 space-y-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Спасибо за ваш отзыв!</h3>
        <p className="text-sm text-muted-foreground">
          Ваш отзыв будет опубликован после модерации.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Закрыть
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Ваша оценка</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= (hoveredStar || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground/30'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-1">
          Ваше имя
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          placeholder="Как вас зовут?"
          className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="review-content" className="block text-sm font-medium text-foreground mb-1">
          Ваш отзыв
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Расскажите о вашем опыте..."
          className="w-full rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          required
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{content.length}/1000</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-medium py-2.5 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Отправить отзыв
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
