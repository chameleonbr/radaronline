import type { ProfileDTO, User } from '../../types/auth.types';

export type AuthProfileAuditSnapshot = Pick<
  ProfileDTO,
  'nome' | 'email' | 'role' | 'microregiao_id' | 'ativo' | 'lgpd_consentimento'
>;

export type AuthUserAuditChange = {
  field: string;
  from: unknown;
  to: unknown;
};

export function buildUserAuditChanges(
  originalData: AuthProfileAuditSnapshot | null,
  userUpdates: Partial<User>,
  updatedProfile: AuthProfileAuditSnapshot
): AuthUserAuditChange[] {
  if (!originalData) {
    return [];
  }

  const changes: AuthUserAuditChange[] = [];

  if (userUpdates.nome !== undefined && originalData.nome !== updatedProfile.nome) {
    changes.push({ field: 'nome', from: originalData.nome, to: updatedProfile.nome });
  }
  if (userUpdates.email !== undefined && originalData.email !== updatedProfile.email) {
    changes.push({ field: 'email', from: originalData.email, to: updatedProfile.email });
  }
  if (userUpdates.role !== undefined && originalData.role !== updatedProfile.role) {
    changes.push({ field: 'role', from: originalData.role, to: updatedProfile.role });
  }
  if (userUpdates.microregiaoId !== undefined && originalData.microregiao_id !== updatedProfile.microregiao_id) {
    changes.push({
      field: 'microregiao',
      from: originalData.microregiao_id,
      to: updatedProfile.microregiao_id,
    });
  }
  if (userUpdates.ativo !== undefined && originalData.ativo !== updatedProfile.ativo) {
    changes.push({ field: 'ativo', from: originalData.ativo, to: updatedProfile.ativo });
  }
  if (
    userUpdates.lgpdConsentimento !== undefined &&
    originalData.lgpd_consentimento !== updatedProfile.lgpd_consentimento
  ) {
    changes.push({
      field: 'lgpd',
      from: originalData.lgpd_consentimento,
      to: updatedProfile.lgpd_consentimento,
    });
  }

  return changes;
}
