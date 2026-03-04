import type {
  ActionMetrics,
  HourlyUsage,
  InactiveMunicipality,
  PageViewStats,
  RegionEngagement,
  TopPage,
} from '../../types/analytics.types';
import type {
  AnalyticsPageStatsRow,
  CompletedActionDatesRow,
  CreatedAtRow,
  LastMunicipalityActivityRow,
  MunicipalityProfileRow,
  PageRow,
  ProfileSummaryRow,
  RegionEngagementRow,
  UserAnalyticsUserRow,
} from './analyticsService.types';

export function countUniqueUsers(rows: Array<{ user_id: string | null }> | null | undefined): number {
  return new Set((rows || []).map((row) => row.user_id).filter(Boolean)).size;
}

export function mapActiveUsersWithDetails(
  analyticsData: UserAnalyticsUserRow[] | null | undefined,
  profiles: ProfileSummaryRow[] | null | undefined
): Array<{
  id: string;
  name: string;
  email: string;
  microregiaoId: string;
  municipio: string;
  lastActivity: string;
}> {
  if (!analyticsData || analyticsData.length === 0 || !profiles || profiles.length === 0) {
    return [];
  }

  const lastActivityMap = new Map<string, string>();
  analyticsData.forEach((row) => {
    if (row.user_id && !lastActivityMap.has(row.user_id)) {
      lastActivityMap.set(row.user_id, row.created_at);
    }
  });

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.nome || 'Usuario',
    email: profile.email || '',
    microregiaoId: profile.microregiao_id || '',
    municipio: profile.municipio || '',
    lastActivity: lastActivityMap.get(profile.id) || '',
  }));
}

export function mapRecentProfilesAsActiveUsers(
  profiles: ProfileSummaryRow[] | null | undefined
): Array<{
  id: string;
  name: string;
  email: string;
  microregiaoId: string;
  municipio: string;
  lastActivity: string;
}> {
  return (profiles || []).map((profile) => ({
    id: profile.id,
    name: profile.nome || 'Usuario',
    email: profile.email || '',
    microregiaoId: profile.microregiao_id || '',
    municipio: profile.municipio || '',
    lastActivity: profile.created_at || '',
  }));
}

export function aggregateTopPages(rows: PageRow[] | null | undefined, limit: number): TopPage[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const pageCount: Record<string, number> = {};
  rows.forEach((row) => {
    pageCount[row.page] = (pageCount[row.page] || 0) + 1;
  });

  const total = rows.length;

  return Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([page, views]) => ({
      page,
      views,
      percentage: Math.round((views / total) * 1000) / 10,
    }));
}

export function aggregateHourlyUsage(rows: CreatedAtRow[] | null | undefined): HourlyUsage[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const hourCount: Record<number, number> = {};
  for (let hour = 0; hour < 24; hour += 1) {
    hourCount[hour] = 0;
  }

  rows.forEach((row) => {
    const hour = new Date(row.created_at).getHours();
    hourCount[hour] += 1;
  });

  return Object.entries(hourCount).map(([hour, count]) => ({
    hour: Number.parseInt(hour, 10),
    count,
  }));
}

export function aggregateInactiveMunicipalities(
  municipalityProfiles: MunicipalityProfileRow[] | null | undefined,
  lastActivities: LastMunicipalityActivityRow[] | null | undefined,
  threshold: Date,
  now: Date = new Date()
): InactiveMunicipality[] {
  if (!municipalityProfiles || municipalityProfiles.length === 0) {
    return [];
  }

  const municipioActivity: Record<string, { lastActivity: string; userCount: number }> = {};

  (lastActivities || []).forEach((activity) => {
    const key = `${activity.profiles.microregiao_id}-${activity.profiles.municipio}`;
    if (!municipioActivity[key]) {
      municipioActivity[key] = {
        lastActivity: activity.created_at,
        userCount: 1,
      };
    }
  });

  const uniqueMunicipios = new Map<string, { microregiaoId: string; municipio: string }>();
  municipalityProfiles.forEach((row) => {
    if (row.municipio) {
      uniqueMunicipios.set(`${row.microregiao_id}-${row.municipio}`, {
        microregiaoId: row.microregiao_id,
        municipio: row.municipio,
      });
    }
  });

  const inactive: InactiveMunicipality[] = [];

  uniqueMunicipios.forEach((value, key) => {
    const activity = municipioActivity[key];
    const lastLogin = activity?.lastActivity ? new Date(activity.lastActivity) : new Date(0);

    if (lastLogin < threshold) {
      inactive.push({
        microregiaoId: value.microregiaoId,
        municipio: value.municipio,
        lastLogin: lastLogin.toISOString(),
        daysSinceLogin: Math.floor((now.getTime() - lastLogin.getTime()) / (24 * 60 * 60 * 1000)),
        userCount: activity?.userCount || 0,
      });
    }
  });

  return inactive.sort((a, b) => b.daysSinceLogin - a.daysSinceLogin);
}

export function mapRegionEngagement(rows: RegionEngagementRow[] | null | undefined): RegionEngagement[] {
  return (rows || []).map((row) => ({
    microregiaoId: row.microregiao_id,
    municipio: row.municipio,
    activeUsers: row.active_users,
    totalViews: row.total_views,
    totalSessions: row.total_sessions,
    avgSessionDuration: row.avg_session_duration || 0,
    lastActivity: row.last_activity,
  }));
}

export function computeAverageSessionDuration(rows: Array<{ duration_seconds: number | null }> | null | undefined): number {
  if (!rows || rows.length === 0) {
    return 0;
  }

  const total = rows.reduce((sum, row) => sum + (row.duration_seconds || 0), 0);
  return Math.round(total / rows.length);
}

export function computeActionMetrics(
  counts: {
    created: number | null;
    updated: number | null;
    completed: number | null;
  },
  completedActions: CompletedActionDatesRow[] | null | undefined
): ActionMetrics {
  let avgDays = 0;

  if (completedActions && completedActions.length > 0) {
    const totalDays = completedActions.reduce((sum, action) => {
      const start = new Date(action.start_date as string);
      const end = new Date(action.end_date as string);
      return sum + Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    }, 0);

    avgDays = Math.round(totalDays / completedActions.length);
  }

  return {
    totalCreated: counts.created || 0,
    totalUpdated: counts.updated || 0,
    totalCompleted: counts.completed || 0,
    avgCompletionDays: avgDays,
  };
}

export function aggregatePageStats(rows: AnalyticsPageStatsRow[] | null | undefined): PageViewStats[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const pageStats: Record<string, PageViewStats> = {};

  rows.forEach((row) => {
    if (!pageStats[row.page]) {
      pageStats[row.page] = {
        page: row.page,
        viewCount: 0,
        avgTimeSeconds: 0,
        avgScrollDepth: 0,
        uniqueUsers: 0,
      };
    }

    pageStats[row.page].viewCount += row.view_count || 0;
    pageStats[row.page].avgTimeSeconds += row.avg_time_seconds || 0;
    pageStats[row.page].avgScrollDepth += row.avg_scroll_depth || 0;
    pageStats[row.page].uniqueUsers += row.unique_users || 0;
  });

  return Object.values(pageStats);
}
