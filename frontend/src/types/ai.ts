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
  season?: 'verano' | 'invierno' | 'primavera' | 'otono' | 'todo-ano';
  scentStyle?: 'fresco' | 'citrico' | 'dulce' | 'amaderado' | 'acuatico';
  intensity?: 'suave' | 'media' | 'fuerte';
  usage?: 'oficina' | 'cita' | 'diario' | 'fiesta';
};

export type AITestRequest = {
  userId: string;
  answers: AITestAnswers;
};

export type AITestResponse = {
  summaryText: string;
  recommendations: Perfume[];
};
