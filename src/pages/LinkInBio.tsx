import { useState, useRef } from 'react';
import { Phone, Upload, Home, Mail } from 'lucide-react';
import ProtectedLogo from '@/components/ProtectedLogo';
import heroImage from '@/assets/hero-bg.jpg';
import maxLogo from '@/assets/logo_max.svg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BUTTON_COLOR = '#E0FFFF';
const MAX_FILES = 10;

const links = [
  {
    label: 'Позвонить',
    href: 'tel:+79521142350',
    icon: Phone,
    external: false,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/msuvenirov39zakaz',
    icon: null,
    iconType: 'telegram',
    external: true,
  },
  {
    label: 'MAX',
    href: 'https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8',
    icon: null,
    iconType: 'max',
    external: true,
  },
  {
    label: 'Написать на почту',
    href: 'mailto:msuvenirov39@yandex.ru',
    icon: Mail,
    external: false,
  },
  {
    label: 'ВКонтакте',
    href: 'https://vk.com/msuvenirov39',
    icon: null,
    iconType: 'vk',
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/msuvenirov39',
    icon: null,
    iconType: 'instagram',
    external: true,
  },
  {
    label: 'Отправить файл',
    href: '#files',
    icon: Upload,
    external: false,
    action: 'openFiles',
  },
  {
    label: 'Посетить сайт',
    href: '/',
    icon: Home,
    external: false,
  },
];

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.006-1.49-1.142-1.744-1.142-.356 0-.458.102-.458.593v1.562c0 .422-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.475-.085.72-.576.72z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MaxIcon = ({ className }: { className?: string }) => (
  <img src={maxLogo} alt="MAX" className={className} style={{ filter: 'brightness(0)' }} />
);

const getIcon = (link: typeof links[0]) => {
  if (link.icon) {
    const Icon = link.icon;
    return <Icon className="w-6 h-6 flex-shrink-0 text-black" />;
  }
  const cls = "w-6 h-6 flex-shrink-0 text-black";
  switch ((link as any).iconType) {
    case 'telegram': return <TelegramIcon className={cls} />;
    case 'vk': return <VKIcon className={cls} />;
    case 'instagram': return <InstagramIcon className={cls} />;
    case 'max': return <MaxIcon className={cls} />;
    default: return null;
  }
};

const LinkInBio = () => {
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (link: typeof links[0], e: React.MouseEvent) => {
    if ((link as any).action === 'openFiles') {
      e.preventDefault();
      setFilesDialogOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, MAX_FILES);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Прикрепите хотя бы один файл');
      return;
    }

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('name', 'Визитка (отправка файлов)');
      formData.append('phone', '');
      formData.append('comment', `Отправлено ${selectedFiles.length} файл(ов) через визитку`);
      formData.append('promo', '');
      formData.append('photoCount', selectedFiles.length.toString());

      selectedFiles.forEach((file, i) => {
        formData.append(`photo_${i}`, file);
      });

      const { error } = await supabase.functions.invoke('send-telegram', {
        body: formData,
      });

      if (error) throw error;

      toast.success('Файлы успешно отправлены!');
      setSelectedFiles([]);
      setFilesDialogOpen(false);
    } catch {
      toast.error('Ошибка при отправке файлов');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero-style background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-10 max-w-md mx-auto min-h-screen">
        {/* Logo */}
        <div className="mb-10">
          <ProtectedLogo height={48} />
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) => {
            const isExternal = link.external;
            return (
              <a
                key={link.label}
                href={link.href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => handleClick(link, e)}
                style={{ background: BUTTON_COLOR }}
                className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl text-black font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {getIcon(link)}
                  <span>{link.label}</span>
                </span>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <p className="mt-auto pt-10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Мастерская сувениров
        </p>
      </div>

      {/* Files Dialog */}
      <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Отправить файлы</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Прикрепите до {MAX_FILES} файлов любого формата
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="*/*"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFiles.length >= MAX_FILES}
              className="w-full py-3 rounded-lg border-2 border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              {selectedFiles.length >= MAX_FILES
                ? `Максимум ${MAX_FILES} файлов`
                : 'Нажмите, чтобы выбрать файлы'}
            </button>

            {selectedFiles.length > 0 && (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-muted/50 rounded-lg px-3 py-2 text-sm">
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-destructive hover:text-destructive/80 text-xs font-medium flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleSendFiles}
              disabled={isSending || selectedFiles.length === 0}
              style={{ background: BUTTON_COLOR }}
              className="w-full py-3 rounded-xl text-black font-semibold text-base transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isSending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkInBio;
