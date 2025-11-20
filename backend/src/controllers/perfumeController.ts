import { Request, Response } from 'express';
import { perfumeService } from '../services/perfumeService';

export function listPerfumes(req: Request, res: Response) {
  const { name, brand, tag } = req.query as { name?: string; brand?: string; tag?: string };
  const perfumes = perfumeService.listPerfumes({ name, brand, tag });
  res.json(perfumes);
}

export function getPerfumeDetail(req: Request, res: Response) {
  const { id } = req.params;
  const perfume = perfumeService.getPerfumeById(id);
  if (!perfume) {
    return res.status(404).json({ message: 'Perfume no encontrado' });
  }
  return res.json(perfume);
}

export function getPerfumeReviews(req: Request, res: Response) {
  const { id } = req.params;
  const perfume = perfumeService.getPerfumeById(id);
  if (!perfume) {
    return res.status(404).json({ message: 'Perfume no encontrado' });
  }
  const reviews = perfumeService.getReviewsByPerfume(id);
  return res.json(reviews);
}

export function addPerfumeReview(req: Request, res: Response) {
  const { id } = req.params;
  const { userId, rating, comment } = req.body as { userId?: string; rating?: number; comment?: string };

  if (!userId || rating == null || comment == null) {
    return res.status(400).json({ message: 'userId, rating y comment son requeridos' });
  }

  const perfume = perfumeService.getPerfumeById(id);
  if (!perfume) {
    return res.status(404).json({ message: 'Perfume no encontrado' });
  }

  const newReview = perfumeService.addReview({ userId, perfumeId: id, rating, comment });
  return res.status(201).json(newReview);
}
