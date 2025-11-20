// Entry point: only boots the Express app (no package.json parsing here).
import http from "http";
import app from "./src/app";

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Backend API escuchando en http://localhost:${PORT}`);
});
