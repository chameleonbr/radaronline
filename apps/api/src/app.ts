import cors from '@fastify/cors';
import Fastify from 'fastify';

import { loadConfig } from './config/env.js';
import { registerActionRoutes } from './modules/actions/actions.routes.js';
import { registerAnnouncementsRoutes } from './modules/announcements/announcements.routes.js';
import { registerAuthRoutes } from './modules/auth/auth.routes.js';
import { registerCommentsRoutes } from './modules/comments/comments.routes.js';
import { registerHealthRoutes } from './modules/health/health.routes.js';
import { registerObjectivesActivitiesRoutes } from './modules/objectivesActivities/objectivesActivities.routes.js';
import { registerRequestsRoutes } from './modules/requests/requests.routes.js';
import { registerTagsRoutes } from './modules/tags/tags.routes.js';
import { registerTeamsRoutes } from './modules/teams/teams.routes.js';
import { registerUsersRoutes } from './modules/users/users.routes.js';
import { createAuthProvider } from './shared/auth/auth-provider.factory.js';

export function buildApp() {
  const config = loadConfig();
  const app = Fastify({
    logger: {
      level: config.env === 'production' ? 'info' : 'debug',
    },
    requestIdHeader: 'x-correlation-id',
    requestIdLogLabel: 'correlationId',
  });

  app.decorate('authProvider', createAuthProvider(config));
  app.decorate('authProviderSession', function authProviderSession(request) {
    return this.authProvider.getCurrentSession(request);
  });

  void app.register(cors, {
    origin: true,
    credentials: true,
  });

  void registerHealthRoutes(app);
  void registerObjectivesActivitiesRoutes(app);
  void registerAuthRoutes(app);
  void registerActionRoutes(app);
  void registerAnnouncementsRoutes(app);
  void registerCommentsRoutes(app);
  void registerRequestsRoutes(app);
  void registerTagsRoutes(app);
  void registerTeamsRoutes(app);
  void registerUsersRoutes(app);

  return app;
}
