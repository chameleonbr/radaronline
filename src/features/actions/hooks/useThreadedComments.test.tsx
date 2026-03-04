import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ActionComment } from '../../../types';
import { useThreadedComments } from './useThreadedComments';

describe('useThreadedComments', () => {
  it('builds a threaded tree and keeps orphan replies as roots', () => {
    const comments: ActionComment[] = [
      {
        id: 'root-1',
        authorId: 'u1',
        authorName: 'Ana',
        authorMunicipio: 'Belo Horizonte',
        authorAvatarId: 'zg10',
        content: 'Comentario raiz',
        createdAt: '2025-01-01T10:00:00.000Z',
      },
      {
        id: 'reply-1',
        parentId: 'root-1',
        authorId: 'u2',
        authorName: 'Bruno',
        authorMunicipio: 'Uberlandia',
        authorAvatarId: 'zg10',
        content: 'Resposta',
        createdAt: '2025-01-01T11:00:00.000Z',
      },
      {
        id: 'orphan-1',
        parentId: 'missing-root',
        authorId: 'u3',
        authorName: 'Carla',
        authorMunicipio: 'Vicosa',
        authorAvatarId: 'zg10',
        content: 'Orfao',
        createdAt: '2025-01-01T12:00:00.000Z',
      },
    ];

    const { result } = renderHook(() => useThreadedComments(comments));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].id).toBe('root-1');
    expect(result.current[0].replies).toHaveLength(1);
    expect(result.current[0].replies?.[0].id).toBe('reply-1');
    expect(result.current[1].id).toBe('orphan-1');
    expect(result.current[1].replies).toEqual([]);
  });
});
