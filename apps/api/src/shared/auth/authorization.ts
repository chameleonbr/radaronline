import type { FastifyReply, FastifyRequest } from 'fastify';

import { problem } from '../http/problem.js';
import type { CurrentSession, SessionUser, UserRole } from './auth.types.js';

export function assertAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<SessionUser | null> {
  return request.server.authProviderSession(request).then((session: CurrentSession) => {
    if (!session.authenticated) {
      void problem(reply, 401, 'Unauthorized', 'Authentication is required.');
      return null;
    }

    return session.user;
  });
}

export function assertRole(
  request: FastifyRequest,
  reply: FastifyReply,
  allowedRoles: UserRole[]
): Promise<SessionUser | null> {
  return assertAuthenticated(request, reply).then((user) => {
    if (!user) {
      return null;
    }

    if (!allowedRoles.includes(user.role)) {
      void problem(reply, 403, 'Forbidden', 'User does not have the required role.');
      return null;
    }

    return user;
  });
}
