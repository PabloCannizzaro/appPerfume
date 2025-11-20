// DEPRECATED: solo para uso offline; la app usa la API real cuando esta disponible.
import { Perfume, Review } from '../types/domain';

export type PerfumeDetail = Perfume & {
  ratingCount?: number;
};

// Mock data source; replace with API call later.
const perfumeDetails: Record<string, PerfumeDetail> = {
  p1: {
    id: 'p1',
    name: 'Citrus Bloom',
    brand: 'Atelier Verde',
    family: 'Citrico floral',
    concentration: 'EDT',
    launchYear: 2022,
    topNotes: ['bergamota', 'limon', 'neroli'],
    heartNotes: ['petitgrain', 'jasmine', 'rosa'],
    baseNotes: ['almizcle', 'cedro'],
    notes: ['bergamota', 'neroli', 'almizcle'],
    tags: ['fresco', 'verano', 'citrico', 'dia'],
    summary: 'Perfume fresco para verano, intensidad media.',
    ratingAverage: 4.4,
    ratingCount: 128,
    longevity: '6-8 horas',
    sillage: 'media',
    usage: ['dia', 'verano', 'oficina'],
    imageUrl: '',
    externalLinks: ['https://example.com/tienda-a', 'https://example.com/tienda-b'],
  },
  p2: {
    id: 'p2',
    name: 'Noir Essence',
    brand: 'Maison Lumiere',
    family: 'Ambar especiado',
    concentration: 'EDP',
    launchYear: 2020,
    topNotes: ['cardamomo', 'pimienta rosa'],
    heartNotes: ['incienso', 'rosa'],
    baseNotes: ['pachuli', 'ambar', 'vainilla'],
    notes: ['cardamomo', 'ambar', 'pachuli'],
    tags: ['nocturno', 'intenso', 'invernal', 'noche', 'dulce'],
    summary: 'Oriental especiado con buena fijacion.',
    ratingAverage: 4.7,
    ratingCount: 201,
    longevity: '8-10 horas',
    sillage: 'fuerte',
    usage: ['noche', 'invierno', 'cita'],
    imageUrl: '',
    externalLinks: ['https://example.com/tienda-a', 'https://example.com/tienda-b'],
  },
  p3: {
    id: 'p3',
    name: 'Ocean Mist',
    brand: 'Nordic Wave',
    family: 'Acuatico',
    concentration: 'EDT',
    launchYear: 2021,
    topNotes: ['ozono', 'sal marina'],
    heartNotes: ['lirio de agua', 'jazmin'],
    baseNotes: ['cedro', 'almizcle'],
    notes: ['ozono', 'sal marina', 'cedro'],
    tags: ['marino', 'limpio', 'diario', 'acuatico', 'dia'],
    summary: 'Acuatico limpio para uso diario.',
    ratingAverage: 4.1,
    ratingCount: 90,
    longevity: '5-6 horas',
    sillage: 'suave',
    usage: ['dia', 'primavera', 'verano'],
    imageUrl: '',
    externalLinks: ['https://example.com/tienda-a', 'https://example.com/tienda-b'],
  },
  p4: {
    id: 'p4',
    name: 'Woodland Trail',
    brand: 'Terra Alba',
    family: 'Amaderado',
    concentration: 'EDP',
    launchYear: 2019,
    topNotes: ['cedro', 'bayas de enebro'],
    heartNotes: ['vetiver', 'cipres'],
    baseNotes: ['musgo de roble', 'ambar'],
    notes: ['cedro', 'vetiver', 'musgo'],
    tags: ['amaderado', 'otono', 'invierno', 'noche'],
    summary: 'Amaderado seco con toques verdes.',
    ratingAverage: 4.3,
    ratingCount: 74,
    longevity: '7-9 horas',
    sillage: 'media',
    usage: ['noche', 'invierno', 'oficina'],
    imageUrl: '',
    externalLinks: ['https://example.com/tienda-a', 'https://example.com/tienda-b'],
  },
  p5: {
    id: 'p5',
    name: 'Velvet Sky',
    brand: 'Lune',
    family: 'Dulce oriental',
    concentration: 'EDP',
    launchYear: 2018,
    topNotes: ['mandarina', 'ciruela'],
    heartNotes: ['jazmin', 'heliotropo'],
    baseNotes: ['vainilla', 'tonka', 'almizcle'],
    notes: ['vainilla', 'tonka', 'almizcle'],
    tags: ['dulce', 'nocturno', 'noche'],
    summary: 'Dulce cremoso ideal para salidas de noche.',
    ratingAverage: 4.6,
    ratingCount: 156,
    longevity: '6-8 horas',
    sillage: 'fuerte',
    usage: ['noche', 'invierno', 'cita'],
    imageUrl: '',
    externalLinks: ['https://example.com/tienda-a', 'https://example.com/tienda-b'],
  },
};

const reviewsMock: Review[] = [
  { id: 'r1', perfumeId: 'p1', userId: 'u1', userName: 'Ana', rating: 4, comment: 'Muy fresco y facil de usar', date: '2024-01-10' },
  { id: 'r2', perfumeId: 'p1', userId: 'u2', userName: 'Luis', rating: 5, comment: 'Perfecto para verano', date: '2024-02-02' },
  { id: 'r3', perfumeId: 'p2', userId: 'u3', userName: 'Mar', rating: 5, comment: 'Intenso pero elegante', date: '2024-03-01' },
  { id: 'r4', perfumeId: 'p3', userId: 'u4', userName: 'Cami', rating: 4, comment: 'Oceanico y limpio', date: '2024-03-15' },
];

export function getPerfumeDetail(perfumeId: string): PerfumeDetail | undefined {
  return perfumeDetails[perfumeId];
}

export function getPerfumeReviews(perfumeId: string): Review[] {
  return reviewsMock.filter((review) => review.perfumeId === perfumeId);
}
