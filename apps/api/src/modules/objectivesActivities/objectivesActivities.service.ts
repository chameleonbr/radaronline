import type { SessionUser } from '../../shared/auth/auth.types.js';
import type { ObjectivesActivitiesRepository } from './objectivesActivities.repository.js';
import type {
  CreateActivityInput,
  CreateObjectiveInput,
  UpdateActivityInput,
  UpdateObjectiveInput,
} from './objectivesActivities.types.js';

export class ObjectivesActivitiesService {
  constructor(private readonly repository: ObjectivesActivitiesRepository) {}

  async listObjectives(_actor: SessionUser, microregionId?: string) {
    return this.repository.listObjectives(microregionId);
  }

  async listActivities(_actor: SessionUser, microregionId?: string) {
    return this.repository.listActivities(microregionId);
  }

  async createObjective(actor: SessionUser, input: CreateObjectiveInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    return this.repository.createObjective(input);
  }

  async updateObjective(actor: SessionUser, id: number, updates: UpdateObjectiveInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    await this.repository.updateObjective(id, updates);
  }

  async deleteObjective(actor: SessionUser, id: number) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    await this.repository.deleteObjective(id);
  }

  async createActivity(actor: SessionUser, input: CreateActivityInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    return this.repository.createActivity(input);
  }

  async updateActivity(actor: SessionUser, id: string, updates: UpdateActivityInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    await this.repository.updateActivity(id, updates);
  }

  async deleteActivity(actor: SessionUser, id: string) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    await this.repository.deleteActivity(id);
  }

  async updateActionActivityId(actor: SessionUser, uid: string, newActivityId: string) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }
    await this.repository.updateActionActivityId(uid, newActivityId);
  }
}
