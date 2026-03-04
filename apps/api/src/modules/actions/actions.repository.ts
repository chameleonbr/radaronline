import { randomUUID } from 'node:crypto';

import type { ActionRecord, CreateActionInput, UpdateActionInput } from './actions.types.js';

export interface ActionsRepository {
  list(microregionId?: string): Promise<ActionRecord[]>;
  getByUid(uid: string): Promise<ActionRecord | null>;
  create(input: CreateActionInput): Promise<ActionRecord>;
  update(uid: string, input: UpdateActionInput): Promise<ActionRecord | null>;
  delete(uid: string): Promise<boolean>;
}

const inMemoryActions = new Map<string, ActionRecord>([
  [
    'MR000::1.1.1',
    {
      dbId: 'seed-action-1',
      uid: 'MR000::1.1.1',
      actionId: '1.1.1',
      activityId: '1.1',
      microregionId: 'MR000',
      title: 'Acao inicial de migracao backend',
      status: 'Nao Iniciado',
      startDate: null,
      plannedEndDate: null,
      endDate: null,
      progress: 0,
      notes: '',
    },
  ],
]);

export class InMemoryActionsRepository implements ActionsRepository {
  async list(microregionId?: string): Promise<ActionRecord[]> {
    const items = Array.from(inMemoryActions.values());
    const filtered = microregionId && microregionId !== 'all'
      ? items.filter((item) => item.microregionId === microregionId)
      : items;
    return filtered.sort((a, b) => a.actionId.localeCompare(b.actionId));
  }

  async getByUid(uid: string): Promise<ActionRecord | null> {
    return inMemoryActions.get(uid) || null;
  }

  async create(input: CreateActionInput): Promise<ActionRecord> {
    const actionId = `${input.activityId}.${input.actionNumber}`;
    const uid = `${input.microregionId}::${actionId}`;
    const record: ActionRecord = {
      dbId: randomUUID(),
      uid,
      actionId,
      activityId: input.activityId,
      microregionId: input.microregionId,
      title: input.title,
      status: 'Nao Iniciado',
      startDate: null,
      plannedEndDate: null,
      endDate: null,
      progress: 0,
      notes: '',
    };

    inMemoryActions.set(uid, record);
    return record;
  }

  async update(uid: string, input: UpdateActionInput): Promise<ActionRecord | null> {
    const current = inMemoryActions.get(uid);
    if (!current) {
      return null;
    }

    const next: ActionRecord = {
      ...current,
      ...input,
    };

    inMemoryActions.set(uid, next);
    return next;
  }

  async delete(uid: string): Promise<boolean> {
    return inMemoryActions.delete(uid);
  }
}
