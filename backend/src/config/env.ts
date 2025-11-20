// Basic configuration helper; later can read from process.env.
export function getConfig() {
  return {
    port: Number(process.env.PORT) || 3001,
  };
}
