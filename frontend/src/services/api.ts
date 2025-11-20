// Thin fetch wrapper for the backend API.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params?: QueryParams): string {
  const isAbsolute = /^https?:\/\//i.test(path);
  const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(isAbsolute ? path : `${BASE_URL}/${cleanedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  options: { params?: QueryParams; body?: unknown } = {},
): Promise<T> {
  const url = buildUrl(path, options.params);
  const res = await fetch(url, {
    method,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Error ${res.status}`);
  }

  return (await res.json()) as T;
}

export function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  return request<T>('GET', path, { params });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, { body });
}

export const get = apiGet;
export const post = apiPost;
export { BASE_URL };
