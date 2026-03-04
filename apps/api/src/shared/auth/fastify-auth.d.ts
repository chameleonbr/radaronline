import 'fastify';

import type { AuthProvider } from './auth.provider.js';
import type { CurrentSession } from './auth.types.js';

declare module 'fastify' {
  interface FastifyInstance {
    authProvider: AuthProvider;
    authProviderSession: (request: FastifyRequest) => Promise<CurrentSession>;
  }
}
