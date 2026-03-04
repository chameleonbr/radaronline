import type { ActionTag } from '../../types';

export interface ActionTagRow {
  id: string;
  name: string;
  color: string;
  favorite_micros: string[] | null;
}

export interface ActionTagAssignmentRow {
  tag_id: string;
  tag: {
    id: string;
    name: string;
    color: string;
  } | Array<{
    id: string;
    name: string;
    color: string;
  }> | null;
}

export interface TagFavoriteState {
  localFavorites: string[];
  nextLocalFavorites: string[];
  isFavorite: boolean;
}

export type LoadedActionTag = ActionTag;
