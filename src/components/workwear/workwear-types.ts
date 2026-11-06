// Types and colours of the workwear drawing (WorkwearArt.astro); kept separate so data files can import them.
export type WorkwearType = 'jacket' | 'vest' | 'signal' | 'overalls' | 'apron' | 'polo';
export type WorkwearView = 'front' | 'back';
export type WorkwearPlace = 'chest' | 'back' | 'sleeve';
export type WorkwearColor = 'navy' | 'graphite' | 'black' | 'grey' | 'orange' | 'lime' | 'red' | 'green' | 'white' | 'khaki';

export const WW_COLORS: Record<WorkwearColor, { hex: string; label: string }> = {
  navy: { hex: '#24324f', label: 'Тёмно-синий' },
  graphite: { hex: '#3a3f47', label: 'Графитовый' },
  black: { hex: '#1b1b1f', label: 'Чёрный' },
  grey: { hex: '#8a9099', label: 'Серый' },
  orange: { hex: '#ff7a1a', label: 'Оранжевый' },
  lime: { hex: '#cdf03a', label: 'Лимонный' },
  red: { hex: '#c8202a', label: 'Красный' },
  green: { hex: '#2f5d3a', label: 'Тёмно-зелёный' },
  white: { hex: '#f4f2ec', label: 'Белый' },
  khaki: { hex: '#6f6a3e', label: 'Хаки' },
};
