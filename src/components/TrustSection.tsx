import client1 from '@/assets/clients/client-1.png';
import client2 from '@/assets/clients/client-2.png';
import client3 from '@/assets/clients/client-3.jpg';
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
  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            НАМ <span className="neon-text">ДОВЕРЯЮТ</span>
          </h2>
        </div>

        {/* Logo Grid with Neon Backlight */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group relative flex items-center justify-center p-4 sm:p-6 rounded-xl transition-all duration-300"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.08) 0%, rgba(255, 0, 255, 0.05) 40%, transparent 70%)',
              }}
            >
              {/* Neon glow background - intensifies on hover */}
              <div 
                className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 30%, transparent 60%)',
                }}
              />
              
              {/* Extra glow layer for hover effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)',
                }}
              />
              
              {/* Logo */}
              <img
                src={client.logo}
                alt={client.name}
                className="relative z-10 w-full h-16 sm:h-20 md:h-24 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
