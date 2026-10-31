import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { endPrerenderHydration, isPrerenderHydration, useLazySection } from '@/hooks/useLazySection';

const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));
const PWAInstallBanner = lazy(() => import('@/components/PWAInstallBanner'));

type SectionModule = { default: ComponentType };

/** Lazy section chunk that also remembers the loaded component, so it can render without suspending */
const section = (load: () => Promise<SectionModule>) => {
  let loaded: ComponentType | undefined;
  const ensure = () => load().then((m) => { loaded = m.default; return m; });
  return { ensure, Lazy: lazy(ensure), get: () => loaded };
};
type Section = ReturnType<typeof section>;

// Lazy load below-the-fold sections for better LCP
const About = section(() => import('@/components/AboutSection'));
const Showcase = section(() => import('@/components/ShowcaseSection'));
const Technology = section(() => import('@/components/TechnologySection'));
const Portfolio = section(() => import('@/components/PortfolioSection'));
const WhyUs = section(() => import('@/components/WhyUsSection'));
const Reviews = section(() => import('@/components/ReviewsSection'));
const Trust = section(() => import('@/components/TrustSection'));
const Contact = section(() => import('@/components/ContactSection'));
const FooterSection = section(() => import('@/components/Footer'));
const Footer = FooterSection.Lazy;

const sections = [About, Showcase, Technology, Portfolio, WhyUs, Reviews, Trust, Contact, FooterSection];

/** Started (not awaited) by main.tsx when hydrating prerendered "/" so chunks are ready before the user scrolls. */
export const preload = () => Promise.all(sections.map((s) => s.ensure())).then(() => undefined);

// Minimal loading placeholder for sections
const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

/** Renders the section only when the placeholder enters viewport */
const LazySection = ({ section: s, minHeight = '200px' }: { section: Section; minHeight?: string }) => {
  const [ref, isVisible] = useLazySection('300px');
  // After hydrating prerendered HTML, keep the server markup untouched (no JS work, no layout reads)
  // until the section nears the viewport and its chunk has loaded — then swap in the live component.
  const [dormant, setDormant] = useState(isPrerenderHydration);

  useEffect(() => {
    if (!dormant || !isVisible) return;
    let cancelled = false;
    const wake = () => { if (!cancelled) setDormant(false); };
    s.ensure().then(wake, wake);
    return () => { cancelled = true; };
  }, [dormant, isVisible, s]);

  if (dormant) {
    return <div key="static" ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: '' }} />;
  }

  const Loaded = s.get();
  return (
    <div key="live" ref={ref} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {!isVisible ? (
        <SectionLoader />
      ) : Loaded ? (
        <Loaded />
      ) : (
        <Suspense fallback={<SectionLoader />}><s.Lazy /></Suspense>
      )}
    </div>
  );
};

const Index = () => {
  const location = useLocation();

  // Sections read the prerender flag in their initial state; later visits to "/" are plain client renders
  useEffect(() => {
    endPrerenderHydration();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Seo
        path="/"
        title="Печать на футболках Калининград от 300 ₽ | Мастерская сувениров"
        description="DTF-печать на футболках, худи, кружках и сувенирах в Калининграде. От 1 шт, за 24 часа, гарантия 50+ стирок. Своё производство, опыт 10+ лет."
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://msuvenirov.ru/" }
          ]
        })}</script>
      </Seo>
      <Header />
      <main>
        {/* Hero loads immediately - critical for LCP */}
        <HeroSection />
        
        <LazySection section={About} />

        {/* Heavy Swiper sections — only load near viewport */}
        <LazySection section={Showcase} minHeight="500px" />
        <LazySection section={Technology} />
        <LazySection section={Portfolio} minHeight="500px" />
        <LazySection section={WhyUs} />
        <LazySection section={Reviews} />
        <LazySection section={Trust} />
        <LazySection section={Contact} />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingOrderButton />
      </Suspense>
      <Suspense fallback={null}>
        <PWAInstallBanner />
      </Suspense>
    </div>
  );
};

export default Index;
