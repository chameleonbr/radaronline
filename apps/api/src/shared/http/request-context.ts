import type { FastifyRequest } from 'fastify';

export interface RequestContext {
  correlationId: string;
}

export function getRequestContext(request: FastifyRequest): RequestContext {
  return {
    correlationId: String(request.id),
  };
}
