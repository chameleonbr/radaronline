export interface TagRecord {
  id: string;
  name: string;
  color: string;
  favoriteMicros: string[];
}

export interface ActionTagRecord {
  id: string;
  name: string;
  color: string;
  isFavorite?: boolean;
}

export interface CreateTagInput {
  name: string;
  createdBy: string;
}
