import { Phone, Globe, Mail, ArrowLeft, Copy, Check, FileText, Send, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedLogo from '@/components/ProtectedLogo';
import maxLogo from '@/assets/logo_max.svg';
import sbpLogo from '@/assets/sbp.svg';

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

const MaxIcon = ({ className }: { className?: string }) => (
  <img src={maxLogo} alt="MAX" className={className} />
);

const LinkInBio = () => {
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('msuvenirov39@yandex.ru');
    setCopied(true);
    setTooltip(true);
    setTimeout(() => { setCopied(false); setTooltip(false); }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* Back button — desktop only */}
      <Link
        to="/"
        className="hidden md:flex fixed top-6 left-6 z-20 items-center gap-2 text-foreground/70 hover:text-foreground transition-colors bg-background/60 backdrop-blur-sm rounded-full px-4 py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">На главную</span>
      </Link>

      <div className="relative z-10 flex flex-col items-center px-5 py-10 max-w-md mx-auto min-h-screen">
        {/* Logo */}
        <div className="mb-8">
          <ProtectedLogo height={48} />
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-sm text-center mb-8">
          Печать на футболках, кружках и сувенирах в Калининграде
        </p>

        {/* Primary actions — gradient highlighted */}
        <div className="w-full flex items-stretch gap-3 mb-3">
          {/* Позвонить — круглая кнопка */}
          <a
            href="tel:+79521142350"
            className="flex-shrink-0 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-lime-400 to-green-400 text-background shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            title="Позвонить"
          >
            <Phone className="w-6 h-6" />
          </a>

          {/* MAX + Telegram */}
          <div className="flex-1 flex flex-col gap-3">
            <a
              href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
              target="_blank"
              rel="noopener noreferrer"
className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)] active:scale-[0.98] bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] text-background"
            >
              <MaxIcon className="w-5 h-5 brightness-0" />
              <span>Написать в MAX</span>
            </a>
            <a
              href="https://t.me/msuvenirov39zakaz"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)] active:scale-[0.98] bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] text-white"
            >
              <TelegramIcon className="w-5 h-5" />
              <span>Написать в Telegram</span>
            </a>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="w-full flex flex-col gap-3 mb-3">
          {/* Email */}
          <div className="relative">
            <a
              href="mailto:msuvenirov39@yandex.ru"
              className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-border/50 bg-card/80 text-foreground hover:border-primary/40"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span>Написать на почту</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-all duration-200 group"
              title="Скопировать почту"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
            {tooltip && (
              <span className="absolute right-0 -top-8 bg-card border border-border/50 text-xs text-green-400 px-3 py-1 rounded-lg shadow-lg animate-fade-in">
                Скопировано!
              </span>
            )}
          </div>

          {/* Прайс-лист */}
          <Link
            to="/price"
            className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-border/50 bg-card/80 text-foreground hover:border-primary/40"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span>Смотреть прайс-лист</span>
          </Link>

          {/* Перейти на сайт */}
          <Link
            to="/"
            className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
          >
            <Globe className="w-5 h-5" />
            <span>Перейти на сайт</span>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* VK */}
          <a
            href="https://vk.com/msuvenirov39"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-border/50 bg-card/80 text-foreground hover:border-primary/40"
          >
            <VKIcon className="w-5 h-5 text-primary" />
            <span>ВКонтакте</span>
          </a>
        </div>

        {/* SBP Payment — special style */}
        <div className="w-full mt-3">
          <a
            href="https://qr.nspk.ru/AS1A003NULJA73RU8FEOGDGV7SRN5B2B?type=01&bank=100000000008&crc=148F"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-border/50 bg-card/80 text-foreground hover:border-primary/40"
          >
            <img src={sbpLogo} alt="СБП" className="w-5 h-5 flex-shrink-0" />
            <span>Оплатить по СБП</span>
          </a>
        </div>

        {/* Footer */}
        <p className="mt-auto pt-10 text-xs text-muted-foreground text-center">
          © 2019 Мастерская сувениров
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
