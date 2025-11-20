// Runtime entrypoint; builds and boots the Express HTTP server.
import http from 'http';
import app from './src/app';
import { getConfig } from './src/config/env';
import { logger } from './src/utils/logger';

const { port } = getConfig();
const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`API escuchando en puerto ${port}`);
});
