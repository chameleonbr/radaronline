import { hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import { InMemoryObjectivesActivitiesRepository } from './objectivesActivities.repository.js';
import { ObjectivesActivitiesService } from './objectivesActivities.service.js';
import { SupabaseObjectivesActivitiesRepository } from './objectivesActivities.supabase.repository.js';

export function createObjectivesActivitiesService() {
  if (hasSupabaseAdminConfig()) {
    return new ObjectivesActivitiesService(new SupabaseObjectivesActivitiesRepository());
  }

  return new ObjectivesActivitiesService(new InMemoryObjectivesActivitiesRepository());
}
