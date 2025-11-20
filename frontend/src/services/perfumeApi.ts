import { apiGet, apiPost } from './api';
import { Perfume, Review } from '../types/domain';

export function fetchPerfumes(params?: { name?: string; brand?: string; tag?: string }) {
  return apiGet<Perfume[]>('perfumes', params);
}

export function fetchPerfumeDetail(id: string) {
  return apiGet<Perfume>(`perfumes/${id}`);
}

export function fetchPerfumeReviews(id: string) {
  return apiGet<Review[]>(`perfumes/${id}/reviews`);
}

export function postPerfumeReview(id: string, review: { userId: string; rating: number; comment: string }) {
  return apiPost<Review>(`perfumes/${id}/reviews`, review);
}
