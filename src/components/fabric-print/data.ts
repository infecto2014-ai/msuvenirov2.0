import { Flame, Droplets } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DtfPrice {
  format: string;
  qty1: string;
  qty5: string;
  qty20: string;
}

export interface MethodInfo {
  method: string;
  icon: LucideIcon;
  image: string;
  pros: string[];
  cons: string[];
  best: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  label: string;
}

export const dtfPrices: DtfPrice[] = [
  { format: 'А6', qty1: '600 ₽', qty5: '350 ₽', qty20: '280 ₽' },
  { format: 'А5', qty1: '600 ₽', qty5: '450 ₽', qty20: '330 ₽' },
  { format: 'А4', qty1: '800 ₽', qty5: '650 ₽', qty20: '450 ₽' },
  { format: 'А3', qty1: '1 100 ₽', qty5: '900 ₽', qty20: '680 ₽' },
];

export const methodComparison: MethodInfo[] = [
  {
    method: 'DTF-печать',
    icon: Flame,
    image: '/portfolio/dtf-bestdad.webp',
    pros: ['Любой цвет ткани', 'Фотореалистичная печать', 'От 1 штуки', '50+ стирок', 'Быстрое изготовление'],
    cons: ['Ощущается на ощупь'],
    best: 'Сложные полноцветные дизайны, срочные заказы, крупные тиражи',
  },
  {
    method: 'Сублимация',
    icon: Droplets,
    image: '/portfolio/sublimation-anime.webp',
    pros: ['Принт «впечатан» в ткань', 'Не ощущается на ощупь', 'Безграничная палитра', 'Не трескается'],
    cons: ['Только белая/светлая синтетика', 'Не подходит для хлопка'],
    best: 'Спортивная форма, сувенирная продукция, кружки',
  },
];

export const faqItems: FaqItem[] = [
  { q: 'Какой минимальный тираж?', a: 'Печатаем от 1 штуки. Нет ограничений на минимальный заказ — можно заказать даже одну футболку с уникальным дизайном.' },
  { q: 'Сколько стирок выдерживает DTF-печать?', a: 'При правильном уходе (стирка до 40°C наизнанку) — более 50 стирок без потери яркости и трещин.' },
  { q: 'Чем DTF отличается от сублимации?', a: 'DTF переносит принт плёнкой на любую ткань. Сублимация «впечатывает» краску в синтетические волокна — принт не ощущается тактильно, но работает только на белой синтетике.' },
  { q: 'Можно печатать на своих изделиях?', a: 'Да, вы можете привезти свои футболки, худи или шопперы. Мы нанесём принт на ваше изделие.' },
  { q: 'Какой формат макета нужен?', a: 'Принимаем PNG, PDF, AI, PSD, CDR. Разрешение от 300 dpi. Если макета нет — поможем с дизайном.' },
  { q: 'Есть ли доставка?', a: 'Да, доставляем по Калининграду и области. Также возможна отправка по России транспортными компаниями.' },
];

export const galleryItems: GalleryItem[] = [
  { src: '/portfolio/kpop-tshirt.webp', alt: 'DTF-печать на чёрной футболке — K-pop дизайн с цветным принтом в Калининграде', label: 'DTF на футболке' },
  { src: '/portfolio/sport-jersey.webp', alt: 'Печать на спортивной форме — нанесение номера и эмблемы на майку', label: 'Спортивная форма' },
  { src: '/portfolio/corporate-polo.webp', alt: 'Печать логотипа на корпоративном поло — брендирование одежды для бизнеса', label: 'Брендирование для компаний' },
  { src: '/portfolio/wedding-tshirts.webp', alt: 'Печать на парных футболках — DTF-печать именного дизайна на заказ', label: 'DTF на футболке' },
  { src: '/portfolio/branded-caps.webp', alt: 'Печать на бейсболках — DTF-брендирование кепок с логотипом компании', label: 'Печать на кепках' },
  { src: '/portfolio/shopper-bags.webp', alt: 'Печать на шопперах — DTF-печать авторского дизайна на хлопковых сумках', label: 'Печать на шопперах' },
];

export const productTags = [
  'Футболки', 'Поло', 'Лонгсливы', 'Худи', 'Свитшоты',
  'Шопперы', 'Фартуки', 'Спецодежда', 'Бейсболки', 'Своё изделие',
];

export const videoItems = [
  { id: '5aca36d827a345d86d32ac97df583899', token: '01-_Kfte5y6flR2-aDfrIA', title: 'Брендирование формы Динамо — Зенит' },
  { id: '04e2c79246a3978989ff0a58b900efb1', token: 'OUdk3KMcTlDHlFoAOq5fTA', title: 'Брендирование формы Балтика — Локомотив' },
];
