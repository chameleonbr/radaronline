import { User, RaciPermission } from '../types/auth.types';
import { Action, RaciRole } from '../types';

// =====================================
// MAPEAMENTO DE PERMISSÕES RACI
// =====================================

export const RACI_PERMISSIONS: Record<RaciRole, RaciPermission> = {
  'R': { // Responsible - Quem executa
    visualizar: true,
    editar: true,
    criar: true,
    excluir: false,
  },
  'A': { // Accountable - Quem aprova
    visualizar: true,
    editar: true,
    criar: true,
    excluir: true,
  },
  'I': { // Informed - Informado
    visualizar: true,
    editar: false,
    criar: false,
    excluir: false,
  },
};

// =====================================
// FUNÇÕES DE VERIFICAÇÃO DE PERMISSÃO
// =====================================

/**
 * Obtém o papel RACI do usuário em uma ação específica
 */
export function getUserRaciRole(user: User, action: Action): RaciRole | null {
  const raciEntry = action.raci.find(r => r.name === user.nome);
  return raciEntry?.role || null;
}

/**
 * Verifica se usuário pode VISUALIZAR uma ação
 */
export function canViewAction(user: User, _action: Action, actionMicroregiaoId?: string): boolean {
  // Admin pode ver tudo
  if (user.role === 'admin') return true;

  // Verifica se está na mesma microrregião
  if (actionMicroregiaoId && actionMicroregiaoId !== user.microregiaoId) {
    return false;
  }

  // Qualquer pessoa da mesma microrregião pode visualizar
  return true;
}

/**
 * Verifica se usuário pode EDITAR uma ação
 */
export function canEditAction(user: User, action: Action, actionMicroregiaoId?: string): boolean {
  // Admin pode editar tudo
  if (user.role === 'admin') return true;

  // Gestor pode editar qualquer ação da sua microrregião
  if (user.role === 'gestor') {
    if (actionMicroregiaoId && actionMicroregiaoId !== user.microregiaoId) {
      return false;
    }
    return true;
  }

  // Verifica microrregião
  if (actionMicroregiaoId && actionMicroregiaoId !== user.microregiaoId) {
    return false;
  }

  // Usuário comum: verifica papel RACI
  const raciRole = getUserRaciRole(user, action);
  if (!raciRole) return false;

  return RACI_PERMISSIONS[raciRole].editar;
}

/**
 * Verifica se usuário pode CRIAR ações
 */
export function canCreateAction(user: User): boolean {
  // Admin e gestor podem criar
  return user.role === 'admin' || user.role === 'gestor';
}

/**
 * Verifica se usuário pode EXCLUIR uma ação
 */
export function canDeleteAction(user: User, action: Action, actionMicroregiaoId?: string): boolean {
  // Admin pode excluir qualquer coisa
  if (user.role === 'admin') return true;

  // Verifica microrregião
  if (actionMicroregiaoId && actionMicroregiaoId !== user.microregiaoId) {
    return false;
  }

  // Gestor pode excluir na sua microrregião
  if (user.role === 'gestor') return true;

  // Usuário comum: só 'A' (Accountable) pode excluir
  const raciRole = getUserRaciRole(user, action);
  return raciRole === 'A';
}

/**
 * Verifica se usuário pode GERENCIAR EQUIPE de uma ação
 */
export function canManageTeam(user: User, action: Action, actionMicroregiaoId?: string): boolean {
  // Admin pode tudo
  if (user.role === 'admin') return true;

  // Verifica microrregião
  if (actionMicroregiaoId && actionMicroregiaoId !== user.microregiaoId) {
    return false;
  }

  // Gestor pode gerenciar equipe
  if (user.role === 'gestor') return true;

  // Usuário comum: apenas R ou A podem gerenciar equipe
  const raciRole = getUserRaciRole(user, action);
  return raciRole === 'R' || raciRole === 'A';
}

/**
 * Verifica se usuário pode acessar o painel admin
 */
export function canAccessAdmin(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Verifica se usuário pode criar outros usuários
 */
export function canCreateUsers(user: User): boolean {
  return user.role === 'admin';
}

/**
 * Verifica se usuário pode ver todas as microrregiões
 */
export function canViewAllMicroregioes(user: User): boolean {
  return user.role === 'admin';
}

// =====================================
// HELPER: Obter lista de permissões do usuário
// =====================================

export type UserPermissions = {
  canCreate: boolean;
  canAccessAdmin: boolean;
  canViewAllMicroregioes: boolean;
  canCreateUsers: boolean;
};

export function getUserPermissions(user: User): UserPermissions {
  return {
    canCreate: canCreateAction(user),
    canAccessAdmin: canAccessAdmin(user),
    canViewAllMicroregioes: canViewAllMicroregioes(user),
    canCreateUsers: canCreateUsers(user),
  };
}




