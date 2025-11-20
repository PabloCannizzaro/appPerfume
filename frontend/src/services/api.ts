// Thin wrapper around fetch for API calls; replace with real backend base URL when ready.
import { Perfume } from '../types/domain';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function fetchPerfumes(): Promise<Perfume[]> {
  const response = await fetch(`${API_BASE_URL}/perfumes`);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los perfumes');
  }
  return response.json();
}

export async function fetchPerfumeById(id: string): Promise<Perfume> {
  const response = await fetch(`${API_BASE_URL}/perfumes/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el perfume');
  }
  return response.json();
}
