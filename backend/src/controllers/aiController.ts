import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

export async function chatRecommendation(req: Request, res: Response) {
  const { userId, message } = req.body as { userId?: string; message?: string };
  if (!userId || !message) {
    return res.status(400).json({ message: 'userId y message son requeridos' });
  }

  const response = await aiService.chatRecommendation({ userId, message });
  return res.json(response);
}

export async function testRecommendation(req: Request, res: Response) {
  const { userId, answers } = req.body as {
    userId?: string;
    answers?: {
      timeOfDay?: 'dia' | 'noche' | 'ambos';
      season?: 'verano' | 'invierno' | 'todo_el_ano';
      style?: string[];
      intensity?: 'suave' | 'media' | 'fuerte';
      useCase?: 'oficina' | 'cita' | 'diario' | 'fiesta';
    };
  };

  if (!userId || !answers) {
    return res.status(400).json({ message: 'userId y answers son requeridos' });
  }
  if (!answers.timeOfDay || !answers.season || !answers.style || !answers.intensity || !answers.useCase) {
    return res.status(400).json({ message: 'answers incompletos' });
  }

  const response = await aiService.testRecommendation({
    userId,
    answers: {
      timeOfDay: answers.timeOfDay,
      season: answers.season,
      style: answers.style,
      intensity: answers.intensity,
      useCase: answers.useCase,
    },
  });
  return res.json(response);
}
