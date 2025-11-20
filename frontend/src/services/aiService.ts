import { post } from './api';
import { AIChatRequest, AIChatResponse, AITestRequest, AITestResponse } from '../types/ai';

export async function sendChatMessage(request: AIChatRequest): Promise<AIChatResponse> {
  try {
    return await post<AIChatResponse>('ai/chat', request);
  } catch {
    return { replyText: 'No se pudo contactar con el servidor, intenta de nuevo.', recommendations: [] };
  }
}

export async function sendTestAnswers(request: AITestRequest): Promise<AITestResponse> {
  try {
    return await post<AITestResponse>('ai/test', request);
  } catch {
    return { summaryText: 'No se pudo contactar con el servidor, intenta de nuevo.', recommendations: [] };
  }
}
