import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProtectedLogo from './ProtectedLogo';

const Footer = () => {
  return (
    <footer id="контакты" className="py-10 sm:py-16 relative overflow-hidden border-t border-border/50">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
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
              <a href="https://yandex.ru/maps/-/CHuaBZFR" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors group text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-primary shrink-0" />
                  <span>Калининград, ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1</span>
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
