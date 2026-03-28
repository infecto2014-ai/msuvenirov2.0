import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="контакты" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background with smooth transition from TrustSection */}
      <div className="absolute inset-0 bg-[hsl(260,25%,6%)]" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <header className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-4">
            <span className="neon-text">КОНТАКТЫ</span>
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta rounded-full" aria-hidden="true" />
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
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Адрес</h4>
                  <p className="text-foreground text-sm sm:text-base leading-tight">
                    Калининград<br />ТЦ Экватор, 2 этаж, Генерала Челнокова 9
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0 neon-glow">
                  <Clock className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Режим работы</h4>
                  <p className="text-foreground text-sm sm:text-base">с 10:00 до 20:00 без выходных</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 neon-glow-magenta">
                  <Phone className="w-5 h-5 text-neon-magenta" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Телефон</h4>
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
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telegram</h4>
                  <a href="https://t.me/Msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    Написать нам
                  </a>
                </div>
              </div>

              {/* MAX */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0 neon-glow">
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MAX</h4>
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
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">email</h4>
                  <a href="mailto:msuvenirov39@yandex.ru" className="text-foreground text-sm sm:text-base hover:text-primary transition-colors">
                    msuvenirov39@yandex.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="mt-auto pt-5 border-t border-border/30">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Мы в соцсетях
              </h4>
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

                {/* Telegram Button */}
                <a
                  href="https://t.me/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center hover:border-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.3)] transition-all duration-300 group"
                  aria-label="Telegram"
                >
                  <Send className="w-6 h-6 text-muted-foreground group-hover:text-neon-magenta transition-colors" />
                </a>

                {/* MAX Button */}
                <a
                  href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center hover:border-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)] transition-all duration-300 group"
                  aria-label="MAX"
                >
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" />
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
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A8c8d9e8d5c8e8d5c8e8d5c8e8d5c8e8d&amp;source=constructor&ll=20.487384%2C54.737514&z=16&pt=20.487384,54.737514,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full min-h-[340px] rounded-xl"
                style={{
                  filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) saturate(0.8)',
                }}
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