import type { FastifyRequest } from 'fastify';

import type { AuthProvider } from './auth.provider.js';
import type { CurrentSession, UserRole } from './auth.types.js';

function parseRole(value: string | undefined): UserRole {
  if (value === 'superadmin' || value === 'admin' || value === 'gestor') {
    return value;
  }

  return 'usuario';
}

export class DevHeaderAuthProvider implements AuthProvider {
  async getCurrentSession(request: FastifyRequest): Promise<CurrentSession> {
    const userId = request.headers['x-dev-user-id'];
    const email = request.headers['x-dev-user-email'];
    const role = request.headers['x-dev-user-role'];
    const name = request.headers['x-dev-user-name'];

    if (
      typeof userId !== 'string' ||
      typeof email !== 'string' ||
      typeof name !== 'string'
    ) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: {
        id: userId,
        email,
        name,
        role: parseRole(typeof role === 'string' ? role : undefined),
      },
    };
  }
}
