// Thin fetch wrapper for the backend API.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
};

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}/${path.replace(/^\\//, '')}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Error en la solicitud');
  }
  return res.json() as Promise<T>;
}

export async function get<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  const res = await fetch(url, { headers: options.headers });
  return handleResponse<T>(res);
}

export async function post<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export { BASE_URL };
