// Line icons (24×24, stroke) for round badges on the «Ink» pages. Shared by InkHead, InkBlocks and the pages.
export const ink: Record<string, string> = {
  calc: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01',
  shirt: 'M8 3 3 6l2 4 3-1.2V21h8V8.8L19 10l2-4-5-3a4 4 0 0 1-8 0Z',
  ruler: 'm14.5 3.5 6 6-11 11-6-6zM8 9l2 2M11 6l2 2M5 12l2 2M14 12l2 2',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z',
  tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9zM8 8h.01',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2.5 0-4.5-1-4.5-2.5S9 2.5 12 7c3-4.5 4.5-3 4.5-1.5S14.5 7 12 7Z',
  check: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 12.5l2.8 2.8L16 9.6',
  layers: 'm12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  heart: 'M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20Z',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01',
  bag: 'M5 8h14l-1.2 12H6.2zM9 8V6a3 3 0 0 1 6 0v2',
  factory: 'M3 21h18M5 21V9l5 3V9l5 3V6h4v15',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  pencil: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
  chat: 'M4 5h16v11H9l-5 4z',
  building: 'M4 21V5h10v16M14 10h6v11M8 9h2M8 13h2M8 17h2',
  file: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',
  type: 'M5 6V4h14v2M12 4v16M9 20h6',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M4 5h16v14H4zM4 6l8 7 8-7',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
};
/** pick an icon for a card by words in its title; falls back to a rotation */
export function pickIcon(title: string, i: number, rules: [RegExp, string][], fallback: string[]): string {
  const t = title.toLowerCase();
  for (const [re, name] of rules) if (re.test(t)) return name;
  return fallback[i % fallback.length];
}
