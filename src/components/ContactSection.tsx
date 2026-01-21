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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-4 tracking-wider">
            <span className="neon-text">Как нас найти</span>
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta rounded-full" />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column - Contact Info Card */}
          <div 
            className="relative rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(15, 15, 25, 0.95) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Contact List */}
            <div className="space-y-8 mb-8 flex-1">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)))',
                    boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.4)'
                  }}
                >
                  <MapPin className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Адрес</h4>
                  <p className="text-foreground text-base sm:text-lg leading-relaxed">
                    Калининград, ТЦ Экватор, 2 этаж,<br />
                    Генерала Челнокова 11 стр 1
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-magenta)))',
                    boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.4)'
                  }}
                >
                  <Clock className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Режим работы</h4>
                  <p className="text-foreground text-base sm:text-lg">
                    с 10:00 до 20:00 без выходных
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-magenta)), hsl(var(--neon-cyan)))',
                    boxShadow: '0 0 20px hsl(var(--neon-magenta) / 0.4)'
                  }}
                >
                  <Phone className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Телефон</h4>
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
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)))',
                    boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.4)'
                  }}
                >
                  <Send className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Telegram</h4>
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
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-magenta)))',
                    boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.4)'
                  }}
                >
                  <Mail className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email</h4>
                  <a 
                    href="mailto:Msuvenirov39@yandex.ru" 
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors"
                  >
                    msuvenirov39@yandex.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="pt-6 border-t border-border/20">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Мы в соцсетях
              </h4>
              <div className="flex gap-4">
                {/* VK Button */}
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)))',
                    boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.3)'
                  }}
                  aria-label="ВКонтакте"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-7 h-7 text-background"
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
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-magenta)))',
                    boxShadow: '0 0 20px hsl(var(--neon-magenta) / 0.3)'
                  }}
                  aria-label="Telegram"
                >
                  <Send className="w-6 h-6 text-background" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div 
            className="relative rounded-2xl overflow-hidden min-h-[500px] lg:min-h-0"
            style={{
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)'
            }}
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A8c8d9e8d5c8e8d5c8e8d5c8e8d5c8e8d&amp;source=constructor&ll=20.472047%2C54.729422&z=16&pt=20.472047,54.729422,pm2rdm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full min-h-[500px] lg:min-h-full"
              style={{
                filter: 'brightness(0.7) contrast(1.2) saturate(1.3) hue-rotate(200deg)'
              }}
              title="Карта проезда к Мастерской сувениров"
            />
          </div>
        </div>
      </div>

      {/* Decorative star in bottom right */}
      <div className="absolute bottom-8 right-8 opacity-30">
        <svg 
          className="w-12 h-12 text-primary animate-glow-pulse"
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.81 19.02L12 16.12L7.19 19.02L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
        </svg>
      </div>
    </section>
  );
};

export default ContactSection;