import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Neon glow background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      <div className="text-center px-6 relative z-10">
        <h1 className="mb-2 text-[8rem] sm:text-[12rem] font-black leading-none neon-text select-none">
          404
        </h1>
        <p className="mb-2 text-lg sm:text-xl text-muted-foreground">
          Страница не найдена
        </p>
        <p className="mb-8 text-sm text-muted-foreground/60 max-w-md mx-auto">
          Запрашиваемая страница не существует или была перемещена
        </p>
        <Link
          to="/"
          className="gradient-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            Вернуться на главную
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
