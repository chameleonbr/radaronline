import type { SessionUser } from '../../shared/auth/auth.types.js';
import type { ActionsRepository } from './actions.repository.js';
import type { CreateActionInput, UpdateActionInput } from './actions.types.js';

export class ActionsService {
  constructor(private readonly repository: ActionsRepository) {}

  async listActions(microregionId?: string) {
    return this.repository.list(microregionId);
  }

  async getActionByUid(uid: string) {
    const current = await this.repository.getByUid(uid);
    if (!current) {
      throw new Error('NOT_FOUND');
    }

    return current;
  }

  async createAction(actor: SessionUser, input: Omit<CreateActionInput, 'createdBy'>) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    if (input.actionNumber <= 0) {
      throw new Error('INVALID_ACTION_NUMBER');
    }

    if (!input.activityId || !input.microregionId) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    return this.repository.create({
      ...input,
      createdBy: actor.id,
    });
  }

  async updateAction(actor: SessionUser, uid: string, input: UpdateActionInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    if (input.progress !== undefined && (input.progress < 0 || input.progress > 100)) {
      throw new Error('INVALID_PROGRESS');
    }

    const updated = await this.repository.update(uid, input);
    if (!updated) {
      throw new Error('NOT_FOUND');
    }

    return updated;
  }

  async deleteAction(actor: SessionUser, uid: string) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    const current = await this.repository.getByUid(uid);
    if (!current) {
      throw new Error('NOT_FOUND');
    }

    const deleted = await this.repository.delete(uid);
    if (!deleted) {
      throw new Error('NOT_FOUND');
    }

    return current;
  }
}
