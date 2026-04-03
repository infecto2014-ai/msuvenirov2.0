import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
const FloatingOrderButton = lazy(() => import('@/components/FloatingOrderButton'));

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

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Delay to allow lazy sections to render
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
        
        {/* Below-fold sections lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ShowcaseSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TechnologySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PortfolioSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyUsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ReviewsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TrustSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <FloatingOrderButton />
    </div>
  );
};

export default Index;
