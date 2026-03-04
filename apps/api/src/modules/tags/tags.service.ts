import type { SessionUser } from '../../shared/auth/auth.types.js';
import type { TagsRepository } from './tags.repository.js';
import type { ActionTagRecord } from './tags.types.js';

function mapTagWithFavorite(tag: { id: string; name: string; color: string; favoriteMicros: string[] }, microregionId?: string): ActionTagRecord {
  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    isFavorite: microregionId ? tag.favoriteMicros.includes(microregionId) : false,
  };
}

export class TagsService {
  constructor(private readonly repository: TagsRepository) {}

  async listTags(_actor: SessionUser, microregionId?: string) {
    const tags = await this.repository.list();
    return tags.map((tag) => mapTagWithFavorite(tag, microregionId));
  }

  async createTag(actor: SessionUser, name: string) {
    return mapTagWithFavorite(await this.repository.create({ name, createdBy: actor.id }));
  }

  async deleteTag(_actor: SessionUser, tagId: string) {
    const current = await this.repository.getById(tagId);
    if (!current) throw new Error('NOT_FOUND');
    await this.repository.delete(tagId);
    return current;
  }

  async toggleFavorite(_actor: SessionUser, tagId: string, microregionId: string) {
    const current = await this.repository.getById(tagId);
    if (!current) throw new Error('NOT_FOUND');
    const nextFavorites = current.favoriteMicros.includes(microregionId)
      ? current.favoriteMicros.filter((id) => id !== microregionId)
      : [...current.favoriteMicros, microregionId];
    await this.repository.updateFavoriteMicros(tagId, nextFavorites);
    return { isFavorite: nextFavorites.includes(microregionId) };
  }

  async listActionTags(_actor: SessionUser, actionUid: string, microregionId?: string) {
    const tags = await this.repository.listActionTags(actionUid);
    return tags.map((tag) => mapTagWithFavorite(tag, microregionId));
  }

  async assignToAction(_actor: SessionUser, actionUid: string, tagId: string) {
    const tag = await this.repository.getById(tagId);
    if (!tag) throw new Error('NOT_FOUND');
    await this.repository.assignToAction(actionUid, tagId);
    return tag;
  }

  async removeFromAction(_actor: SessionUser, actionUid: string, tagId: string) {
    await this.repository.removeFromAction(actionUid, tagId);
  }
}
