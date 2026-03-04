import { randomUUID } from 'node:crypto';

import type { CreateTagInput, TagRecord } from './tags.types.js';

export interface TagsRepository {
  list(): Promise<TagRecord[]>;
  getById(tagId: string): Promise<TagRecord | null>;
  create(input: CreateTagInput): Promise<TagRecord>;
  delete(tagId: string): Promise<boolean>;
  updateFavoriteMicros(tagId: string, favoriteMicros: string[]): Promise<boolean>;
  listActionTags(actionUid: string): Promise<TagRecord[]>;
  assignToAction(actionUid: string, tagId: string): Promise<void>;
  removeFromAction(actionUid: string, tagId: string): Promise<void>;
}

const inMemoryTags = new Map<string, TagRecord>([
  ['seed-tag-1', { id: 'seed-tag-1', name: 'GESTAO', color: 'hsl(200, 70%, 45%)', favoriteMicros: ['all'] }],
]);
const inMemoryAssignments = new Map<string, Set<string>>([['seed-micro::1.1.1', new Set(['seed-tag-1'])]]);

export class InMemoryTagsRepository implements TagsRepository {
  async list(): Promise<TagRecord[]> {
    return Array.from(inMemoryTags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(tagId: string): Promise<TagRecord | null> {
    return inMemoryTags.get(tagId) || null;
  }

  async create(input: CreateTagInput): Promise<TagRecord> {
    const record: TagRecord = {
      id: randomUUID(),
      name: input.name.toUpperCase(),
      color: `hsl(${Math.abs(input.name.length * 37) % 360}, 70%, 45%)`,
      favoriteMicros: [],
    };
    inMemoryTags.set(record.id, record);
    return record;
  }

  async delete(tagId: string): Promise<boolean> {
    Array.from(inMemoryAssignments.entries()).forEach(([actionUid, assigned]) => {
      if (assigned.has(tagId)) {
        assigned.delete(tagId);
        inMemoryAssignments.set(actionUid, assigned);
      }
    });
    return inMemoryTags.delete(tagId);
  }

  async updateFavoriteMicros(tagId: string, favoriteMicros: string[]): Promise<boolean> {
    const current = inMemoryTags.get(tagId);
    if (!current) return false;
    inMemoryTags.set(tagId, { ...current, favoriteMicros });
    return true;
  }

  async listActionTags(actionUid: string): Promise<TagRecord[]> {
    const tagIds = inMemoryAssignments.get(actionUid) || new Set<string>();
    return Array.from(tagIds)
      .map((tagId) => inMemoryTags.get(tagId))
      .filter((item): item is TagRecord => Boolean(item));
  }

  async assignToAction(actionUid: string, tagId: string): Promise<void> {
    const current = inMemoryAssignments.get(actionUid) || new Set<string>();
    current.add(tagId);
    inMemoryAssignments.set(actionUid, current);
  }

  async removeFromAction(actionUid: string, tagId: string): Promise<void> {
    const current = inMemoryAssignments.get(actionUid);
    if (!current) return;
    current.delete(tagId);
    inMemoryAssignments.set(actionUid, current);
  }
}
