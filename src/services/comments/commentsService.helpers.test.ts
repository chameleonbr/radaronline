import { describe, expect, it } from 'vitest';

import {
  buildInsertedCommentModel,
  extractMentionedNames,
  filterMentionTargets,
  mapActionCommentDTO,
} from './commentsService.helpers';
import type {
  ActionCommentDTO,
  CommentAuthorProfile,
  InsertedCommentRow,
} from './commentsService.types';

describe('commentsService.helpers', () => {
  it('mapeia comentario do banco para dominio', () => {
    const dto: ActionCommentDTO = {
      id: 'comment-1',
      action_id: 'action-1',
      author_id: 'user-1',
      parent_id: null,
      content: 'Teste',
      created_at: '2026-03-01T00:00:00Z',
      author: {
        nome: 'Ana',
        microregiao_id: 'micro-1',
        avatar_id: 'a1',
        role: 'Gestora',
        municipio: 'Belo Horizonte',
      },
    };

    expect(mapActionCommentDTO(dto)).toMatchObject({
      id: 'comment-1',
      authorName: 'Ana',
      authorMunicipio: 'Belo Horizonte',
      authorAvatarId: 'a1',
      authorRole: 'Gestora',
    });
  });

  it('monta comentario inserido usando perfil do autor', () => {
    const row: InsertedCommentRow = {
      id: 'comment-2',
      parent_id: 'comment-1',
      content: 'Resposta',
      created_at: '2026-03-01T00:00:00Z',
    };

    const profile: CommentAuthorProfile = {
      nome: 'Bruno',
      microregiao_id: 'micro-2',
      avatar_id: null,
      role: null,
      municipio: null,
    };

    expect(buildInsertedCommentModel(row, 'user-2', profile)).toEqual({
      id: 'comment-2',
      parentId: 'comment-1',
      authorId: 'user-2',
      authorName: 'Bruno',
      authorMunicipio: 'micro-2',
      authorAvatarId: 'zg10',
      authorRole: undefined,
      content: 'Resposta',
      createdAt: '2026-03-01T00:00:00Z',
      replies: [],
    });
  });

  it('extrai mencoes unicas e remove auto-mencao', () => {
    const mentionedNames = extractMentionedNames('@Ana olhe isso @Bruno e @Ana de novo');

    expect(mentionedNames).toEqual(['Ana', 'Bruno']);
    expect(filterMentionTargets(mentionedNames, 'ana')).toEqual(['Bruno']);
  });

  it('mantem nome composto quando a segunda palavra parece nome', () => {
    expect(extractMentionedNames('@Maria Clara revisar isso')).toEqual(['Maria Clara']);
  });
});
