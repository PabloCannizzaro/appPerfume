// Root README for monorepo layout.
# appPerfume

- frontend: app movil con Expo + React Native + TypeScript.
- backend: API con Node.js + Express + TypeScript.

## Desarrollo
- Levanta el backend: `cd backend && npm install && npm run dev` (default http://localhost:3001).
- Levanta el frontend: `cd frontend && npm install && npm start`.
- Configura la variable `EXPO_PUBLIC_API_URL` si usas otro host/puerto, por ejemplo para dispositivo en red local:
  - `EXPO_PUBLIC_API_URL="http://192.168.X.X:3001/api"`
