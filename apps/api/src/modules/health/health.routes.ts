import type { FastifyInstance } from 'fastify';

export function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'radar-api',
    timestamp: new Date().toISOString(),
  }));

  app.get('/ready', async () => ({
    status: 'ready',
    dependencies: {
      database: 'planned',
      identity: 'development-provider',
      messaging: 'planned',
    },
  }));
}
