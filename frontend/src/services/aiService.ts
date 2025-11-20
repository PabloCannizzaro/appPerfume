// AI service contract; currently mocked. Replace with backend calls.
import { mockPerfumes } from '../data/mockPerfumes';
import { AIChatRequest, AIChatResponse, AITestRequest, AITestResponse } from '../types/ai';
import { Perfume } from '../types/domain';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function pickPerfumesByTag(tag?: string, count = 3): Perfume[] {
  if (!tag) return mockPerfumes.slice(0, count);
  const filtered = mockPerfumes.filter((p) => (p.tags ?? []).includes(tag));
  if (filtered.length === 0) return mockPerfumes.slice(0, count);
  return filtered.slice(0, count);
}

export async function sendChatMessage(request: AIChatRequest): Promise<AIChatResponse> {
  // TODO: Replace with backend call: POST /ai/chat with { userId, message, context }
  await delay(600);
  const tagHint = (request.message || '').toLowerCase();
  const tag = ['fresco', 'citrico', 'dulce', 'amaderado', 'acuatico'].find((t) => tagHint.includes(t));
  const recommendations = pickPerfumesByTag(tag);
  return {
    replyText:
      tag != null
        ? `Te propongo algo ${tag}. Aqui van ${recommendations.length} opciones que matchean tu busqueda.`
        : 'Te dejo algunas opciones variadas segun lo que comentaste.',
    recommendations,
  };
}

export async function sendTestAnswers(request: AITestRequest): Promise<AITestResponse> {
  // TODO: Replace with backend call: POST /ai/test con { userId, answers }
  await delay(800);
  const { answers } = request;
  const recommendations = pickPerfumesByTag(answers.scentStyle);
  const summaryText = `Recomendaciones basadas en: momento ${answers.timeOfDay ?? 'dia/noche'}, estacion ${
    answers.season ?? 'cualquiera'
  }, estilo ${answers.scentStyle ?? 'variado'}, intensidad ${answers.intensity ?? 'media'}.`;
  return { summaryText, recommendations };
}
