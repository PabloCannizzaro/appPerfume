// DEPRECATED: solo para uso offline; la app usa la API real cuando esta disponible.
import { UserPerfumeLists, UserProfile } from '../types/user';

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Alex Perfumer',
  avatarUrl: '',
  bio: 'Amante de fragancias frescas y amaderadas.',
};

export const mockUserPerfumeLists: UserPerfumeLists = {
  likes: ['p1', 'p3', 'p4'],
  dislikes: ['p2'],
  favorites: ['p1', 'p4'],
  wantToTry: ['p2', 'p5'],
  haveIt: ['p3'],
};
