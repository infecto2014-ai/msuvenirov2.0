import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import TechnologySection from '@/components/TechnologySection';
import PortfolioSection from '@/components/PortfolioSection';
import WhyUsSection from '@/components/WhyUsSection';
import ReviewsSection from '@/components/ReviewsSection';
import FAQSection from '@/components/FAQSection';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingOrderButton from '@/components/FloatingOrderButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ShowcaseSection />
        <TechnologySection />
        <PortfolioSection />
        <WhyUsSection />
        <ReviewsSection />
        <FAQSection />
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingOrderButton />
    </div>
  );
};

export default Index;
