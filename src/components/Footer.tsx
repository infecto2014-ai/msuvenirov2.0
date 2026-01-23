import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProtectedLogo from './ProtectedLogo';

const Footer = () => {
  return (
    <footer id="контакты" className="py-10 sm:py-16 relative overflow-hidden border-t border-border/50">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Logo and about */}
          <div className="sm:col-span-2">
            <a href="#" className="flex items-center mb-4 sm:mb-6 group">
              <ProtectedLogo height={45} />
            </a>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md">
              Создаём уникальные вещи с 2019 года. Печать на текстиле любой сложности — 
              от единичных экземпляров до крупных тиражей.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-6">Контакты</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors group text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-primary shrink-0" />
                  <span>Калининград, ТЦ Экватор, 2 этаж, Генерала Челнокова 11 стр 1</span>
                </a>
              </li>
              <li>
                <a href="tel:+79521142350" className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors group text-xs sm:text-sm">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  <span>+7 952 114-23-50</span>
                </a>
              </li>
              <li>
                <a href="mailto:msuvenirov39@yandex.ru" className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors group text-xs sm:text-sm">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  <span>msuvenirov39@yandex.ru</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-foreground mb-4 sm:mb-6">Мы в соцсетях</h4>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://vk.com/msuvenirov39"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z"/>
                </svg>
              </a>
              <a
                href="https://t.me/msuvenirov39zakaz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            © 2019 Мастерская сувениров. Все права защищены.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link 
              to="/privacy-policy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              to="/public-offer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Публичная оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
