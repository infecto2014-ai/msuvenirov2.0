import { memo } from 'react';

const videos = [
  {
    id: '5aca36d827a345d86d32ac97df583899',
    token: '01-_Kfte5y6flR2-aDfrIA',
    title: 'Брендирование формы Динамо — Зенит',
  },
  {
    id: '04e2c79246a3978989ff0a58b900efb1',
    token: 'OUdk3KMcTlDHlFoAOq5fTA',
    title: 'Брендирование формы Балтика — Локомотив',
  },
];

const VideoShowcaseSection = memo(() => (
  <section
    id="video-showcase"
    className="py-16 md:py-24 bg-background"
    aria-labelledby="video-showcase-heading"
  >
    <div className="container mx-auto px-4 max-w-5xl">
      <h2
        id="video-showcase-heading"
        className="text-2xl md:text-4xl font-bold text-center mb-4 neon-text"
      >
        Брендирование формы для матчей «Динамо» — «Зенит» и «Балтика» — «Локомотив»
      </h2>

      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
        Качественная печать на спортивной одежде на заказ. Подготовили партию футболок
        с&nbsp;эксклюзивным дизайном. Работаем с&nbsp;любыми тиражами: от&nbsp;одного изделия
        до&nbsp;полного обеспечения спортивных команд.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {videos.map((v) => (
          <div key={v.id} className="glass-card rounded-2xl overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '177.78%' /* 9:16 */ }}>
              <iframe
                src={`https://rutube.ru/play/embed/${v.id}/?p=${v.token}`}
                title={v.title}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <p className="p-3 text-center text-xs md:text-sm text-muted-foreground">
              {v.title}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* JSON-LD VideoObject for SEO */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Брендирование формы Динамо — Зенит | DTF печать Калининград',
            description:
              'Печать на спортивной форме для матча Динамо — Зенит. Профессиональная DTF-печать на одежде в Калининграде.',
            thumbnailUrl: `https://rutube.ru/api/video/${videos[0].id}/thumbnail/`,
            uploadDate: '2025-01-01',
            contentUrl: `https://rutube.ru/video/${videos[0].id}/`,
            embedUrl: `https://rutube.ru/play/embed/${videos[0].id}/`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Брендирование формы Балтика — Локомотив | DTF печать Калининград',
            description:
              'Печать на спортивной форме для матча Балтика — Локомотив. Профессиональная DTF-печать на одежде в Калининграде.',
            thumbnailUrl: `https://rutube.ru/api/video/${videos[1].id}/thumbnail/`,
            uploadDate: '2025-01-01',
            contentUrl: `https://rutube.ru/video/${videos[1].id}/`,
            embedUrl: `https://rutube.ru/play/embed/${videos[1].id}/`,
          },
        ]),
      }}
    />
  </section>
));

VideoShowcaseSection.displayName = 'VideoShowcaseSection';

export default VideoShowcaseSection;
