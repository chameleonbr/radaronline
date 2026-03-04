import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';

import { assertAuthenticated } from '../../shared/auth/authorization.js';
import { getRequestContext } from '../../shared/http/request-context.js';
import { problem } from '../../shared/http/problem.js';
import { createAuthProfileService } from './auth.factory.js';

const authProfileService = createAuthProfileService();

const completeFirstAccessSchema = z.object({
  userId: z.string().min(1),
  userEmail: z.email(),
  municipio: z.string().min(1),
  newPassword: z.string().min(6),
  microregionId: z.string().min(1),
});

function mapAuthProfileError(reply: FastifyReply, error: unknown) {
  const message = error instanceof Error ? error.message : 'UNKNOWN';
  switch (message) {
    case 'FORBIDDEN':
      return problem(reply, 403, 'Forbidden', 'User cannot complete this first access flow.');
    case 'PASSWORD_TOO_SHORT':
      return problem(reply, 400, 'Validation error', 'Password must contain at least 6 characters.');
    case 'MUNICIPALITY_REQUIRED':
      return problem(reply, 400, 'Validation error', 'Municipality is required.');
    default:
      return problem(reply, 500, 'Internal Server Error', 'Unexpected auth profile module failure.');
  }
}

export function registerAuthRoutes(app: FastifyInstance) {
  app.get('/v1/auth/session', async (request) => {
    const session = await app.authProviderSession(request);
    const context = getRequestContext(request);

    if (!session.authenticated) {
      return {
        authenticated: false,
        traceId: context.correlationId,
      };
    }

    return {
      authenticated: true,
      user: session.user,
      traceId: context.correlationId,
    };
  });

  app.get('/v1/auth/profile', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) {
      return reply;
    }

    try {
      const profile = await authProfileService.getCurrentProfile(actor);
      return profile;
    } catch (error) {
      return mapAuthProfileError(reply, error);
    }
  });

  app.post('/v1/auth/lgpd/accept', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) {
      return reply;
    }

    try {
      await authProfileService.acceptLgpd(actor);
      return reply.code(204).send();
    } catch (error) {
      return mapAuthProfileError(reply, error);
    }
  });

  app.post('/v1/auth/first-access/complete', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) {
      return reply;
    }

    const parsed = completeFirstAccessSchema.safeParse(request.body);
    if (!parsed.success) {
      return problem(reply, 400, 'Validation error', parsed.error.issues[0]?.message);
    }

    try {
      await authProfileService.completeFirstAccess(actor, parsed.data);
      return reply.code(204).send();
    } catch (error) {
      return mapAuthProfileError(reply, error);
    }
  });
}
