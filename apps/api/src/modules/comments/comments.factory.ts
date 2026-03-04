import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { CommentsService } from './comments.service.js';
import { InMemoryCommentsRepository } from './comments.repository.js';
import { SupabaseCommentsRepository } from './comments.supabase.repository.js';

export function createCommentsService() {
  if (hasSupabaseAdminConfig()) {
    return new CommentsService(new SupabaseCommentsRepository());
  }

  return new CommentsService(new InMemoryCommentsRepository());
}
