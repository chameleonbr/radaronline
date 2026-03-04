import { describe, expect, it } from 'vitest';

import {
  buildActivityLogMetadata,
  filterActivityLogs,
  normalizeActivityLogsWithoutUser,
  resolveCreatedByName,
} from './loggingService.helpers';
import type { ActivityLog } from '../../types/activity.types';

describe('loggingService.helpers', () => {
  it('resolve nome do autor priorizando metadata', () => {
    expect(resolveCreatedByName({ created_by_name: 'Ana' }, 'Sistema')).toBe('Ana');
    expect(resolveCreatedByName({}, 'Sistema')).toBe('Sistema');
  });

  it('monta metadata padrao do log', () => {
    expect(buildActivityLogMetadata({ scope: 'admin' }, 'user-1', 'Ana')).toEqual({
      scope: 'admin',
      created_by_name: 'Ana',
      created_by_id: 'user-1',
    });
  });

  it('normaliza logs sem user e filtra por microrregiao', () => {
    const logs: ActivityLog[] = [
      {
        id: '1',
        user_id: 'user-1',
        action_type: 'login',
        entity_type: 'auth',
        created_at: '2026-03-01T00:00:00Z',
        metadata: {},
        user: {
          nome: 'Ana',
          role: 'admin',
          microregiao_id: 'micro-1',
        },
      },
      {
        id: '2',
        user_id: 'user-2',
        action_type: 'action_created',
        entity_type: 'action',
        created_at: '2026-03-01T00:00:00Z',
        metadata: {
          target_user_microregiao: 'micro-2',
        },
      },
    ];

    expect(normalizeActivityLogsWithoutUser([logs[0]])[0].user).toBeUndefined();
    expect(filterActivityLogs(logs, { microregiaoId: 'micro-2' }).map((log) => log.id)).toEqual([
      '2',
    ]);
  });
});
