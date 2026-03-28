import { Phone, Upload, Home, ExternalLink } from 'lucide-react';
import ProtectedLogo from '@/components/ProtectedLogo';

const links = [
  {
    label: 'Позвонить',
    href: 'tel:+79521142350',
    icon: Phone,
    external: false,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/msuvenirov39zakaz',
    icon: null, // custom SVG
    iconType: 'telegram',
    external: true,
  },
  {
    label: 'MAX',
    href: 'https://max.ru/u/f9LHodD0cOLo7HDSJw672fSH82yru_atZ9KDVODSf_2mghJHg1xe7H2qOC8',
    icon: null,
    iconType: 'max',
    external: true,
  },
  {
    label: 'ВКонтакте',
    href: 'https://vk.com/msuvenirov39',
    icon: null,
    iconType: 'vk',
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/msuvenirov39',
    icon: null,
    iconType: 'instagram',
    external: true,
  },
  {
    label: 'Отправить файл через сайт',
    href: '#order',
    icon: Upload,
    external: false,
    action: 'openOrder',
  },
  {
    label: 'Посетить сайт',
    href: '/',
    icon: Home,
    external: false,
  },
];

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.163c-.112.136-.009.418-.009.418s1.781 4.232 3.799 6.36c1.851 1.952 3.953 1.824 3.953 1.824h.953z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MaxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H8v-2h3v2zm5-4H8v-2h8v2zm0-4H8V7h8v2z" />
  </svg>
);

const getIcon = (link: typeof links[0]) => {
  if (link.icon) {
    const Icon = link.icon;
    return <Icon className="w-5 h-5 flex-shrink-0" />;
  }
  const cls = "w-5 h-5 flex-shrink-0";
  switch ((link as any).iconType) {
    case 'telegram': return <TelegramIcon className={cls} />;
    case 'vk': return <VKIcon className={cls} />;
    case 'instagram': return <InstagramIcon className={cls} />;
    case 'max': return <MaxIcon className={cls} />;
    default: return <ExternalLink className={cls} />;
  }
};

const LinkInBio = () => {
  const handleClick = (link: typeof links[0], e: React.MouseEvent) => {
    if ((link as any).action === 'openOrder') {
      e.preventDefault();
      const orderButton = document.querySelector('[data-order-button]') as HTMLButtonElement;
      if (orderButton) orderButton.click();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-10 max-w-md mx-auto min-h-screen">
        {/* Logo */}
        <div className="mb-10">
          <ProtectedLogo height={48} />
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) => {
            const isExternal = link.external;
            return (
              <a
                key={link.label}
                href={link.href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => handleClick(link, e)}
                className="group w-full flex items-center gap-3 px-5 py-4 rounded-xl neon-border bg-card/70 text-foreground font-medium text-sm transition-all duration-200 hover:neon-glow hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
              >
                <span className="text-primary transition-colors duration-200 group-hover:text-secondary">
                  {getIcon(link)}
                </span>
                <span className="flex-1">{link.label}</span>
                {isExternal && <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <p className="mt-auto pt-10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Мастерская сувениров
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
