import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems } from './data';

const GalleryWithLightbox = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryItems.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % galleryItems.length);
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <>
      <section className="py-14 sm:py-20 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Примеры печати на футболках и одежде
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10 max-w-xl mx-auto">
            Реальные работы — DTF-печать на футболках, брендирование спецодежды, печать на худи и шопперах
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden border border-border bg-card aspect-square cursor-pointer"
                onClick={() => setSelectedIndex(i)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={640}
                  height={640}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/90 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Фото: ${galleryItems[selectedIndex].alt}`}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-border/40 bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="max-w-[85vw] max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems[selectedIndex].src}
              alt={galleryItems[selectedIndex].alt}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">{galleryItems[selectedIndex].label}</p>
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card border border-border/40">
            <span className="text-sm text-muted-foreground">
              {selectedIndex + 1} / {galleryItems.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryWithLightbox;
