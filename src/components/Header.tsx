import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Mail, Send } from 'lucide-react';
import ProtectedLogo from './ProtectedLogo';

// Check if currently open (Kaliningrad time UTC+2, 10:00-20:00)
const getWorkingStatus = () => {
  const now = new Date();
  // Get current time in Kaliningrad (UTC+2)
  const kaliningradOffset = 2 * 60; // minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kaliningradTime = new Date(utc + kaliningradOffset * 60000);
  
  const hours = kaliningradTime.getHours();
  const isOpen = hours >= 10 && hours < 20;
  
  return { isOpen, hours };
};

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('главная');
  const [workingStatus, setWorkingStatus] = useState(getWorkingStatus);
  const location = useLocation();

  // Set active section based on route
  useEffect(() => {
    if (location.pathname === '/price') {
      setActiveSection('прайс');
    } else if (location.pathname === '/card') {
      setActiveSection('визитка');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update working status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkingStatus(getWorkingStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scrollspy with Intersection Observer - with retry for lazy-loaded sections
  useEffect(() => {
    const sectionIds = ['главная', 'о-нас', 'работы', 'отзывы', 'контакты'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Track observed elements to avoid duplicates
    const observedElements = new Set<Element>();

    const observeSections = () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && !observedElements.has(element)) {
          observer.observe(element);
          observedElements.add(element);
        }
      });
    };

    // Initial observation
    observeSections();
    
    // Re-check for lazy-loaded sections periodically
    const retryInterval = setInterval(() => {
      observeSections();
      // Stop retrying once all sections are found
      if (observedElements.size >= sectionIds.length) {
        clearInterval(retryInterval);
      }
    }, 500);

    // Also use MutationObserver to catch dynamically added sections
    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });
    
    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearInterval(retryInterval);
    };
  }, []);

  const navLinks = [
    { href: '#главная', label: 'Главная', id: 'главная' },
    { href: '#о-нас', label: 'О нас', id: 'о-нас' },
    { href: '#работы', label: 'Наши работы', id: 'работы' },
    { href: '#отзывы', label: 'Отзывы', id: 'отзывы' },
    { href: '#контакты', label: 'Контакты', id: 'контакты' },
    { href: '/card', label: 'Визитка', id: 'визитка' },
    { href: '/price', label: 'Прайс-лист', id: 'прайс' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }
    const targetId = href.replace('#', '');
    // If not on homepage, navigate there first with hash
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
    if (orderButton) {
      orderButton.click();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border/50' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo - increased by 10% */}
          <a href="#" className="flex items-center flex-shrink-0">
            <ProtectedLogo height={44} className="sm:h-[50px]" />
          </a>

          {/* Desktop Navigation - centered between logo and right block */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs lg:text-sm transition-all duration-300 whitespace-nowrap
                  ${activeSection === link.id 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social Icons + Order Button - visible on md and up */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
            
            <a
              href="https://vk.com/msuvenirov39"
              target="_blank"
              rel="noopener noreferrer"
              className="h-5 lg:h-6 aspect-square rounded-full bg-foreground flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
            >
              <svg className="h-[85%] w-auto text-background" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z"/>
              </svg>
            </a>
            <a
              href="https://t.me/msuvenirov39zakaz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
            >
              <svg className="h-5 lg:h-6 w-auto text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
            >
              <img src="/assets/logo_max.svg" alt="MAX" className="h-5 lg:h-6 w-auto" />
            </a>
            <button
              onClick={handleOrderClick}
              className="gradient-btn-pulse px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold text-background ml-1 lg:ml-2"
            >
              <span className="relative z-10">Заказать</span>
            </button>
          </div>

          {/* Mobile menu button - same height as logo (44px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-lg neon-border flex items-center justify-center flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </nav>

        {/* Mobile menu - visible below md */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 p-4 sm:p-5 rounded-xl glass-card animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Navigation links */}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm transition-all duration-300 py-1
                    ${activeSection === link.id 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Divider */}
              <div className="border-t border-border/50 my-2" />
              
              {/* Contact info section */}
              <div className="flex flex-col gap-3 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">г. Калининград, ТЦ Экватор, 2 этаж, ул. Ген. Челнокова 11, стр. 1</span>
                </div>
                
                {/* Working hours */}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        workingStatus.isOpen 
                          ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' 
                          : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                      }`}
                    />
                    <span className="text-muted-foreground">
                      10:00 – 20:00 {workingStatus.isOpen ? '(открыто)' : '(закрыто)'}
                    </span>
                  </div>
                </div>
                
                {/* Phone */}
                <a href="tel:+79521142350" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">+7 (952) 114-23-50</span>
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/Msuvenirov39zakaz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Send className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Написать в Telegram</span>
                </a>
                
                {/* Email */}
                <a href="mailto:msuvenirov39@yandex.ru" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">msuvenirov39@yandex.ru</span>
                </a>
              </div>
              
              {/* Divider */}
              <div className="border-t border-border/50 my-2" />
              
              {/* Social links */}
              <div className="flex gap-3">
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z"/>
                  </svg>
                </a>
                <a
                  href="https://t.me/msuvenirov39zakaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href="https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <img src="/assets/logo_max.svg" alt="MAX" className="w-5 h-5" />
                </a>
              </div>
              
              {/* Order and Call buttons */}
              <div className="flex gap-3 mt-2">
                {/* Call button - green */}
                <a 
                  href="tel:+79521142350"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
                
                {/* Order button */}
                <button 
                  onClick={handleOrderClick}
                  className="gradient-btn-pulse flex-1 py-3 rounded-lg text-sm font-semibold text-background"
                >
                  <span className="relative z-10">Заказать</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
