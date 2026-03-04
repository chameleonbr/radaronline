import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { InMemoryActionsRepository } from './actions.repository.js';
import { ActionsService } from './actions.service.js';
import { SupabaseActionsRepository } from './actions.supabase.repository.js';

export function createActionsService() {
  if (hasSupabaseAdminConfig()) {
    return new ActionsService(new SupabaseActionsRepository());
  }

  return new ActionsService(new InMemoryActionsRepository());
}
