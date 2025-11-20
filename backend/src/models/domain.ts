// Domain models for the API. Stored in memory for now.

export type PreferenceAction = 'like' | 'dislike' | 'favorite' | 'wantToTry' | 'haveIt';
export type IntensityLevel = 'suave' | 'media' | 'fuerte' | 'bestia';

export interface PerfumeNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface UsageStats {
  day: number;
  night: number;
  summer: number;
  winter: number;
  office: number;
  date: number;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  year?: number;
  concentration: string;
  family: string;
  notes: PerfumeNotes;
  tags: string[];
  averageRating: number;
  averageLongevityHours: number;
  averageIntensity: IntensityLevel;
  usageStats: UsageStats;
  imageUrl?: string;
  buyLinks?: { label: string; url: string }[];
}

export interface UserPreferences {
  userId: string;
  likes: string[];
  dislikes: string[];
  favorites: string[];
  wantToTry: string[];
  haveIt: string[];
}

export interface UserReview {
  userId: string;
  perfumeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
