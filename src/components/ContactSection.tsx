import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="контакты" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-4">
            <span className="neon-text">Как нас найти</span>
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta rounded-full" />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column - Contact Info */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl flex flex-col">
            {/* Contact List */}
            <div className="space-y-6 mb-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 neon-glow-cyan">
                  <MapPin className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Адрес</h4>
                  <p className="text-foreground text-base sm:text-lg">
                    Калининград, ТЦ Экватор, 2 этаж,<br />
                    Генерала Челнокова 11 стр 1
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0 neon-glow">
                  <Clock className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Режим работы</h4>
                  <p className="text-foreground text-base sm:text-lg">
                    с 10:00 до 20:00 без выходных
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 neon-glow-magenta">
                  <Phone className="w-6 h-6 text-neon-magenta" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Телефон</h4>
                  <a 
                    href="tel:+79521142350" 
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors"
                  >
                    +7 952 114-23-50
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 neon-glow-cyan">
                  <Send className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Telegram</h4>
                  <a 
                    href="https://t.me/Msuvenirov39zakaz" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors"
                  >
                    Написать нам
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0 neon-glow-magenta">
                  <Mail className="w-6 h-6 text-neon-magenta" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</h4>
                  <a 
                    href="mailto:Msuvenirov39@yandex.ru" 
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors"
                  >
                    Msuvenirov39@yandex.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="mt-auto pt-6 border-t border-border/30">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Мы в соцсетях
              </h4>
              <div className="flex gap-4">
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
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="glass-card p-2 rounded-2xl overflow-hidden min-h-[400px] lg:min-h-0">
            <div className="w-full h-full min-h-[380px] rounded-xl overflow-hidden">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A8c8d9e8d5c8e8d5c8e8d5c8e8d5c8e8d&amp;source=constructor&ll=20.472047%2C54.729422&z=16&pt=20.472047,54.729422,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full min-h-[380px]"
                style={{
                  filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) saturate(0.8)',
                  borderRadius: '0.75rem'
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