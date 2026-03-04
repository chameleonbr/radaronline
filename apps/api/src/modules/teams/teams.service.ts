import type { SessionUser } from '../../shared/auth/auth.types.js';
import type { TeamsRepository } from './teams.repository.js';
import type { CreateTeamMemberInput, SaveUserMunicipalityInput } from './teams.types.js';

export class TeamsService {
  constructor(private readonly repository: TeamsRepository) {}

  async listTeams(_actor: SessionUser, microregionId?: string) {
    return this.repository.listTeams(microregionId);
  }

  async getUserTeamStatus(_actor: SessionUser, email: string) {
    return this.repository.getUserTeamStatus(email);
  }

  async saveUserMunicipality(actor: SessionUser, input: SaveUserMunicipalityInput) {
    if (!['superadmin', 'admin'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    await this.repository.saveUserMunicipality(input);
  }

  async addTeamMember(actor: SessionUser, input: CreateTeamMemberInput) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    return this.repository.addTeamMember(input);
  }

  async removeTeamMember(actor: SessionUser, memberId: string) {
    if (!['superadmin', 'admin', 'gestor'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    await this.repository.removeTeamMember(memberId);
  }

  async listPendingRegistrations(actor: SessionUser) {
    if (!['superadmin', 'admin'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    return this.repository.listPendingRegistrations();
  }

  async deletePendingRegistration(actor: SessionUser, id: string) {
    if (!['superadmin', 'admin'].includes(actor.role)) {
      throw new Error('FORBIDDEN');
    }

    await this.repository.deletePendingRegistration(id);
  }
}
