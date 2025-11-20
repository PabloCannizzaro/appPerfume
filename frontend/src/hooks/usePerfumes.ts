import { useEffect, useState } from 'react';
import { Perfume } from '../types/domain';
import { fetchPerfumes } from '../services/perfumeApi';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function usePerfumes(params?: { name?: string; brand?: string; tag?: string }) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError(null);
    fetchPerfumes(params)
      .then((data) => {
        if (!active) return;
        setPerfumes(data);
        setStatus('success');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Error al cargar perfumes');
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [params?.name, params?.brand, params?.tag, reloadToken]);

  return { perfumes, status, error, reload: () => setReloadToken((c) => c + 1) };
}
