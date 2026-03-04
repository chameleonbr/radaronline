import type { ActionTag } from '../../types';
import type {
  ActionTagAssignmentRow,
  ActionTagRow,
  TagFavoriteState,
} from './tagsService.types';

export function generateTagColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 45%)`;
}

export function readLocalFavoriteTags(microId?: string): string[] {
  if (!microId) {
    return [];
  }

  try {
    const stored = localStorage.getItem(`favorite_tags_${microId}`);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function buildNextFavoriteState(
  currentFavorites: string[],
  tagId: string
): TagFavoriteState {
  if (currentFavorites.includes(tagId)) {
    return {
      localFavorites: currentFavorites,
      nextLocalFavorites: currentFavorites.filter((id) => id !== tagId),
      isFavorite: false,
    };
  }

  return {
    localFavorites: currentFavorites,
    nextLocalFavorites: [...currentFavorites, tagId],
    isFavorite: true,
  };
}

export function persistLocalFavoriteTags(microId: string, tagIds: string[]): void {
  localStorage.setItem(`favorite_tags_${microId}`, JSON.stringify(tagIds));
}

export function mapLoadedTags(
  rows: ActionTagRow[],
  microId?: string,
  localFavorites: string[] = []
): ActionTag[] {
  return rows
    .map((row) => {
      const dbFavorites = row.favorite_micros || [];
      const isDbFavorite = microId ? dbFavorites.includes(microId) : false;
      const isLocalFavorite = localFavorites.includes(row.id);

      return {
        id: row.id,
        name: row.name,
        color: row.color,
        isFavorite: isDbFavorite || isLocalFavorite,
      };
    })
    .sort((a, b) => {
      if (a.isFavorite === b.isFavorite) {
        return a.name.localeCompare(b.name);
      }

      return a.isFavorite ? -1 : 1;
    });
}

export function mapActionTagAssignments(rows: ActionTagAssignmentRow[]): ActionTag[] {
  return rows
    .map((row) => ({
      ...row,
      tag: Array.isArray(row.tag) ? row.tag[0] || null : row.tag,
    }))
    .filter((row) => row.tag)
    .map((row) => ({
      id: row.tag!.id,
      name: row.tag!.name,
      color: row.tag!.color,
    }));
}
