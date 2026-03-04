
import { ActivityType, ActivityLog } from '../types/activity.types';
import { logError, logWarn } from '../lib/logger';
import { getCurrentAuthUser } from './sessionService';
import {
  buildActivityLogMetadata,
  filterActivityLogs,
  normalizeActivityLogsWithoutUser,
  resolveCreatedByName,
} from './logging/loggingService.helpers';
import {
  fetchProfileNameByUserId,
  insertActivityLogRecord,
  listActivityLogsWithUser,
  listActivityLogsWithoutUser,
} from './logging/loggingService.repositories';
import type {
  FetchActivitiesFilter,
  LoggingEntityType,
  LoggingMetadata,
} from './logging/loggingService.types';

export const loggingService = {
  async logActivity(
    type: ActivityType,
    entityType: LoggingEntityType,
    entityId?: string,
    metadata: LoggingMetadata = {}
  ) {
    try {
      const {
        data: { user },
      } = await getCurrentAuthUser();

      if (!user) {
        logWarn('loggingService', 'Usuario nao autenticado, log ignorado.');
        return;
      }

      let createdByName = resolveCreatedByName(metadata, '');
      if (!createdByName) {
        createdByName = (await fetchProfileNameByUserId(user.id)) || 'Usuario';
      }

      await insertActivityLogRecord({
        user_id: user.id,
        action_type: type,
        entity_type: entityType,
        entity_id: entityId,
        metadata: buildActivityLogMetadata(metadata, user.id, createdByName),
      });
    } catch (err) {
      logError('loggingService', 'Erro inesperado ao registrar log', err);
    }
  },

  async fetchActivities(limit = 50, filter?: FetchActivitiesFilter): Promise<ActivityLog[]> {
    try {
      try {
        return filterActivityLogs(await listActivityLogsWithUser(limit, filter?.type), filter);
      } catch (error) {
        logError('loggingService', 'Erro na query com join', error);
        return filterActivityLogs(
          normalizeActivityLogsWithoutUser(await listActivityLogsWithoutUser(limit, filter?.type)),
          filter
        );
      }
    } catch (err) {
      logError('loggingService', 'Erro ao buscar atividades', err);
      return [];
    }
  },
};





