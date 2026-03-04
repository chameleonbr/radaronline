import { randomUUID } from 'node:crypto';

import type { ActionCommentRecord, CreateCommentInput } from './comments.types.js';

export interface CommentsRepository {
  listByActionUid(actionUid: string): Promise<ActionCommentRecord[]>;
  getById(commentId: string): Promise<ActionCommentRecord | null>;
  create(input: CreateCommentInput): Promise<ActionCommentRecord>;
  update(commentId: string, content: string): Promise<boolean>;
  deleteChildren(commentId: string): Promise<void>;
  delete(commentId: string): Promise<boolean>;
}

const seedTime = new Date().toISOString();
const inMemoryComments = new Map<string, ActionCommentRecord>([
  [
    'seed-comment-1',
    {
      id: 'seed-comment-1',
      actionUid: 'seed-micro::1.1.1',
      parentId: null,
      authorId: 'seed-admin',
      authorName: 'Administrador',
      authorMunicipio: 'Belo Horizonte',
      authorAvatarId: 'zg10',
      authorRole: 'admin',
      content: 'Primeiro comentario do backend.',
      createdAt: seedTime,
    },
  ],
]);

export class InMemoryCommentsRepository implements CommentsRepository {
  async listByActionUid(actionUid: string): Promise<ActionCommentRecord[]> {
    return Array.from(inMemoryComments.values())
      .filter((item) => item.actionUid === actionUid)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getById(commentId: string): Promise<ActionCommentRecord | null> {
    return inMemoryComments.get(commentId) || null;
  }

  async create(input: CreateCommentInput): Promise<ActionCommentRecord> {
    const record: ActionCommentRecord = {
      id: randomUUID(),
      actionUid: input.actionUid,
      parentId: input.parentId || null,
      authorId: input.authorId,
      authorName: 'Usuario',
      authorMunicipio: '',
      authorAvatarId: 'zg10',
      content: input.content.trim(),
      createdAt: new Date().toISOString(),
    };

    inMemoryComments.set(record.id, record);
    return record;
  }

  async update(commentId: string, content: string): Promise<boolean> {
    const current = inMemoryComments.get(commentId);
    if (!current) return false;
    inMemoryComments.set(commentId, { ...current, content });
    return true;
  }

  async deleteChildren(commentId: string): Promise<void> {
    Array.from(inMemoryComments.values())
      .filter((item) => item.parentId === commentId)
      .forEach((item) => {
        inMemoryComments.delete(item.id);
      });
  }

  async delete(commentId: string): Promise<boolean> {
    return inMemoryComments.delete(commentId);
  }
}
