import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import PortfolioSection from '@/components/PortfolioSection';
import ProcessSection from '@/components/ProcessSection';
import ReviewsSection from '@/components/ReviewsSection';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <PortfolioSection />
        <ProcessSection />
        <ReviewsSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
