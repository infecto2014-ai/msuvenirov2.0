import { useState, useEffect } from 'react';

const companies = [
  { id: 1, name: 'TechCorp' },
  { id: 2, name: 'MediaGroup' },
  { id: 3, name: 'StartupHub' },
  { id: 4, name: 'EcoWorld' },
  { id: 5, name: 'FinanceOne' },
  { id: 6, name: 'HealthPlus' },
];

const TrustSection = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % companies.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-5 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            НАМ <span className="neon-text">ДОВЕРЯЮТ</span>
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${offset * (100 / 6)}%)` }}
          >
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company.id}-${index}`}
                className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-1.5 sm:px-2"
              >
                <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 h-12 sm:h-14 flex items-center justify-center hover:neon-glow transition-all duration-300">
                  <span className="text-xs sm:text-sm font-bold text-muted-foreground">{company.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
