import { Request, Response } from 'express';
import { PreferenceAction } from '../models/domain';
import { perfumeService } from '../services/perfumeService';

const validActions: PreferenceAction[] = ['like', 'dislike', 'favorite', 'wantToTry', 'haveIt'];

export function getUserPreferences(req: Request, res: Response) {
  const { userId } = req.params;
  const prefs = perfumeService.getUserPreferences(userId);
  return res.json(prefs);
}

export function updateUserPreference(req: Request, res: Response) {
  const { userId } = req.params;
  const { perfumeId, action } = req.body as { perfumeId?: string; action?: PreferenceAction };

  if (!perfumeId || !action) {
    return res.status(400).json({ message: 'perfumeId y action son requeridos' });
  }
  if (!validActions.includes(action)) {
    return res.status(400).json({ message: 'action no es valida' });
  }

  const perfume = perfumeService.getPerfumeById(perfumeId);
  if (!perfume) {
    return res.status(404).json({ message: 'Perfume no encontrado' });
  }

  const updated = perfumeService.updateUserPreference(userId, perfumeId, action);
  return res.json(updated);
}
