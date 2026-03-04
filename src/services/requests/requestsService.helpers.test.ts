import { describe, expect, it } from 'vitest';

import {
  buildCreateRequestBatchPayload,
  buildCreateRequestPayload,
  buildUpdateRequestPayload,
  getUniqueRequestUserIds,
  mergeRequestsWithProfiles,
} from './requestsService.helpers';

describe('requestsService.helpers', () => {
  it('deduplicates request user ids', () => {
    expect(
      getUniqueRequestUserIds([
        {
          id: '1',
          user_id: 'u1',
          request_type: 'support',
          content: 'a',
          status: 'pending',
          admin_notes: null,
          created_at: '2026-03-01',
        },
        {
          id: '2',
          user_id: 'u1',
          request_type: 'feedback',
          content: 'b',
          status: 'pending',
          admin_notes: null,
          created_at: '2026-03-01',
        },
        {
          id: '3',
          user_id: 'u2',
          request_type: 'support',
          content: 'c',
          status: 'pending',
          admin_notes: null,
          created_at: '2026-03-01',
        },
      ])
    ).toEqual(['u1', 'u2']);
  });

  it('merges request profile details', () => {
    expect(
      mergeRequestsWithProfiles(
        [
          {
            id: '1',
            user_id: 'u1',
            request_type: 'support',
            content: 'a',
            status: 'pending',
            admin_notes: null,
            created_at: '2026-03-01',
          },
        ],
        new Map([
          [
            'u1',
            {
              id: 'u1',
              nome: 'Maria',
              email: 'maria@example.com',
              role: 'admin',
              cargo: 'Gestora',
              municipio: 'Belo Horizonte',
              microregiao_id: 'MR1',
            },
          ],
        ])
      )
    ).toEqual([
      {
        id: '1',
        user_id: 'u1',
        request_type: 'support',
        content: 'a',
        status: 'pending',
        admin_notes: null,
        created_at: '2026-03-01',
        user: {
          nome: 'Maria',
          email: 'maria@example.com',
          role: 'admin',
          cargo: 'Gestora',
          municipio: 'Belo Horizonte',
          microregiao_id: 'MR1',
        },
      },
    ]);
  });

  it('builds request update payload correctly', () => {
    expect(
      buildUpdateRequestPayload('resolved', 'ok', 'admin-1', '2026-03-01T12:00:00.000Z')
    ).toEqual({
      status: 'resolved',
      updated_at: '2026-03-01T12:00:00.000Z',
      resolved_by: 'admin-1',
      resolved_at: '2026-03-01T12:00:00.000Z',
      admin_notes: 'ok',
    });
  });

  it('builds single and batch create payloads trimming content', () => {
    expect(buildCreateRequestPayload('u1', 'support', '  ajuda  ')).toEqual({
      user_id: 'u1',
      request_type: 'support',
      content: 'ajuda',
      status: 'pending',
    });

    expect(
      buildCreateRequestBatchPayload([
        {
          userId: 'u1',
          requestType: 'support',
          content: '  ajuda  ',
        },
      ])
    ).toEqual([
      {
        user_id: 'u1',
        request_type: 'support',
        content: 'ajuda',
        status: 'pending',
        admin_notes: null,
      },
    ]);
  });
});
