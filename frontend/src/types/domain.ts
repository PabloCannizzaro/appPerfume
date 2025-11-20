// Domain types shared across the app.
export type Perfume = {
  id: string;
  name: string;
  brand: string;
  family: string;
  notes: string[];
  launchYear?: number;
  externalLinks?: string[];
  tags?: string[];
  imageUrl?: string;
  summary?: string;
  ratingAverage?: number;
  concentration?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  longevity?: string;
  sillage?: string;
  usage?: string[];
  ratingCount?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Review = {
  id: string;
  perfumeId: string;
  userId: string;
  rating: number;
  comment?: string;
  userName?: string;
  date?: string;
};

export type PreferenceLabel = 'like' | 'dislike' | 'wishlist' | 'favorite' | 'owned' | 'to_test';

export type UserPreference = {
  userId: string;
  perfumeId: string;
  label: PreferenceLabel;
  createdAt: string;
};
