import { getMicroregiaoById } from '../data/microregioes';
import type { Microrregiao, User } from '../types/auth.types';

export function extractProfileFromMetadata(sessionUser: any): User | null {
  const userMeta = sessionUser?.user_metadata || {};
  const appMeta = sessionUser?.app_metadata || {};

  const role = appMeta.role || userMeta.role;
  const microId = appMeta.microregiao_id || userMeta.microregiao_id;
  const ativo = appMeta.ativo !== undefined ? appMeta.ativo : userMeta.ativo !== false;
  const nome = userMeta.nome || appMeta.nome;

  if (!role || !nome) {
    return null;
  }

  return {
    id: sessionUser.id,
    nome,
    email: sessionUser.email,
    role,
    microregiaoId: microId || 'all',
    ativo,
    lgpdConsentimento: true,
    avatarId: userMeta.avatar_id || 'zg10',
    municipio: userMeta.municipio,
    firstAccess: false,
    createdAt: sessionUser.created_at,
  };
}

export function getCurrentMicrorregiao(
  viewingMicroregiaoId: string | null,
  user: User | null
): Microrregiao | null {
  if (viewingMicroregiaoId) {
    return getMicroregiaoById(viewingMicroregiaoId) || null;
  }

  if (user?.microregiaoId && user.microregiaoId !== 'all') {
    return getMicroregiaoById(user.microregiaoId) || null;
  }

  return null;
}
