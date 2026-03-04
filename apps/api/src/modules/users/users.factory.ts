import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { InMemoryUsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { SupabaseUsersRepository } from './users.supabase.repository.js';

export function createUsersService() {
  if (hasSupabaseAdminConfig()) {
    return new UsersService(new SupabaseUsersRepository());
  }

  return new UsersService(new InMemoryUsersRepository());
}
