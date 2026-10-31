import { useState, useRef, useEffect } from 'react';

/** Force all lazy sections to render immediately */
let forceAllVisible = false;
const listeners = new Set<() => void>();

export function forceLoadAllSections() {
  forceAllVisible = true;
  listeners.forEach((cb) => cb());
}

/**
 * Set by main.tsx before hydrating a prerendered page: lazy sections then keep
 * their server HTML as-is and become interactive only when they near the viewport.
 */
let prerenderHydration = false;

export function markPrerenderHydration() {
  prerenderHydration = true;
}

/** True only for the first render after hydrating prerendered markup. */
export const isPrerenderHydration = () => prerenderHydration;

export function endPrerenderHydration() {
  prerenderHydration = false;
}

/**
 * Returns [ref, isVisible] — the section renders only when
 * it enters (or is about to enter) the viewport,
 * or when forceLoadAllSections() is called.
 */
export function useLazySection(rootMargin = '200px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(forceAllVisible);

  useEffect(() => {
    if (isVisible) return;

    const show = () => setIsVisible(true);

    // Listen for force-load event
    listeners.add(show);

    const el = ref.current;
    if (!el) return () => { listeners.delete(show); };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      listeners.delete(show);
    };
  }, [rootMargin, isVisible]);

  return [ref, isVisible] as const;
}
