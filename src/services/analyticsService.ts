import { log, logError } from '../lib/logger';
import { getCurrentSession } from './sessionService';
import type {
  ActionMetrics,
  AnalyticsEvent,
  AnalyticsFilter,
  AnalyticsSummary,
  DeviceInfo,
  HourlyUsage,
  InactiveMunicipality,
  PageViewStats,
  RegionEngagement,
  TopPage,
} from '../types/analytics.types';
import {
  ANALYTICS_DEFAULT_PERIOD_DAYS,
  ANALYTICS_INACTIVE_THRESHOLD_DAYS,
} from './analytics/analyticsService.constants';
import {
  aggregateHourlyUsage,
  aggregateInactiveMunicipalities,
  aggregatePageStats,
  aggregateTopPages,
  computeActionMetrics,
  computeAverageSessionDuration,
  countUniqueUsers,
  mapActiveUsersWithDetails,
  mapRecentProfilesAsActiveUsers,
  mapRegionEngagement,
} from './analytics/analyticsService.aggregations';
import {
  countActionsCreatedSince,
  countActionsUpdatedSince,
  countCompletedActionsSince,
  countProfiles,
  countSessionPageViews,
  countSessionsStartedSince,
  fetchAnalyticsPageStats,
  fetchAnalyticsUserIdsInRange,
  fetchCompletedActionDates,
  fetchCreatedAtEvents,
  fetchLastMunicipalityActivities,
  fetchMunicipalityProfiles,
  fetchPageViews,
  fetchProfilesByIds,
  fetchRecentProfiles,
  fetchRegionEngagementRows,
  fetchSessionDurations,
  fetchSessionStartedAt,
  finalizeUserSession,
  insertAnalyticsEvents,
  insertUserSession,
} from './analytics/analyticsService.repositories';

async function hasAuthenticatedSession(): Promise<boolean> {
  const {
    data: { session },
  } = await getCurrentSession();

  return Boolean(session);
}

function mapAnalyticsEventRecord(event: AnalyticsEvent): Record<string, unknown> {
  return {
    session_id: event.sessionId,
    user_id: event.userId,
    event_type: event.eventType,
    page: event.page,
    element: event.element,
    scroll_depth: event.scrollDepth,
    duration_seconds: event.durationSeconds,
    metadata: event.metadata || {},
  };
}

async function getSummaryRange(filter?: AnalyticsFilter): Promise<{ startDate: Date; endDate: Date }> {
  return {
    startDate:
      filter?.startDate ||
      new Date(Date.now() - ANALYTICS_DEFAULT_PERIOD_DAYS * 24 * 60 * 60 * 1000),
    endDate: filter?.endDate || new Date(),
  };
}

async function getActiveUsersWithDetails(startDate: Date, endDate: Date): Promise<
  Array<{
    id: string;
    name: string;
    email: string;
    microregiaoId: string;
    municipio: string;
    lastActivity: string;
  }>
> {
  try {
    const analyticsData = await fetchAnalyticsUserIdsInRange(startDate, endDate);

    log('analyticsService', 'getActiveUsersWithDetails', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      analyticsCount: analyticsData.length,
    });

    if (analyticsData.length === 0) {
      log('analyticsService', 'Nenhum dado de analytics encontrado, usando fallback por perfis');
      const recentProfiles = await fetchRecentProfiles(50);
      return mapRecentProfilesAsActiveUsers(recentProfiles);
    }

    const uniqueUserIds = Array.from(
      new Set(analyticsData.map((row) => row.user_id).filter(Boolean) as string[])
    );

    if (uniqueUserIds.length === 0) {
      return [];
    }

    const profiles = await fetchProfilesByIds(uniqueUserIds);
    return mapActiveUsersWithDetails(analyticsData, profiles);
  } catch (error) {
    logError('analyticsService', 'Erro inesperado em getActiveUsersWithDetails', error);
    return [];
  }
}

async function getActiveUsersToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = await fetchAnalyticsUserIdsInRange(today);
  return countUniqueUsers(rows);
}

async function getActiveUsersInPeriod(startDate: Date, endDate: Date): Promise<number> {
  const rows = await fetchAnalyticsUserIdsInRange(startDate, endDate);
  return countUniqueUsers(rows);
}

async function getSessionsToday(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return countSessionsStartedSince(today);
}

async function getAvgSessionDuration(startDate: Date, endDate: Date): Promise<number> {
  const rows = await fetchSessionDurations(startDate, endDate);
  return computeAverageSessionDuration(rows);
}

