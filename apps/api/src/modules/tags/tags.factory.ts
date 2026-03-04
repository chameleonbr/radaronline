import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { TagsService } from './tags.service.js';
import { InMemoryTagsRepository } from './tags.repository.js';
import { SupabaseTagsRepository } from './tags.supabase.repository.js';

export function createTagsService() {
  if (hasSupabaseAdminConfig()) {
    return new TagsService(new SupabaseTagsRepository());
  }

  return new TagsService(new InMemoryTagsRepository());
}
