import type { FastifyReply, FastifyInstance } from 'fastify';
import { z } from 'zod';

import { assertAuthenticated } from '../../shared/auth/authorization.js';
import { problem } from '../../shared/http/problem.js';
import { logTagsAdminEvent } from './tags.audit.js';
import { createTagsService } from './tags.factory.js';

const tagsService = createTagsService();

const createTagSchema = z.object({
  name: z.string().min(1),
});

const toggleFavoriteSchema = z.object({
  microregionId: z.string().min(1),
});

function mapTagsError(reply: FastifyReply, error: unknown) {
  const message = error instanceof Error ? error.message : 'UNKNOWN';
  switch (message) {
    case 'NOT_FOUND':
      return problem(reply, 404, 'Not found', 'Tag was not found.');
    default:
      return problem(reply, 500, 'Internal Server Error', 'Unexpected tags module failure.');
  }
}

export function registerTagsRoutes(app: FastifyInstance) {
  app.get('/v1/tags', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    try {
      const microregionId = (request.query as { microregionId?: string }).microregionId;
      return { items: await tagsService.listTags(actor, microregionId) };
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.post('/v1/tags', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    const parsed = createTagSchema.safeParse(request.body);
    if (!parsed.success) {
      return problem(reply, 400, 'Validation error', parsed.error.issues[0]?.message);
    }

    try {
      const item = await tagsService.createTag(actor, parsed.data.name);
      await logTagsAdminEvent({
        actor,
        actionType: 'tag_created',
        entityId: item.id,
        targetTag: { ...item, favoriteMicros: [] },
      });
      return reply.code(201).send(item);
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.delete('/v1/tags/:tagId', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    try {
      const tagId = (request.params as { tagId: string }).tagId;
      const item = await tagsService.deleteTag(actor, tagId);
      await logTagsAdminEvent({
        actor,
        actionType: 'tag_deleted',
        entityId: tagId,
        targetTag: item,
      });
      return reply.code(204).send();
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.post('/v1/tags/:tagId/toggle-favorite', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    const parsed = toggleFavoriteSchema.safeParse(request.body);
    if (!parsed.success) {
      return problem(reply, 400, 'Validation error', parsed.error.issues[0]?.message);
    }

    try {
      const tagId = (request.params as { tagId: string }).tagId;
      return await tagsService.toggleFavorite(actor, tagId, parsed.data.microregionId);
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.get('/v1/actions/:actionUid/tags', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    try {
      const { actionUid } = request.params as { actionUid: string };
      const microregionId = (request.query as { microregionId?: string }).microregionId;
      return { items: await tagsService.listActionTags(actor, actionUid, microregionId) };
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.put('/v1/actions/:actionUid/tags/:tagId', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    try {
      const { actionUid, tagId } = request.params as { actionUid: string; tagId: string };
      const item = await tagsService.assignToAction(actor, actionUid, tagId);
      await logTagsAdminEvent({
        actor,
        actionType: 'tag_assigned',
        entityId: tagId,
        targetTag: item,
        metadata: { action_uid: actionUid },
      });
      return reply.code(204).send();
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });

  app.delete('/v1/actions/:actionUid/tags/:tagId', async (request, reply) => {
    const actor = await assertAuthenticated(request, reply);
    if (!actor) return reply;

    try {
      const { actionUid, tagId } = request.params as { actionUid: string; tagId: string };
      await tagsService.removeFromAction(actor, actionUid, tagId);
      await logTagsAdminEvent({
        actor,
        actionType: 'tag_unassigned',
        entityId: tagId,
        metadata: { action_uid: actionUid },
      });
      return reply.code(204).send();
    } catch (error) {
      return mapTagsError(reply, error);
    }
  });
}