async function getTopPages(limit: number, startDate: Date, endDate: Date): Promise<TopPage[]> {
  const rows = await fetchPageViews(startDate, endDate);
  return aggregateTopPages(rows, limit);
}

async function getHourlyUsage(startDate: Date, endDate: Date): Promise<HourlyUsage[]> {
  const rows = await fetchCreatedAtEvents(startDate, endDate);
  return aggregateHourlyUsage(rows);
}

async function getInactiveMunicipalities(days: number): Promise<InactiveMunicipality[]> {
  const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [municipalityProfiles, lastActivities] = await Promise.all([
    fetchMunicipalityProfiles(),
    fetchLastMunicipalityActivities(),
  ]);

  return aggregateInactiveMunicipalities(municipalityProfiles, lastActivities, threshold);
}

async function getEngagementByRegion(_startDate: Date, _endDate: Date): Promise<RegionEngagement[]> {
  const rows = await fetchRegionEngagementRows();
  return mapRegionEngagement(rows);
}

async function getActionMetrics(): Promise<ActionMetrics> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [created, updated, completed, completedActions] = await Promise.all([
    countActionsCreatedSince(thirtyDaysAgo),
    countActionsUpdatedSince(thirtyDaysAgo),
    countCompletedActionsSince(thirtyDaysAgo),
    fetchCompletedActionDates(),
  ]);

  return computeActionMetrics(
    {
      created,
      updated,
      completed,
    },
    completedActions
  );
}

async function getPageStats(startDate: Date, endDate: Date): Promise<PageViewStats[]> {
  const rows = await fetchAnalyticsPageStats(startDate, endDate);
  return aggregatePageStats(rows);
}

export const analyticsService = {
  async startSession(userId: string, deviceInfo: DeviceInfo): Promise<string | null> {
    try {
      return await insertUserSession(userId, deviceInfo);
    } catch (error) {
      logError('analyticsService', 'Erro ao criar sessao', error);
      return null;
    }
  },

  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await fetchSessionStartedAt(sessionId);
      if (!session) {
        return;
      }

      const startedAt = new Date(session.started_at);
      const endedAt = new Date();
      const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
      const pageCount = await countSessionPageViews(sessionId);

      await finalizeUserSession(sessionId, {
        endedAt: endedAt.toISOString(),
        durationSeconds,
        pageCount,
      });
    } catch (error) {
      logError('analyticsService', 'Erro ao finalizar sessao', error);
    }
  },

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      if (!(await hasAuthenticatedSession())) {
        return;
      }

      await insertAnalyticsEvents([mapAnalyticsEventRecord(event)]);
    } catch (error) {
      logError('analyticsService', 'Erro ao registrar evento', error);
    }
  },

  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      if (!(await hasAuthenticatedSession()) || events.length === 0) {
        return;
      }

      await insertAnalyticsEvents(events.map(mapAnalyticsEventRecord));
    } catch (error) {
      logError('analyticsService', 'Erro ao registrar eventos em batch', error);
    }
  },

  async getSummary(filter?: AnalyticsFilter): Promise<AnalyticsSummary> {
    const { startDate, endDate } = await getSummaryRange(filter);

    const [
      activeUsersToday,
      activeUsersTotal,
      sessionsToday,
      avgSessionDuration,
      topPages,
      hourlyUsage,
      inactiveMunicipalities,
      regionEngagement,
      totalUsers,
    ] = await Promise.all([
      getActiveUsersToday(),
      getActiveUsersInPeriod(startDate, endDate),
      getSessionsToday(),
      getAvgSessionDuration(startDate, endDate),
      getTopPages(10, startDate, endDate),
      getHourlyUsage(startDate, endDate),
      getInactiveMunicipalities(ANALYTICS_INACTIVE_THRESHOLD_DAYS),
      getEngagementByRegion(startDate, endDate),
      countProfiles(),
    ]);

    const engagementRate = totalUsers ? (activeUsersTotal / totalUsers) * 100 : 0;

    return {
      activeUsersToday,
      activeUsersTotal,
      sessionsToday,
      avgSessionDuration,
      engagementRate: Math.round(engagementRate * 10) / 10,
      topPages,
      hourlyUsage,
      inactiveMunicipalities,
      regionEngagement,
    };
  },

  getActiveUsersToday,
  getActiveUsersInPeriod,
  getActiveUsersWithDetails,
  getSessionsToday,
  getAvgSessionDuration,
  getTopPages,
  getHourlyUsage,
  getInactiveMunicipalities,
  getEngagementByRegion,
  getActionMetrics,
  getPageStats,
};
