// Rule-based AI placeholder for perfume recommendations.
// This service scores perfumes using simple keyword/tag matching so it can be replaced by a real model later.
import { AITestRequest, AITestResponse, AIChatRequest, AIChatResponse } from '../models/ai';
import { Perfume } from '../models/domain';
import { perfumeService } from './perfumeService';

const allowedKeywords = [
  'perfume',
  'fragancia',
  'fresco',
  'citrico',
  'acuatico',
  'dulce',
  'amaderado',
  'verano',
  'invierno',
  'dia',
  'noche',
  'suave',
  'media',
  'fuerte',
  'intenso',
];

type KeywordMatch = {
  styles: string[];
  seasons: string[];
  times: string[];
  intensity?: 'suave' | 'media' | 'fuerte';
};

function normalize(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function extractKeywords(message: string): KeywordMatch {
  const value = normalize(message);
  const styles = ['fresco', 'citrico', 'acuatico', 'dulce', 'amaderado'].filter((k) => value.includes(k));
  const seasons = ['verano', 'invierno'].filter((k) => value.includes(k));
  const times = ['dia', 'noche'].filter((k) => value.includes(k));
  const intensity = value.includes('suave') ? 'suave' : value.includes('fuerte') || value.includes('intenso') ? 'fuerte' : value.includes('media') ? 'media' : undefined;
  return { styles, seasons, times, intensity };
}

function isPerfumeContext(message: string) {
  const val = normalize(message);
  return allowedKeywords.some((k) => val.includes(k));
}

function scorePerfume(perfume: Perfume, match: KeywordMatch, likedTags: string[] = [], dislikedIds: string[] = []) {
  let score = perfume.averageRating;

  if (dislikedIds.includes(perfume.id)) score -= 2;
  match.styles.forEach((tag) => {
    if (perfume.tags.includes(tag)) score += 1.2;
    if (normalize(perfume.family).includes(tag)) score += 0.6;
  });
  match.seasons.forEach((tag) => {
    if (perfume.tags.includes(tag)) score += 0.5;
    score += perfume.usageStats[tag === 'verano' ? 'summer' : 'winter'] / 200; // small bump
  });
  match.times.forEach((tag) => {
    if (perfume.tags.includes(tag)) score += 0.5;
    score += perfume.usageStats[tag === 'dia' ? 'day' : 'night'] / 200;
  });
  if (match.intensity && perfume.averageIntensity === match.intensity) {
    score += 0.8;
  }
  likedTags.forEach((tag) => {
    if (perfume.tags.includes(tag)) score += 0.2;
  });

  return score;
}

function pickTop(perfumes: Perfume[], match: KeywordMatch, likedTags: string[], dislikedIds: string[], limit = 3) {
  return perfumes
    .map((perfume) => ({ perfume, score: scorePerfume(perfume, match, likedTags, dislikedIds) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.perfume);
}

export const aiService = {
  async chatRecommendation(request: AIChatRequest): Promise<AIChatResponse> {
    if (!isPerfumeContext(request.message)) {
      return { replyText: 'Solo puedo ayudarte con perfumes y recomendaciones relacionadas :)', recommendations: [] };
    }

    const match = extractKeywords(request.message);
    const perfumes = perfumeService.getAll();

    const recs = pickTop(perfumes, match, [], [], 3);
    const descriptors = [...match.styles, ...match.seasons, ...match.times].join(', ') || 'tu descripcion';
    const replyText =
      recs.length === 0
        ? 'No encontre algo claro, pero puedo sugerir opciones si me das mas detalles.'
        : `Te podrian gustar ${recs.map((p) => p.name).join(' y ')} porque encajan con ${descriptors}.`;

    return { replyText, recommendations: recs };
  },

  async testRecommendation(request: AITestRequest): Promise<AITestResponse> {
    const { answers, userId } = request;
    const perfumes = perfumeService.getAll();
    const prefs = perfumeService.getUserPreferences(userId);

    const likedTags = perfumes
      .filter((p) => prefs.likes.includes(p.id) || prefs.favorites.includes(p.id))
      .flatMap((p) => p.tags);
    const disliked = prefs.dislikes;

    const match: KeywordMatch = {
      styles: answers.style.map(normalize),
      seasons: answers.season === 'todo_el_ano' ? [] : [answers.season],
      times: answers.timeOfDay === 'ambos' ? [] : [answers.timeOfDay],
      intensity: answers.intensity,
    };

    const recs = pickTop(perfumes, match, likedTags, disliked, 3);
    const summaryText =
      recs.length === 0
        ? 'No encontre coincidencias directas; intenta con otros estilos.'
        : `Elegidos por ${answers.style.join('/')} para ${answers.timeOfDay}, ${answers.season}, uso ${answers.useCase} e intensidad ${answers.intensity}.`;

    return { summaryText, recommendations: recs };
  },
};
