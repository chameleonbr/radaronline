import type { FastifyRequest } from 'fastify';

import type { CurrentSession } from './auth.types.js';

export interface AuthProvider {
  getCurrentSession(request: FastifyRequest): Promise<CurrentSession>;
}
