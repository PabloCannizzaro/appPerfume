import { Perfume } from './domain';

export type AIChatRequest = {
  userId: string;
  message: string;
};

export type AIChatResponse = {
  replyText: string;
  recommendations: Perfume[];
};

export type AITestRequest = {
  userId: string;
  answers: {
    timeOfDay: 'dia' | 'noche' | 'ambos';
    season: 'verano' | 'invierno' | 'todo_el_ano';
    style: string[];
    intensity: 'suave' | 'media' | 'fuerte';
    useCase: 'oficina' | 'cita' | 'diario' | 'fiesta';
  };
};

export type AITestResponse = {
  summaryText: string;
  recommendations: Perfume[];
};
