import { Perfume } from './domain';

export type AIChatRequest = {
  userId: string;
  message: string;
  context?: Record<string, unknown>;
};

export type AIChatResponse = {
  replyText: string;
  recommendations: Perfume[];
};

export type AITestAnswers = {
  timeOfDay?: 'dia' | 'noche' | 'ambos';
  season?: 'verano' | 'invierno' | 'primavera' | 'otono' | 'todo_el_ano';
  style?: string[];
  intensity?: 'suave' | 'media' | 'fuerte';
  useCase?: 'oficina' | 'cita' | 'diario' | 'fiesta';
};

export type AITestRequest = {
  userId: string;
  answers: AITestAnswers;
};

export type AITestResponse = {
  summaryText: string;
  recommendations: Perfume[];
};
