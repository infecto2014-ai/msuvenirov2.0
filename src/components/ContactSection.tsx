import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const ContactSection = () => {
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const mapInteractionTimeoutRef = useRef<number | null>(null);

  const handleMapActivation = () => {
    setIsMapInteractive(true);

    if (mapInteractionTimeoutRef.current !== null) {
      window.clearTimeout(mapInteractionTimeoutRef.current);
    }

    mapInteractionTimeoutRef.current = window.setTimeout(() => {
      setIsMapInteractive(false);
      mapInteractionTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (mapInteractionTimeoutRef.current !== null) {
        window.clearTimeout(mapInteractionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="контакты" className="relative py-16 sm:py-24 overflow-hidden" aria-label="Контактная информация">
      {/* Background with smooth transition from TrustSection */}
      <div className="absolute inset-0 bg-[hsl(260,25%,6%)]" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <header className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-foreground">
            КОНТАКТЫ
          </h2>
        </header>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column - Contact Info */}
          <div className="relative flex">
            {/* Neon backlight glow */}
            <div 
              className="absolute -inset-3 sm:-inset-4 rounded-3xl opacity-60 blur-2xl -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(var(--neon-cyan) / 0.25) 0%, hsl(var(--neon-purple) / 0.15) 50%, transparent 70%)',
              }}
            />
            <div className="relative glass-card p-6 sm:p-8 rounded-2xl flex flex-col w-full">
            {/* Contact List */}
            <div className="flex flex-col gap-5 mb-6">
              {/* Address */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 neon-glow-cyan">
                  <MapPin className="w-5 h-5 text-neon-cyan" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Адрес</span>
                  <p className="text-foreground text-sm sm:text-base leading-tight">
                    Калининград<br />ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0 neon-glow">
                  <Clock className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Режим работы</span>
                  <p className="text-foreground text-sm sm:text-base">с 10:00 до 20:00 без выходных</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 neon-glow-magenta">
                  <Phone className="w-5 h-5 text-neon-magenta" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Телефон</span>
                  <a href="tel:+79521142350" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    +7 952 114-23-50
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 neon-glow-cyan">
                  <Send className="w-5 h-5 text-neon-cyan" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telegram</span>
                  <a href="https://t.me/msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    Написать нам
                  </a>
                </div>
              </div>

              {/* MAX */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0 neon-glow">
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(43%) sepia(96%) saturate(1234%) hue-rotate(238deg) brightness(101%) contrast(101%)' }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MAX</span>
                  <a href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8" target="_blank" rel="noopener noreferrer" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    Написать в MAX
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 neon-glow-magenta">
                  <Mail className="w-5 h-5 text-neon-magenta" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">email</span>
                  <a href="mailto:msuvenirov39@yandex.ru" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    msuvenirov39@yandex.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="mt-auto pt-5 border-t border-border/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Мы в соцсетях
              </span>
              <div className="flex gap-3">
                {/* VK Button */}
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center hover:border-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] transition-all duration-300 group"
                  aria-label="ВКонтакте"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-7 h-7 text-muted-foreground group-hover:text-neon-cyan transition-colors"
                    fill="currentColor"
                  >
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.006-1.49-1.142-1.744-1.142-.356 0-.458.102-.458.593v1.562c0 .422-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.475-.085.72-.576.72z"/>
                  </svg>
                </a>

                {/* Instagram Button */}
                <a
                  href="https://www.instagram.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center hover:border-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.3)] transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-muted-foreground group-hover:text-neon-magenta transition-colors" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="relative flex">
            {/* Neon backlight glow */}
            <div 
              className="absolute -inset-3 sm:-inset-4 rounded-3xl opacity-60 blur-2xl -z-10"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(var(--neon-magenta) / 0.25) 0%, hsl(var(--neon-purple) / 0.15) 50%, transparent 70%)',
              }}
            />
            <div className="relative glass-card p-2 rounded-2xl overflow-hidden w-full min-h-[350px] lg:min-h-0">
              <button
                type="button"
                className={`absolute inset-0 z-10 flex items-end justify-center rounded-2xl bg-gradient-to-t from-background/50 via-background/10 to-transparent p-4 transition-opacity duration-300 lg:hidden ${
                  isMapInteractive ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
                }`}
                style={{ touchAction: 'pan-y' }}
                onClick={handleMapActivation}
                aria-label="Активировать карту на 3 секунды"
              >
                <span className="rounded-full border border-border/50 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground shadow-lg backdrop-blur-sm">
                  Нажмите, чтобы двигать карту
                </span>
              </button>

              <iframe
                id="map-iframe"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A8c8d9e8d5c8e8d5c8e8d5c8e8d5c8e8d&amp;source=constructor&ll=20.487384%2C54.737514&z=16&pt=20.487384,54.737514,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                className={`w-full h-full min-h-[340px] rounded-xl ${
                  isMapInteractive ? 'pointer-events-auto' : 'pointer-events-none'
                } lg:pointer-events-auto`}
                style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) saturate(0.8)' }}
                title="Карта проезда к Мастерской сувениров"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
