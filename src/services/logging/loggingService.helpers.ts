import type { ActivityLog } from '../../types/activity.types';
import type {
  FetchActivitiesFilter,
  LoggingMetadata,
} from './loggingService.types';

export function resolveCreatedByName(
  metadata: LoggingMetadata,
  fallbackName: string
): string {
  const explicitName =
    typeof metadata.created_by_name === 'string' ? metadata.created_by_name : '';

  return explicitName || fallbackName;
}

export function buildActivityLogMetadata(
  metadata: LoggingMetadata,
  userId: string,
  createdByName: string
): LoggingMetadata {
  return {
    ...metadata,
    created_by_name: createdByName,
    created_by_id: userId,
  };
}

export function normalizeActivityLogsWithoutUser(logs: ActivityLog[]): ActivityLog[] {
  return logs.map((log) => ({
    ...log,
    user: undefined,
  }));
}

export function filterActivityLogs(
  logs: ActivityLog[],
  filter?: FetchActivitiesFilter
): ActivityLog[] {
  if (!filter?.microregiaoId || filter.microregiaoId === 'all') {
    return logs;
  }

  return logs.filter((log) => {
    const metadata = (log.metadata || {}) as Record<string, unknown>;
    const metadataMicro =
      typeof metadata.microregiaoId === 'string'
        ? metadata.microregiaoId
        : typeof metadata.target_user_microregiao === 'string'
          ? metadata.target_user_microregiao
          : undefined;

    return log.user?.microregiao_id === filter.microregiaoId || metadataMicro === filter.microregiaoId;
  });
}
