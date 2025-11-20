import { PreferenceLabel } from './domain';

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
};

export type UserPerfumeLists = {
  likes: string[];
  dislikes: string[];
  favorites: string[];
  wantToTry: string[];
  haveIt: string[];
};

export type UserPreferenceSummary = {
  tagPercentages: Record<string, number>;
  averageIntensity: string;
  preferredSeason: string;
};

export type UserPreferenceAction = {
  perfumeId: string;
  label: PreferenceLabel;
};
