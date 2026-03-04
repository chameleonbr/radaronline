import type { ActivityLog } from '../../types/activity.types';

export type LoggingEntityType = 'auth' | 'action' | 'user' | 'view';
export type LoggingMetadata = Record<string, unknown>;

export interface FetchActivitiesFilter {
  type?: string;
  microregiaoId?: string;
}

export interface InsertActivityLogInput {
  user_id: string;
  action_type: string;
  entity_type: LoggingEntityType;
  entity_id?: string;
  metadata: LoggingMetadata;
}

export type ActivityLogRecord = ActivityLog;
