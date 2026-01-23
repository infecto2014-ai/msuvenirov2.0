import { useState, useRef } from 'react';
import { X, Phone, Image, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import InputMask from 'react-input-mask';

const MAX_COMMENT_LENGTH = 300;
const MAX_PHOTOS = 10;

const FloatingOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'comment' && value.length > MAX_COMMENT_LENGTH) {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: 'Ограничение',
        description: `Можно прикрепить максимум ${MAX_PHOTOS} изображений`,
        variant: 'destructive',
      });
    }

    const newPhotos = [...photos, ...filesToAdd];
    setPhotos(newPhotos);

    // Generate previews
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', comment: '' });
    setPhotos([]);
    setPhotoPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone format
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.name.trim() || phoneDigits.length < 11) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните имя и телефон полностью',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('phone', formData.phone.trim());
      submitFormData.append('comment', formData.comment.trim());
      
      // Add all photos
      photos.forEach((photo, index) => {
        submitFormData.append(`photo_${index}`, photo);
      });
      submitFormData.append('photoCount', photos.length.toString());

      const { error } = await supabase.functions.invoke('send-telegram', {
        body: submitFormData,
      });

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время!',
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        data-order-button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full gradient-btn-pulse flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Открыть форму заказа"
      >
        <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-background" />
      </button>

      {/* Order Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold neon-text text-center">
              Оставить заявку
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Ваше имя *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Иван"
                required
              />
            </div>

            {/* Phone with mask */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Телефон *
              </label>
              <InputMask
                mask="+7 (999) 999-99-99"
                value={formData.phone}
                onChange={handlePhoneChange}
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="+7 (900) 123-45-67"
                required
              />
            </div>

            {/* Comment with character counter */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="comment" className="block text-sm font-medium text-foreground">
                  Комментарий
                </label>
                <span className={`text-xs ${formData.comment.length >= MAX_COMMENT_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {formData.comment.length}/{MAX_COMMENT_LENGTH}
                </span>
              </div>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                maxLength={MAX_COMMENT_LENGTH}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                placeholder="Опишите ваш заказ..."
              />
            </div>

            {/* Photo Upload - Multiple */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Прикрепить фото
                </label>
                <span className="text-xs text-muted-foreground">
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </div>
              <div className="space-y-3">
                {/* Photo previews grid */}
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full rounded-lg object-cover border border-border/50"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {photos.length < MAX_PHOTOS && (
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary cursor-pointer transition-colors"
                    >
                      <Image className="w-5 h-5" />
                      <span className="text-sm">Выбрать файлы</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Consent Text */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Нажимая кнопку «Отправить заявку», я даю согласие на обработку{' '}
              <a
                href="/documents/privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                персональных данных
              </a>{' '}
              и принимаю условия Публичной оферты.
            </p>

            {/* Buttons Row */}
            <div className="flex items-center gap-3">
              {/* Telegram Button */}
              <a
                href="https://t.me/Msuvenirov39zakaz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 shrink-0 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
                aria-label="Написать в Telegram"
              >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 gradient-btn-pulse py-3.5 rounded-lg text-base font-bold text-background disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="relative z-10">Отправка...</span>
                  </>
                ) : (
                  <span className="relative z-10">Отправить заявку</span>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingOrderButton;
