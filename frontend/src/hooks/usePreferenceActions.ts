// Minimal preference manager for local experiments; swap to global state later.
import { useCallback, useState } from 'react';
import { PreferenceLabel, UserPreference } from '../types/domain';

export function usePreferenceActions(userId: string) {
  const [preferences, setPreferences] = useState<UserPreference[]>([]);

  const togglePreference = useCallback(
    (perfumeId: string, label: PreferenceLabel) => {
      setPreferences((prev) => {
        const exists = prev.find((pref) => pref.perfumeId === perfumeId && pref.label === label);
        if (exists) {
          return prev.filter((pref) => !(pref.perfumeId === perfumeId && pref.label === label));
        }
        const next: UserPreference = {
          userId,
          perfumeId,
          label,
          createdAt: new Date().toISOString(),
        };
        return [...prev, next];
      });
    },
    [userId],
  );

  return { preferences, togglePreference };
}
