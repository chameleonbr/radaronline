import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { InMemoryTeamsRepository } from './teams.repository.js';
import { TeamsService } from './teams.service.js';
import { SupabaseTeamsRepository } from './teams.supabase.repository.js';

export function createTeamsService() {
  if (hasSupabaseAdminConfig()) {
    return new TeamsService(new SupabaseTeamsRepository());
  }

  return new TeamsService(new InMemoryTeamsRepository());
}
