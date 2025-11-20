import { useEffect, useState, useCallback } from 'react';
import { get, post } from '../services/api';
import { PreferenceLabel, UserPreference } from '../types/domain';
import { UserPerfumeLists } from '../types/user';

// Maps frontend labels to backend actions
const actionMap: Record<PreferenceLabel, 'like' | 'dislike' | 'favorite' | 'wantToTry' | 'haveIt'> = {
  like: 'like',
  dislike: 'dislike',
  favorite: 'favorite',
  wishlist: 'wantToTry',
  owned: 'haveIt',
  to_test: 'wantToTry',
};

export function usePreferenceActions(userId: string) {
  const [preferences, setPreferences] = useState<UserPerfumeLists | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(() => {
    setLoading(true);
    setError(null);
    get<UserPerfumeLists>(`users/${userId}/preferences`)
      .then((data) => setPreferences(data))
      .catch((err) => setError(err.message || 'No se pudieron cargar las preferencias'))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const performAction = useCallback(
    async (perfumeId: string, label: PreferenceLabel) => {
      const action = actionMap[label];
      if (!action) return;
      try {
        setLoading(true);
        const updated = await post<UserPerfumeLists>(`users/${userId}/preferences`, { perfumeId, action });
        setPreferences(updated);
      } catch (err: any) {
        setError(err.message || 'No se pudo actualizar la preferencia');
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  return { preferences, loading, error, performAction, refresh: fetchPreferences };
}
