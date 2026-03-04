import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { AuthProfileService } from './auth.service.js';
import { InMemoryAuthProfileRepository } from './auth.repository.js';
import { SupabaseAuthProfileRepository } from './auth.supabase.repository.js';

export function createAuthProfileService() {
  if (hasSupabaseAdminConfig()) {
    return new AuthProfileService(new SupabaseAuthProfileRepository());
  }

  return new AuthProfileService(new InMemoryAuthProfileRepository());
}
