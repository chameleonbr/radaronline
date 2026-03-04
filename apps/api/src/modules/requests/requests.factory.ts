import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { InMemoryRequestsRepository } from './requests.repository.js';
import { RequestsService } from './requests.service.js';
import { SupabaseRequestsRepository } from './requests.supabase.repository.js';

export function createRequestsService() {
  if (hasSupabaseAdminConfig()) {
    return new RequestsService(new SupabaseRequestsRepository());
  }

  return new RequestsService(new InMemoryRequestsRepository());
}
