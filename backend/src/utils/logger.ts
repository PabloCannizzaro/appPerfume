// Lightweight logger wrapper to keep a single logging surface.
export const logger = {
  info: (message: string) => console.log(message),
  error: (message: string, err?: unknown) => console.error(message, err),
};
