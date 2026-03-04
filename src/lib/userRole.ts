import type { UserRole } from '../types/auth.types';

export function getUserRoleLabel(role?: UserRole): string {
  if (!role) return 'Usuário';

  const labels: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrador',
    gestor: 'Gestor Regional',
    usuario: 'Usuário',
  };

  return labels[role];
}

export function canAccessTeamView(role?: UserRole): boolean {
  return role === 'admin' || role === 'superadmin' || role === 'gestor';
}
