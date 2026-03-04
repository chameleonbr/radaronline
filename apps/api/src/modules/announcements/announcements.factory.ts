import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { AnnouncementsService } from './announcements.service.js';
import { InMemoryAnnouncementsRepository } from './announcements.repository.js';
import { SupabaseAnnouncementsRepository } from './announcements.supabase.repository.js';

export function createAnnouncementsService() {
  if (hasSupabaseAdminConfig()) {
    return new AnnouncementsService(new SupabaseAnnouncementsRepository());
  }

  return new AnnouncementsService(new InMemoryAnnouncementsRepository());
}
