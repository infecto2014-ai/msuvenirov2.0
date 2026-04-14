import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { useLazySection } from '@/hooks/useLazySection';

const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));
const PWAInstallBanner = lazy(() => import('@/components/PWAInstallBanner'));

// Lazy load below-the-fold sections for better LCP
const AboutSection = lazy(() => import('@/components/AboutSection'));
const ShowcaseSection = lazy(() => import('@/components/ShowcaseSection'));
const TechnologySection = lazy(() => import('@/components/TechnologySection'));
const PortfolioSection = lazy(() => import('@/components/PortfolioSection'));
const WhyUsSection = lazy(() => import('@/components/WhyUsSection'));
const ReviewsSection = lazy(() => import('@/components/ReviewsSection'));
const TrustSection = lazy(() => import('@/components/TrustSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

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
