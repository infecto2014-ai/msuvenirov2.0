import client1 from '@/assets/clients/client-1.png';
import client2 from '@/assets/clients/client-2.png';
import client3 from '@/assets/clients/client-3.png';
import client4 from '@/assets/clients/client-4.png';
import client5 from '@/assets/clients/client-5.png';
import client6 from '@/assets/clients/client-6.png';
import client7 from '@/assets/clients/client-7.png';
import client8 from '@/assets/clients/client-8.png';

const clients = [
  { id: 1, name: 'Клиент 1', logo: client1 },
  { id: 2, name: 'Арле Парк', logo: client2 },
  { id: 3, name: 'Fonbet', logo: client3 },
  { id: 4, name: 'Папаша Бенне', logo: client4 },
  { id: 5, name: 'Неудержимые', logo: client5 },
  { id: 6, name: 'Клиент 6', logo: client6 },
  { id: 7, name: 'Клиент 7', logo: client7 },
  { id: 8, name: 'Котик', logo: client8 },
];

const TrustSection = () => {
  // Triple the clients for seamless infinite loop
  const repeatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            НАМ <span className="neon-text">ДОВЕРЯЮТ</span>
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Marquee Track */}
          <div className="group flex">
            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
              {repeatedClients.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="relative flex items-center justify-center px-6 sm:px-10 py-4 flex-shrink-0"
                >
                  {/* Neon glow background */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-60 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.12) 0%, rgba(168, 85, 247, 0.08) 30%, transparent 60%)',
                    }}
                  />
                  
                  {/* Logo */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="relative z-10 h-12 sm:h-16 md:h-20 w-auto max-w-[120px] sm:max-w-[150px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
