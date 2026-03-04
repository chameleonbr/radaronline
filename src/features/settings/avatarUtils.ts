export type AvatarCategory =
  | 'zeGotinha'
  | 'pessoas'
  | 'emojis'
  | 'robos'
  | 'cores'
  | 'abstrato';

interface BaseAvatar {
  id: string;
  label: string;
  category: AvatarCategory;
}

interface LocalAvatar extends BaseAvatar {
  local: string;
}

interface RemoteAvatar extends BaseAvatar {
  seed: string;
  style: string;
}

export type AvatarOption = LocalAvatar | RemoteAvatar;

export const AVATAR_LIST: AvatarOption[] = [
  // Ze Gotinha
  { id: 'zg1', label: 'Ze Gotinha 1', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg1.png' },
  { id: 'zg2', label: 'Ze Gotinha 2', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg2.png' },
  { id: 'zg3', label: 'Ze Gotinha 3', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg3.png' },
  { id: 'zg4', label: 'Ze Gotinha 4', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg4.png' },
  { id: 'zg5', label: 'Ze Gotinha 5', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg5.png' },
  { id: 'zg6', label: 'Ze Gotinha 6', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg6.png' },
  { id: 'zg7', label: 'Ze Gotinha 7', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg7.png' },
  { id: 'zg8', label: 'Ze Gotinha 8', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg8.png' },
  { id: 'zg9', label: 'Ze Gotinha 9', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg9.png' },
  { id: 'zg10', label: 'Ze Gotinha 10', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg10.png' },
  { id: 'zg11', label: 'Ze Gotinha 11', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg11.png' },
  { id: 'zg12', label: 'Ze Gotinha 12', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg12.png' },
  { id: 'zg13', label: 'Ze Gotinha 13', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg13.png' },
  { id: 'zg14', label: 'Ze Gotinha 14', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg14.png' },
  { id: 'zg15', label: 'Ze Gotinha 15', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg15.png' },
  { id: 'zg16', label: 'Ze Gotinha 16', category: 'zeGotinha', local: '/avatars/ze-gotinha/zg16.png' },

  // Pessoas
  { id: 'p22', seed: 'Thiago', label: 'Pessoa 1', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p1', seed: 'Ana', label: 'Pessoa 2', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p2', seed: 'Carlos', label: 'Pessoa 3', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p3', seed: 'Maria', label: 'Pessoa 4', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p4', seed: 'Pedro', label: 'Pessoa 5', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p5', seed: 'Julia', label: 'Pessoa 6', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p6', seed: 'Lucas', label: 'Pessoa 7', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p7', seed: 'Clara', label: 'Pessoa 8', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p8', seed: 'Rafael', label: 'Pessoa 9', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p9', seed: 'Beatriz', label: 'Pessoa 10', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p10', seed: 'Marcos', label: 'Pessoa 11', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p11', seed: 'Patricia', label: 'Pessoa 12', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p12', seed: 'Roberto', label: 'Pessoa 13', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p13', seed: 'Camila', label: 'Pessoa 14', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p14', seed: 'Fernando', label: 'Pessoa 15', category: 'pessoas', style: 'notionists-neutral' },
  { id: 'p15', seed: 'Lucia', label: 'Pessoa 16', category: 'pessoas', style: 'notionists-neutral' },

  // Emojis
  { id: 'e1', seed: 'like', label: 'Joinha', category: 'emojis', style: 'thumbs' },
  { id: 'e2', seed: 'cool', label: 'Legal', category: 'emojis', style: 'thumbs' },
  { id: 'e3', seed: 'happy', label: 'Feliz', category: 'emojis', style: 'thumbs' },
  { id: 'e4', seed: 'star', label: 'Estrela', category: 'emojis', style: 'thumbs' },

  // Robos
  { id: 'r1', seed: 'Robot1', label: 'Robo 1', category: 'robos', style: 'bottts' },
  { id: 'r2', seed: 'Robot2', label: 'Robo 2', category: 'robos', style: 'bottts' },
  { id: 'r3', seed: 'Robot3', label: 'Robo 3', category: 'robos', style: 'bottts' },

  // Cores
  { id: 'c1', seed: 'Vermelho', label: 'Vermelho', category: 'cores', style: 'shapes' },
  { id: 'c2', seed: 'Azul', label: 'Azul', category: 'cores', style: 'shapes' },
  { id: 'c3', seed: 'Verde', label: 'Verde', category: 'cores', style: 'shapes' },

  // Abstrato
  { id: 'x1', seed: 'Alpha', label: 'Alpha', category: 'abstrato', style: 'rings' },
  { id: 'x2', seed: 'Beta', label: 'Beta', category: 'abstrato', style: 'rings' },
];

function isLocalAvatar(avatar: AvatarOption): avatar is LocalAvatar {
  return 'local' in avatar;
}

function isRemoteAvatar(avatar: AvatarOption): avatar is RemoteAvatar {
  return 'seed' in avatar && 'style' in avatar;
}

export function getAvatarUrl(avatarId: string, size: 'thumb' | 'full' = 'thumb'): string {
  const avatar = AVATAR_LIST.find(a => a.id === avatarId);

  if (!avatar) {
    return 'https://api.dicebear.com/7.x/personas/svg?seed=User&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
  }

  if (isLocalAvatar(avatar)) {
    if (size === 'thumb' && avatar.local.includes('/ze-gotinha/')) {
      return avatar.local
        .replace('/avatars/ze-gotinha/', '/avatars/ze-gotinha/thumb/')
        .replace('.png', '.webp');
    }
    return avatar.local;
  }

  if (isRemoteAvatar(avatar)) {
    const colors = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
    return `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}&backgroundColor=${colors}`;
  }

  return 'https://api.dicebear.com/7.x/personas/svg?seed=User&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
}
