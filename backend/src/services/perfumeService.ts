// In-memory data and helpers for perfumes, preferences, and reviews.
import { Perfume, PreferenceAction, UserPreferences, UserReview } from '../models/domain';

const perfumes: Perfume[] = [
  {
    id: 'p1',
    name: 'Citrus Bloom',
    brand: 'Atelier Verde',
    year: 2022,
    concentration: 'EDT',
    family: 'citrico floral',
    notes: { top: ['bergamota', 'limon'], heart: ['neroli', 'petitgrain'], base: ['almizcle'] },
    tags: ['fresco', 'verano', 'dia', 'citrico'],
    averageRating: 4.4,
    averageLongevityHours: 7,
    averageIntensity: 'media',
    usageStats: { day: 75, night: 25, summer: 70, winter: 30, office: 60, date: 40 },
    imageUrl: '',
    buyLinks: [
      { label: 'Ver en tienda A', url: 'https://example.com/tienda-a/citrus-bloom' },
      { label: 'Ver en tienda B', url: 'https://example.com/tienda-b/citrus-bloom' },
    ],
  },
  {
    id: 'p2',
    name: 'Noir Essence',
    brand: 'Maison Lumiere',
    year: 2020,
    concentration: 'EDP',
    family: 'ambar especiado',
    notes: { top: ['cardamomo', 'pimienta'], heart: ['rosa', 'incienso'], base: ['pachuli', 'ambar'] },
    tags: ['nocturno', 'invierno', 'noche', 'intenso'],
    averageRating: 4.7,
    averageLongevityHours: 10,
    averageIntensity: 'fuerte',
    usageStats: { day: 20, night: 80, summer: 10, winter: 90, office: 30, date: 70 },
    imageUrl: '',
    buyLinks: [
      { label: 'Ver en tienda A', url: 'https://example.com/tienda-a/noir-essence' },
      { label: 'Ver en tienda B', url: 'https://example.com/tienda-b/noir-essence' },
    ],
  },
  {
    id: 'p3',
    name: 'Ocean Mist',
    brand: 'Nordic Wave',
    year: 2021,
    concentration: 'EDT',
    family: 'acuatico',
    notes: { top: ['ozono', 'sal marina'], heart: ['lirio', 'jazmin'], base: ['cedro', 'almizcle'] },
    tags: ['acuatico', 'marino', 'dia'],
    averageRating: 4.1,
    averageLongevityHours: 6,
    averageIntensity: 'suave',
    usageStats: { day: 80, night: 20, summer: 65, winter: 35, office: 70, date: 30 },
    imageUrl: '',
    buyLinks: [{ label: 'Ver en tienda A', url: 'https://example.com/tienda-a/ocean-mist' }],
  },
  {
    id: 'p4',
    name: 'Woodland Trail',
    brand: 'Terra Alba',
    year: 2019,
    concentration: 'EDP',
    family: 'amaderado',
    notes: { top: ['cedro'], heart: ['vetiver', 'cipres'], base: ['musgo', 'ambar'] },
    tags: ['amaderado', 'otono', 'invierno', 'noche'],
    averageRating: 4.3,
    averageLongevityHours: 8,
    averageIntensity: 'media',
    usageStats: { day: 40, night: 60, summer: 35, winter: 65, office: 55, date: 45 },
    imageUrl: '',
    buyLinks: [{ label: 'Ver en tienda B', url: 'https://example.com/tienda-b/woodland-trail' }],
  },
  {
    id: 'p5',
    name: 'Velvet Sky',
    brand: 'Lune',
    year: 2018,
    concentration: 'Parfum',
    family: 'dulce oriental',
    notes: { top: ['mandarina'], heart: ['jazmin', 'heliotropo'], base: ['vainilla', 'tonka', 'almizcle'] },
    tags: ['dulce', 'noche', 'invierno'],
    averageRating: 4.6,
    averageLongevityHours: 9,
    averageIntensity: 'fuerte',
    usageStats: { day: 25, night: 75, summer: 20, winter: 80, office: 30, date: 70 },
    imageUrl: '',
    buyLinks: [{ label: 'Ver en tienda A', url: 'https://example.com/tienda-a/velvet-sky' }],
  },
];

const preferencesByUser: Record<string, UserPreferences> = {
  'user-1': {
    userId: 'user-1',
    likes: ['p1', 'p3', 'p4'],
    dislikes: ['p2'],
    favorites: ['p1', 'p4'],
    wantToTry: ['p5'],
    haveIt: ['p3'],
  },
};

const reviews: UserReview[] = [
  { userId: 'user-1', perfumeId: 'p1', rating: 4, comment: 'Fresco y facil de usar', createdAt: new Date() },
  { userId: 'user-2', perfumeId: 'p2', rating: 5, comment: 'Intenso y elegante', createdAt: new Date() },
];

function ensureUserPreferences(userId: string): UserPreferences {
  if (!preferencesByUser[userId]) {
    preferencesByUser[userId] = { userId, likes: [], dislikes: [], favorites: [], wantToTry: [], haveIt: [] };
  }
  return preferencesByUser[userId];
}

function toggleInList(list: string[], perfumeId: string) {
  const exists = list.includes(perfumeId);
  if (exists) {
    return list.filter((id) => id !== perfumeId);
  }
  return [...list, perfumeId];
}

const actionMap: Record<PreferenceAction, keyof UserPreferences> = {
  like: 'likes',
  dislike: 'dislikes',
  favorite: 'favorites',
  wantToTry: 'wantToTry',
  haveIt: 'haveIt',
};

function applyPreferenceAction(userId: string, perfumeId: string, action: PreferenceAction): UserPreferences {
  const prefs = ensureUserPreferences(userId);
  const targetKey = actionMap[action];
  // Basic toggle; if liking, also remove from dislikes and vice-versa to avoid conflict.
  if (action === 'like') {
    prefs.dislikes = prefs.dislikes.filter((id) => id !== perfumeId);
  }
  if (action === 'dislike') {
    prefs.likes = prefs.likes.filter((id) => id !== perfumeId);
  }
  prefs[targetKey] = toggleInList(prefs[targetKey], perfumeId);
  return prefs;
}

export const perfumeService = {
  listPerfumes: (filters?: { name?: string; brand?: string; tag?: string }) => {
    const nameTerm = filters?.name?.toLowerCase() || '';
    const brandTerm = filters?.brand?.toLowerCase() || '';
    const tagTerm = filters?.tag?.toLowerCase() || '';

    return perfumes.filter((perfume) => {
      const matchesName = !nameTerm || perfume.name.toLowerCase().includes(nameTerm);
      const matchesBrand = !brandTerm || perfume.brand.toLowerCase().includes(brandTerm);
      const matchesTag = !tagTerm || perfume.tags.some((tag) => tag.toLowerCase() === tagTerm);
      return matchesName && matchesBrand && matchesTag;
    });
  },

  getPerfumeById: (id: string) => perfumes.find((perfume) => perfume.id === id),
  getAll: () => perfumes,

  getUserPreferences: (userId: string) => ensureUserPreferences(userId),

  updateUserPreference: (userId: string, perfumeId: string, action: PreferenceAction) => {
    return applyPreferenceAction(userId, perfumeId, action);
  },

  getReviewsByPerfume: (perfumeId: string) => reviews.filter((review) => review.perfumeId === perfumeId),

  addReview: (review: Omit<UserReview, 'createdAt'>) => {
    const newReview: UserReview = { ...review, createdAt: new Date() };
    reviews.push(newReview);
    return newReview;
  },
};
