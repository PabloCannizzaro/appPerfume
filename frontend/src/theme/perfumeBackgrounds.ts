import { LinearGradientProps } from 'expo-linear-gradient';

export type PerfumeBackground = Pick<LinearGradientProps, 'colors' | 'start' | 'end'>;

const themes: Record<string, PerfumeBackground> = {
  'aquatic-blue': { colors: ['#0ea5e9', '#38bdf8'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'tropical-green': { colors: ['#34d399', '#22c55e', '#f59e0b'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'citrus-yellow': { colors: ['#facc15', '#f97316'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'woody-brown': { colors: ['#92400e', '#78350f', '#4b5563'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'gourmand-warm': { colors: ['#fbbf24', '#f97316', '#b45309'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'floral-pink': { colors: ['#f472b6', '#ec4899', '#a855f7'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'dark-leather': { colors: ['#111827', '#1f2937', '#4b5563'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'clean-blue': { colors: ['#e0f2fe', '#bae6fd', '#93c5fd'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

export function getPerfumeBackground(theme?: string, tags: string[] = []): PerfumeBackground {
  if (theme && themes[theme]) return themes[theme];

  const lowerTags = tags.map((t) => t.toLowerCase());
  if (lowerTags.some((t) => ['acuatico', 'marino', 'ozonico', 'salado'].includes(t))) return themes['aquatic-blue'];
  if (lowerTags.some((t) => ['tropical', 'frutal', 'coco', 'playa'].includes(t))) return themes['tropical-green'];
  if (lowerTags.some((t) => ['citrico', 'limon', 'naranja', 'bergamota'].includes(t))) return themes['citrus-yellow'];
  if (lowerTags.some((t) => ['amaderado', 'vetiver', 'cedro', 'verdes'].includes(t))) return themes['woody-brown'];
  if (lowerTags.some((t) => ['gourmand', 'vainilla', 'dulce', 'cafe', 'cacao'].includes(t))) return themes['gourmand-warm'];
  if (lowerTags.some((t) => ['floral', 'rosa', 'jazmin', 'ylang'].includes(t))) return themes['floral-pink'];
  if (lowerTags.some((t) => ['cuero', 'ahumado', 'oud', 'tabaco'].includes(t))) return themes['dark-leather'];
  if (lowerTags.some((t) => ['limpio', 'algodon', 'jabonoso'].includes(t))) return themes['clean-blue'];

  return { colors: ['#e5e7eb', '#f3f4f6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
}
