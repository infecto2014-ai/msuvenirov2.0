import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Mail, Send, ChevronDown } from 'lucide-react';
import ProtectedLogo from './ProtectedLogo';
import { forceLoadAllSections } from '@/hooks/useLazySection';
import { reachGoal } from '@/lib/metrika';



const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('главная');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isServicePage = ['/pechat_na_tkani', '/mug-print'].includes(location.pathname);

  useEffect(() => {
    if (location.pathname === '/price') setActiveSection('прайс');
    else if (location.pathname === '/card') setActiveSection('визитка');
    else if (location.pathname === '/faq') setActiveSection('faq');
    else if (isServicePage) setActiveSection('услуги');
  }, [location.pathname, isServicePage]);


  // Scrollspy — tracks which section is currently in view
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sectionIds = ['главная', 'о-нас', 'отзывы', 'контакты'];
    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const pickActive = () => {
      let best: string | null = null;
      let bestTop = Infinity;
      visibleSections.forEach((entry, id) => {
        if (entry.isIntersecting) {
          const top = entry.boundingClientRect.top;
          // Pick the section whose top is closest to (but above) the viewport centre
          if (Math.abs(top) < Math.abs(bestTop)) {
            bestTop = top;
            best = id;
          }
        }
      });
      if (best) setActiveSection(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry);
        });
        pickActive();
      },
      { root: null, rootMargin: '-10% 0px -40% 0px', threshold: [0, 0.1, 0.3, 0.5, 1] }
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
  }, [location.pathname]);

  const navLinks = [
    { href: '/#главная', label: 'Главная', id: 'главная' },
    { href: '/#о-нас', label: 'О нас', id: 'о-нас' },
    { href: '/#отзывы', label: 'Отзывы', id: 'отзывы' },
    { href: '/#контакты', label: 'Контакты', id: 'контакты' },
    { href: '/price', label: 'Прайс-лист', id: 'прайс' },
    { href: '/faq', label: 'FAQ', id: 'faq' },
    { href: '/card', label: 'Визитка', id: 'визитка' },
  ];

  const serviceLinks: { href: string; label: string; soon?: boolean }[] = [
    { href: '/pechat_na_tkani', label: 'Печать на ткани (футболки, худи, спецодежда)' },
    { href: '#', label: 'Печать на кружках', soon: true },
    { href: '#', label: 'Ещё больше услуг — скоро', soon: true },
  ];

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('/') && !href.startsWith('/#')) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }
    const targetId = href.replace('/#', '').replace('#', '');
    if (location.pathname !== '/') {
      navigate('/');
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return;
    }
    setIsMobileMenuOpen(false);
    // Force all lazy sections to render immediately
    forceLoadAllSections();
    const scrollToEl = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };
    if (!scrollToEl()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (scrollToEl() || attempts >= 15) clearInterval(interval);
      }, 100);
    }
  };

  const handleOrderClick = () => {
    const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
    if (orderButton) orderButton.click();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-background/90 backdrop-blur-md border-b border-border/30 shadow-lg' : 'bg-transparent border-b border-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Desktop: single row */}
        <div className="hidden lg:flex items-center h-16">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="flex items-center flex-shrink-0 cursor-pointer"
            aria-label="На главную"
          >
            <ProtectedLogo height={40} className="xl:h-[44px]" />
          </a>

          {/* Nav — centered */}
          <nav aria-label="Основная навигация" className="flex-1 flex justify-center min-w-0">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-2 xl:px-3 py-2 text-[13px] xl:text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap
                      ${activeSection === link.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }
                    `}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span className="absolute bottom-0 left-2 right-2 xl:left-3 xl:right-3 h-0.5 bg-primary rounded-full" />
                    )}
                  </a>
                </li>
              ))}

              {/* Услуги dropdown */}
              <li ref={servicesRef} className="relative">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`relative px-2 xl:px-3 py-2 text-[13px] xl:text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap flex items-center gap-1 ${activeSection === 'услуги' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                >
                  Услуги
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  {activeSection === 'услуги' && (
                    <span className="absolute bottom-0 left-2 right-2 xl:left-3 xl:right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                {isServicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-xl py-2 z-50 animate-fade-in">
                    {serviceLinks.map((s) => (
                      s.soon ? (
                        <span
                          key={s.label}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground/50 cursor-default"
                        >
                          {s.label}
                          <span className="text-[10px] uppercase tracking-wider text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">скоро</span>
                        </span>
                      ) : (
                        <a
                          key={s.href}
                          href={s.href}
                          onClick={(e) => { handleNavClick(e, s.href); setIsServicesOpen(false); }}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                        >
                          {s.label}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </li>

              {navLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-2 xl:px-3 py-2 text-[13px] xl:text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap
                      ${activeSection === link.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }
                    `}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span className="absolute bottom-0 left-2 right-2 xl:left-3 xl:right-3 h-0.5 bg-primary rounded-full" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: socials + call + order */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <a href="https://t.me/msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
              className="h-5 w-5 flex items-center justify-center text-foreground hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8" target="_blank" rel="noopener noreferrer" aria-label="MAX"
              className="h-5 w-5 flex items-center justify-center hover:opacity-80 transition-opacity">
              <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5 dark:brightness-0 dark:invert" />
            </a>
            <a href="https://vk.com/msuvenirov39" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"
              className="h-5 w-5 flex items-center justify-center text-foreground hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" />
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z" fill="hsl(var(--background))" />
              </svg>
            </a>
            <a href="https://www.instagram.com/msuvenirov39" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="h-5 w-5 flex items-center justify-center text-foreground hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>

            <div className="w-px h-5 bg-border/50" />

            <a
              href="tel:+79521142350"
              aria-label="Позвонить"
              onClick={() => reachGoal('phone_click')}
              className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_16px_rgba(34,197,94,0.5)]"
            >
              <Phone className="w-4 h-4 text-background" />
            </a>

            <button
              onClick={handleOrderClick}
              className="gradient-btn-pulse px-4 py-2 rounded-lg text-sm font-semibold text-background"
            >
              <span className="relative z-10">Заказать</span>
            </button>
          </div>
        </div>

        {/* === MOBILE: single row === */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="flex items-center flex-shrink-0 cursor-pointer"
            aria-label="На главную"
          >
            <ProtectedLogo height={38} />
          </a>
          <div className="flex items-center gap-2">
            
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
      </div>

      {/* === MOBILE MENU === */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in bg-background border-t border-border/30 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col gap-4">
              <nav aria-label="Мобильная навигация">
                <ul className="flex flex-col gap-1">
                  {navLinks.slice(0, 4).map((link) => (
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

                  {/* Услуги — mobile accordion */}
                  <li>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === 'услуги' ? 'text-primary bg-primary/5 border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'}`}
                    >
                      Услуги
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileServicesOpen && (
                      <ul className="ml-4 mt-1 flex flex-col gap-1">
                        {serviceLinks.map((s) => (
                          <li key={s.label}>
                            {s.soon ? (
                              <span className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground/50 cursor-default">
                                {s.label}
                                <span className="text-[10px] uppercase tracking-wider text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">скоро</span>
                              </span>
                            ) : (
                              <a
                                href={s.href}
                                onClick={(e) => { handleNavClick(e, s.href); setIsMobileServicesOpen(false); }}
                                className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
                              >
                                {s.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  {navLinks.slice(4).map((link) => (
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

              <div className="border-t border-border/30" />

              <div className="flex flex-col gap-3 text-sm">
                <a href={"https://yandex.ru/maps/org/masterskaya_suvenirov/105530576058/?ll=20.487454%2C54.737492&z=17"} target="_blank" rel="noopener noreferrer" onClick={() => reachGoal('yandex_maps_click')}
                  className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Калининград, ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>10:00–20:00, без выходных</span>
                </div>
                <a href="tel:+79521142350" onClick={() => reachGoal('phone_click')} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+7 (952) 114-23-50</span>
                </a>
                <a href="https://t.me/msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" onClick={() => reachGoal('telegram_click')} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Send className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Написать в Telegram</span>
                </a>
                <a href="mailto:msuvenirov39@yandex.ru" onClick={() => reachGoal('email_click')} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>msuvenirov39@yandex.ru</span>
                </a>
              </div>

              <div className="border-t border-border/30" />

              <div className="flex gap-3">
                <a href="https://t.me/msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" aria-label="Telegram" onClick={() => reachGoal('social_click')}
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background text-foreground hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8" target="_blank" rel="noopener noreferrer" aria-label="MAX" onClick={() => reachGoal('social_click')}
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background hover:opacity-80 transition-opacity">
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5 dark:brightness-0 dark:invert" />
                </a>
                <a href="https://vk.com/msuvenirov39" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" onClick={() => reachGoal('social_click')}
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background text-foreground hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="12" />
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z" fill="hsl(var(--background))" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/msuvenirov39" target="_blank" rel="noopener noreferrer" aria-label="Instagram" onClick={() => reachGoal('social_click')}
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background text-foreground hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>

              <div className="flex gap-3 mt-1">
                <a href="tel:+79521142350" aria-label="Позвонить" onClick={() => reachGoal('phone_click')}
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  <Phone className="w-5 h-5 text-background" />
                </a>
                <button onClick={handleOrderClick} className="gradient-btn-pulse flex-1 py-3 rounded-lg text-sm font-semibold text-background">
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
