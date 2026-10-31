import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '@/components/Seo';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { useLazySection } from '@/hooks/useLazySection';

const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));
const PWAInstallBanner = lazy(() => import('@/components/PWAInstallBanner'));

// Lazy load below-the-fold sections for better LCP
const sectionLoaders = [
  () => import('@/components/AboutSection'),
  () => import('@/components/ShowcaseSection'),
  () => import('@/components/TechnologySection'),
  () => import('@/components/PortfolioSection'),
  () => import('@/components/WhyUsSection'),
  () => import('@/components/ReviewsSection'),
  () => import('@/components/TrustSection'),
  () => import('@/components/ContactSection'),
  () => import('@/components/Footer'),
];
const [AboutSection, ShowcaseSection, TechnologySection, PortfolioSection, WhyUsSection, ReviewsSection, TrustSection, ContactSection, Footer] =
  sectionLoaders.map((load) => lazy(load as () => Promise<{ default: React.ComponentType }>));

/** Used by main.tsx before hydrating prerendered "/" so no section chunk is still pending. */
export const preload = () => Promise.all(sectionLoaders.map((load) => load())).then(() => undefined);

// Minimal loading placeholder for sections
const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

/** Renders children only when the placeholder enters viewport */
const LazySection = ({ children, minHeight = '200px' }: { children: React.ReactNode; minHeight?: string }) => {
  const [ref, isVisible] = useLazySection('300px');
  return (
    <div ref={ref} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? (
        <Suspense fallback={<SectionLoader />}>{children}</Suspense>
      ) : (
        <SectionLoader />
      )}
    </div>
  );
};

const Index = () => {
  const location = useLocation();

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
        
        <LazySection>
          <AboutSection />
        </LazySection>

        {/* Heavy Swiper sections — only load near viewport */}
        <LazySection minHeight="500px">
          <ShowcaseSection />
        </LazySection>
        <LazySection>
          <TechnologySection />
        </LazySection>
        <LazySection minHeight="500px">
          <PortfolioSection />
        </LazySection>
        <LazySection>
          <WhyUsSection />
        </LazySection>
        <LazySection>
          <ReviewsSection />
        </LazySection>
        <LazySection>
          <TrustSection />
        </LazySection>
        <LazySection>
          <ContactSection />
        </LazySection>
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
