import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('главная');
  const [workingStatus, setWorkingStatus] = useState(getWorkingStatus);

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

  // Scrollspy with Intersection Observer
  useEffect(() => {
    const sectionIds = ['главная', 'работы', 'процесс', 'отзывы', 'контакты'];
    
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

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: '#главная', label: 'Главная', id: 'главная' },
    { href: '#работы', label: 'Наши работы', id: 'работы' },
    { href: '#процесс', label: 'Как заказать?', id: 'процесс' },
    { href: '#отзывы', label: 'Отзывы', id: 'отзывы' },
    { href: '#контакты', label: 'Контакты', id: 'контакты' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
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

          {/* Working Hours + Social Icons + Order Button - visible on md and up */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
            {/* Working Hours with Status */}
            <div className="flex items-center gap-1.5">
              <div 
                className={`w-2 h-2 rounded-full ${
                  workingStatus.isOpen 
                    ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' 
                    : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                }`}
              />
              <span className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                {workingStatus.isOpen ? '10:00 – 20:00' : 'Закрыто'}
              </span>
            </div>
            
            <a
              href="https://vk.com/msuvenirov39"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z"/>
              </svg>
            </a>
            <a
              href="https://t.me/msuvenirov39"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full neon-border flex items-center justify-center bg-background hover:neon-glow transition-all duration-300"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <button 
              onClick={handleOrderClick}
              className="gradient-btn-pulse px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold text-background ml-1 lg:ml-2"
            >
              <span className="relative z-10">Заказать</span>
            </button>
          </div>

          {/* Mobile menu button - visible below md */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg neon-border flex items-center justify-center flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
          </button>
        </nav>

        {/* Mobile menu - visible below md */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl glass-card animate-fade-in">
            <div className="flex flex-col gap-3 sm:gap-4">
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
              
              {/* Working status in mobile menu */}
              <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    workingStatus.isOpen 
                      ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' 
                      : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                  }`}
                />
                <span>{workingStatus.isOpen ? 'Открыто до 20:00' : 'Сейчас закрыто'}</span>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-2 border-t border-border/50">
                <a
                  href="https://vk.com/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z"/>
                  </svg>
                </a>
                <a
                  href="https://t.me/msuvenirov39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full neon-border flex items-center justify-center bg-background"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
              <button 
                onClick={handleOrderClick}
                className="gradient-btn-pulse px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold text-background mt-1"
              >
                <span className="relative z-10">Заказать</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
