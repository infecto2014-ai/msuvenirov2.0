import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-card py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-lg neon-border flex items-center justify-center bg-background group-hover:neon-glow transition-all duration-300">
            <span className="text-2xl font-black neon-text">М</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground">Мастерская</span>
            <span className="block text-sm text-muted-foreground">сувениров</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {['Витрина', 'Работы', 'Процесс', 'Отзывы', 'Контакты'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <button className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold text-background">
          <span className="relative z-10">Связаться</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
