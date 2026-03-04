import { getPlatformClient } from '../platformClient';
import type {
  InsertActivityLogInput,
} from './loggingService.types';
import type { ActivityLog } from '../../types/activity.types';

const platformClient = getPlatformClient;
const ACTIVITY_LOG_WITH_USER_SELECT = `
  *,
  user:profiles (
    nome,
    role,
    avatar_id,
    microregiao_id
  )
`;

function applyTypeFilter<T extends { eq: (column: string, value: string) => T }>(
  query: T,
  type?: string
): T {
  if (type && type !== 'todos') {
    return query.eq('action_type', type);
  }

  return query;
}

export async function fetchProfileNameByUserId(userId: string): Promise<string | null> {
  const { data, error } = await platformClient()
    .from('profiles')
    .select('nome')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data?.nome || null;
}

export async function insertActivityLogRecord(input: InsertActivityLogInput): Promise<void> {
  const { error } = await platformClient().from('activity_logs').insert(input);

  if (error) {
    throw error;
  }
}

export async function listActivityLogsWithUser(
  limit: number,
  type?: string
): Promise<ActivityLog[]> {
  let query = platformClient()
    .from('activity_logs')
    .select(ACTIVITY_LOG_WITH_USER_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  query = applyTypeFilter(query, type);

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data as ActivityLog[] | null) || [];
}

export async function listActivityLogsWithoutUser(
  limit: number,
  type?: string
): Promise<ActivityLog[]> {
  let query = platformClient()
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  query = applyTypeFilter(query, type);

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data as ActivityLog[] | null) || [];
}
