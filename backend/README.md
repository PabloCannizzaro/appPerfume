// Quick reference of the backend folder layout.
# /backend
# |- server.ts        -> arranque del servidor HTTP y Express.
# |- tsconfig.json    -> configuracion TypeScript.
# |- /src
#    |- app.ts        -> instancia de Express y middlewares base.
#    |- routes        -> definiciones de endpoints versionados.
#    |- controllers   -> logica HTTP y validaciones simples.
#    |- services      -> reglas de negocio / acceso a datos.
#    |- models        -> tipos de dominio.
#    |- config        -> configuracion (ports, env vars).
#    |- utils         -> utilidades transversales (log).

## Ejecutar en desarrollo
- Instalar deps: `npm install`
- Levantar modo dev: `npm run dev`
