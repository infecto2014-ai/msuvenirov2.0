import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="mb-4 text-6xl sm:text-8xl font-black neon-text">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-muted-foreground">Страница не найдена</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
