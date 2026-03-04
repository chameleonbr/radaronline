import type { FastifyReply } from 'fastify';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
}

export function problem(
  reply: FastifyReply,
  status: number,
  title: string,
  detail?: string,
  type = 'https://radar.example.gov.br/errors/application'
) {
  const payload: ProblemDetails = {
    type,
    title,
    status,
    detail,
    traceId: String(reply.request.id),
  };

  return reply
    .code(status)
    .type('application/problem+json')
    .send(payload);
}
