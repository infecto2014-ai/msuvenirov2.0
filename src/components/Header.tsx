import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Mail, Send } from 'lucide-react';
import ProtectedLogo from './ProtectedLogo';

// Check if currently open (Kaliningrad time UTC+2, 10:00-20:00)
const getWorkingStatus = () => {
  const now = new Date();
  const kaliningradOffset = 2 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kaliningradTime = new Date(utc + kaliningradOffset * 60000);
  const hours = kaliningradTime.getHours();
  const day = kaliningradTime.getDay();
  const isOpen = day >= 1 && day <= 7 && hours >= 10 && hours < 20;
  return { isOpen, hours };
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('главная');
  const [workingStatus, setWorkingStatus] = useState(getWorkingStatus);

  useEffect(() => {
    if (location.pathname === '/price') setActiveSection('прайс');
    else if (location.pathname === '/card') setActiveSection('визитка');
    else if (location.pathname === '/faq') setActiveSection('faq');
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setWorkingStatus(getWorkingStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Scrollspy
  useEffect(() => {
    const sectionIds = ['главная', 'о-нас', 'работы', 'отзывы', 'контакты'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    const observedElements = new Set<Element>();
    const observeSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
    };

    observeSections();
    const retryInterval = setInterval(() => {
      observeSections();
      if (observedElements.size >= sectionIds.length) clearInterval(retryInterval);
    }, 500);

    const mutationObserver = new MutationObserver(() => observeSections());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearInterval(retryInterval);
    };
  }, []);

  const navLinks = [
    { href: '#главная', label: 'Главная', id: 'главная' },
    { href: '#работы', label: 'Наши работы', id: 'работы' },
    { href: '#о-нас', label: 'О нас', id: 'о-нас' },
    { href: '#отзывы', label: 'Отзывы', id: 'отзывы' },
    { href: '#контакты', label: 'Контакты', id: 'контакты' },
    { href: '/card', label: 'Визитка', id: 'визитка' },
    { href: '/price', label: 'Прайс-лист', id: 'прайс' },
    { href: '/faq', label: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }
    const targetId = href.replace('#', '');
    if (location.pathname !== '/') {
      navigate('/' + href);
      setIsMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) orderButton.click();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* === TOP TIER: Info Bar — hidden on mobile === */}
      <div className={`hidden lg:block transition-all duration-300 ${isScrolled ? 'opacity-0 -translate-y-full h-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
        <div className="bg-card/80 backdrop-blur-md border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-11 text-xs text-muted-foreground">
              {/* Left: Location */}
              <div className="flex items-center gap-6">
                <a
                  href="https://yandex.ru/maps/-/CHuaBZFR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>Калининград, ТЦ Экватор, ул. Ген. Челнокова 11</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        workingStatus.isOpen
                          ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]'
                          : 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]'
                      }`}
                    />
                    <span>Пн–Вс: 10:00–20:00</span>
                  </div>
                </div>
              </div>

              {/* Right: Phone + Socials */}
              <div className="flex items-center gap-5">
                <a
                  href="tel:+79521142350"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>+7 (952) 114-23-50</span>
                </a>
                <a
                  href="mailto:msuvenirov39@yandex.ru"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>msuvenirov39@yandex.ru</span>
                </a>

                {/* Socials divider */}
                <div className="w-px h-4 bg-border/50" />

                {/* VK */}
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ВКонтакте"
                  className="hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z" />
                  </svg>
                </a>
                {/* Telegram */}
                <a
                  href="https://t.me/msuvenirov39zakaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                {/* MAX */}
                <a
                  href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MAX"
                  className="hover:text-foreground transition-colors"
                >
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM TIER: Navigation Bar — always visible, sticky === */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-[0_2px_20px_hsl(var(--neon-cyan)/0.08)] border-b border-border/40'
            : 'bg-background/80 backdrop-blur-md border-b border-border/20'
        }`}
        role="navigation"
        aria-label="Основная навигация"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="flex items-center flex-shrink-0 cursor-pointer"
              aria-label="На главную"
            >
              <ProtectedLogo height={38} className="sm:h-[42px]" />
            </a>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md
                      ${activeSection === link.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }
                    `}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+79521142350"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="hidden xl:inline font-medium">+7 (952) 114-23-50</span>
              </a>
              <button
                onClick={handleOrderClick}
                className="gradient-btn-pulse px-5 py-2 rounded-lg text-sm font-semibold text-background"
              >
                <span className="relative z-10">Заказать</span>
              </button>
            </div>

            {/* Mobile: burger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-lg neon-border flex items-center justify-center flex-shrink-0"
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>
      </nav>

      {/* === MOBILE MENU === */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in bg-background/98 backdrop-blur-xl border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col gap-4">
              {/* Nav links */}
              <nav aria-label="Мобильная навигация">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                          ${activeSection === link.id
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                          }
                        `}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Contact info */}
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="https://yandex.ru/maps/-/CHuaBZFR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>г. Калининград, ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1</span>
                </a>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        workingStatus.isOpen
                          ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                          : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                      }`}
                    />
                    <span>10:00–20:00 {workingStatus.isOpen ? '(открыто)' : '(закрыто)'}</span>
                  </div>
                </div>

                <a href="tel:+79521142350" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+7 (952) 114-23-50</span>
                </a>

                <a href="https://t.me/Msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Send className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Написать в Telegram</span>
                </a>

                <a href="mailto:msuvenirov39@yandex.ru" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>msuvenirov39@yandex.ru</span>
                </a>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Social links */}
              <div className="flex gap-3">
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ВКонтакте"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/msuvenirov39zakaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a
                  href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MAX"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5" />
                </a>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mt-1">
                <a
                  href="tel:+79521142350"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  aria-label="Позвонить"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
                <button
                  onClick={handleOrderClick}
                  className="gradient-btn-pulse flex-1 py-3 rounded-lg text-sm font-semibold text-background"
                >
                  <span className="relative z-10">Заказать</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
