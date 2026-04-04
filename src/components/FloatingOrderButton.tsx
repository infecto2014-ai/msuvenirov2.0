import { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Loader2, Check, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { toast } from '@/hooks/use-toast';
import InputMask from 'react-input-mask';
import { Link, useLocation } from 'react-router-dom';

const MAX_COMMENT_LENGTH = 300;
const MAX_FILES = 10;
const FORM_STORAGE_KEY = 'orderFormData';

interface SavedFormData {
  name: string;
  phone: string;
  comment: string;
  promo: string;
  filePreviews: string[];
  fileNames: string[];
}

const FloatingOrderButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
    promo: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Promo verification state
  const [promoStatus, setPromoStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoVerified, setPromoVerified] = useState(false);

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: SavedFormData = JSON.parse(savedData);
        setFormData({
          name: parsed.name || '',
          phone: parsed.phone || '',
          comment: parsed.comment || '',
          promo: parsed.promo || '',
        });
        setFilePreviews(parsed.filePreviews || []);
        setFileNames(parsed.fileNames || []);
        setIsOpen(true);
        sessionStorage.removeItem(FORM_STORAGE_KEY);
      } catch (e) {
        sessionStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
  }, []);

  const saveFormData = () => {
    const dataToSave: SavedFormData = {
      name: formData.name,
      phone: formData.phone,
      comment: formData.comment,
      promo: formData.promo,
      filePreviews: filePreviews,
      fileNames: fileNames,
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'comment' && value.length > MAX_COMMENT_LENGTH) {
      return;
    }
    if (name === 'promo') {
      // Reset promo verification when code changes
      setPromoStatus('idle');
      setPromoMessage('');
      setPromoVerified(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remainingSlots = MAX_FILES - files.length;
    const filesToAdd = selected.slice(0, remainingSlots);

    if (selected.length > remainingSlots) {
      toast({
        title: 'Ограничение',
        description: `Можно прикрепить максимум ${MAX_FILES} файлов`,
        variant: 'destructive',
      });
    }

    setFiles(prev => [...prev, ...filesToAdd]);
    setFileNames(prev => [...prev, ...filesToAdd.map(f => f.name)]);

    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews(prev => [...prev, '']);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', comment: '', promo: '' });
    setFiles([]);
    setFilePreviews([]);
    setFileNames([]);
    setPromoStatus('idle');
    setPromoMessage('');
    setPromoVerified(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const verifyPromo = async () => {
    const code = formData.promo.trim();
    if (!code) {
      toast({ title: 'Введите промокод', variant: 'destructive' });
      return;
    }

    setPromoStatus('checking');
    setPromoMessage('');

    try {
      const supabase = await import('@/integrations/supabase/client').then(m => m.supabase);
      const { data, error } = await supabase.functions.invoke('verify-promo', {
        body: { code },
      });

      if (error) throw error;

      if (data.valid) {
        setPromoStatus('valid');
        setPromoMessage(data.description || data.message);
        setPromoVerified(true);
        toast({ title: '✅ ' + data.message });
      } else {
        setPromoStatus('invalid');
        setPromoMessage(data.message);
        setPromoVerified(false);
        toast({ title: data.message, variant: 'destructive' });
      }
    } catch (error) {
      console.error('Promo verify error:', error);
      setPromoStatus('invalid');
      setPromoMessage('Ошибка при проверке промокода');
      setPromoVerified(false);
      toast({ title: 'Ошибка при проверке промокода', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.name.trim() || phoneDigits.length < 11) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните имя и телефон полностью',
        variant: 'destructive',
      });
      return;
    }

    // If promo is entered but not verified, block submission
    if (formData.promo.trim() && !promoVerified) {
      toast({
        title: 'Проверьте промокод',
        description: 'Нажмите «Применить», чтобы проверить промокод, или очистите поле',
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
      // Only send verified promo
      if (promoVerified) {
        submitFormData.append('promo', formData.promo.trim().toUpperCase());
      }
      
      files.forEach((file, index) => {
        submitFormData.append(`file_${index}`, file);
      });
      submitFormData.append('fileCount', files.length.toString());

      const supabase = await import('@/integrations/supabase/client').then(m => m.supabase);
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

  const promoHasValue = formData.promo.trim().length > 0;

  return (
    <>
      <button
        data-order-button
        onClick={() => setIsOpen(true)}
        className="hidden"
        aria-label="Открыть форму заказа"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50 backdrop-blur-xl max-h-[90vh] overflow-y-auto z-[9999] fixed inset-0 sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:rounded-lg rounded-none">
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

            {/* Phone */}
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

            {/* Comment */}
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

            {/* Promo Code with verify button */}
            <div>
              <label htmlFor="promo" className="block text-sm font-medium text-foreground mb-1.5">
                Промокод
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="promo"
                    name="promo"
                    value={formData.promo}
                    onChange={handleInputChange}
                    disabled={promoVerified}
                    className={`w-full px-4 py-3 rounded-lg bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
                      promoStatus === 'valid'
                        ? 'border-green-500/70'
                        : promoStatus === 'invalid'
                        ? 'border-destructive/70'
                        : 'border-border/50'
                    } ${promoVerified ? 'opacity-70' : ''}`}
                    placeholder="Введите промокод"
                  />
                  {promoStatus === 'valid' && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {promoHasValue && !promoVerified && (
                  <button
                    type="button"
                    onClick={verifyPromo}
                    disabled={promoStatus === 'checking'}
                    className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors text-sm font-medium shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {promoStatus === 'checking' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Tag className="w-4 h-4" />
                    )}
                    Применить
                  </button>
                )}
                {promoVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, promo: '' }));
                      setPromoStatus('idle');
                      setPromoMessage('');
                      setPromoVerified(false);
                    }}
                    className="px-3 py-3 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground transition-colors text-sm shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {promoMessage && (
                <p className={`text-xs mt-1.5 ${promoStatus === 'valid' ? 'text-green-500' : 'text-destructive'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Прикрепить файлы
                </label>
                <span className="text-xs text-muted-foreground">
                  {files.length}/{MAX_FILES}
                </span>
              </div>
              <div className="space-y-3">
                {filePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        {preview ? (
                          <img
                            src={preview}
                            alt={fileNames[index] || `Файл ${index + 1}`}
                            className="w-full h-full rounded-lg object-cover border border-border/50"
                          />
                        ) : (
                          <div className="w-full h-full rounded-lg border border-border/50 bg-muted/30 flex flex-col items-center justify-center p-1">
                            <Paperclip className="w-4 h-4 text-muted-foreground mb-0.5" />
                            <span className="text-[10px] text-muted-foreground text-center leading-tight truncate w-full px-0.5">
                              {fileNames[index]?.split('.').pop()?.toUpperCase() || 'FILE'}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length < MAX_FILES && (
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary cursor-pointer transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                      <span className="text-sm">Выбрать файлы</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Consent */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Нажимая кнопку «Отправить заявку», вы даёте согласие на обработку{' '}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
                onClick={() => { saveFormData(); setIsOpen(false); }}
              >
                персональных данных
              </Link>{' '}
              и принимаете условия{' '}
              <Link
                to="/public-offer"
                className="text-primary hover:underline"
                onClick={() => { saveFormData(); setIsOpen(false); }}
              >
                публичной оферты
              </Link>.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
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
