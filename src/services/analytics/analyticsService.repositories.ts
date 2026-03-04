import { getPlatformClient } from '../platformClient';
import type {
  AnalyticsPageStatsRow,
  CompletedActionDatesRow,
  CreatedAtRow,
  LastMunicipalityActivityRow,
  MunicipalityProfileRow,
  PageRow,
  ProfileSummaryRow,
  RegionEngagementRow,
  SessionDurationRow,
  SessionStartedAtRow,
  UserAnalyticsUserRow,
} from './analyticsService.types';

const platformClient = getPlatformClient;

export async function insertUserSession(userId: string, deviceInfo: unknown): Promise<string | null> {
  const { data, error } = await platformClient()
    .from('user_sessions')
    .insert({
      user_id: userId,
      device_info: deviceInfo,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message || 'Falha ao criar sessao');
  }

  return data?.id || null;
}

export async function fetchSessionStartedAt(sessionId: string): Promise<SessionStartedAtRow | null> {
  const { data, error } = await platformClient()
    .from('user_sessions')
    .select('started_at')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Falha ao carregar sessao');
  }

  return (data as SessionStartedAtRow | null) ?? null;
}

export async function countSessionPageViews(sessionId: string): Promise<number> {
  const { count, error } = await platformClient()
    .from('user_analytics')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('event_type', 'page_view');

  if (error) {
    throw new Error(error.message || 'Falha ao contar page views');
  }

  return count || 0;
}

export async function finalizeUserSession(
  sessionId: string,
  payload: {
    endedAt: string;
    durationSeconds: number;
    pageCount: number;
  }
): Promise<void> {
  const { error } = await platformClient()
    .from('user_sessions')
    .update({
      ended_at: payload.endedAt,
      duration_seconds: payload.durationSeconds,
      page_count: payload.pageCount,
    })
    .eq('id', sessionId);

  if (error) {
    throw new Error(error.message || 'Falha ao finalizar sessao');
  }
}

export async function insertAnalyticsEvents(records: Array<Record<string, unknown>>): Promise<void> {
  const { error } = await platformClient().from('user_analytics').insert(records);

  if (error) {
    throw new Error(error.message || 'Falha ao registrar eventos de analytics');
  }
}

export async function countProfiles(): Promise<number> {
  const { count, error } = await platformClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(error.message || 'Falha ao contar perfis');
  }

  return count || 0;
}

export async function fetchAnalyticsUserIdsInRange(startDate: Date, endDate?: Date): Promise<UserAnalyticsUserRow[]> {
  let query = platformClient()
    .from('user_analytics')
    .select('user_id, created_at')
    .gte('created_at', startDate.toISOString());

  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Falha ao carregar analytics por usuario');
  }

  return (data as UserAnalyticsUserRow[] | null) || [];
}

export async function fetchRecentProfiles(limit: number): Promise<ProfileSummaryRow[]> {
  const { data, error } = await platformClient()
    .from('profiles')
    .select('id, nome, email, microregiao_id, municipio, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || 'Falha ao carregar perfis recentes');
  }

  return (data as ProfileSummaryRow[] | null) || [];
}

export async function fetchProfilesByIds(userIds: string[]): Promise<ProfileSummaryRow[]> {
  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await platformClient()
    .from('profiles')
    .select('id, nome, email, microregiao_id, municipio')
    .in('id', userIds);

  if (error) {
    throw new Error(error.message || 'Falha ao carregar perfis');
  }

  return (data as ProfileSummaryRow[] | null) || [];
}

export async function countSessionsStartedSince(startDate: Date): Promise<number> {
  const { count, error } = await platformClient()
    .from('user_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('started_at', startDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao contar sessoes');
  }

  return count || 0;
}

export async function fetchSessionDurations(startDate: Date, endDate: Date): Promise<SessionDurationRow[]> {
  const { data, error } = await platformClient()
    .from('user_sessions')
    .select('duration_seconds')
    .not('duration_seconds', 'is', null)
    .gte('started_at', startDate.toISOString())
    .lte('started_at', endDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao carregar duracoes de sessao');
  }

  return (data as SessionDurationRow[] | null) || [];
}

export async function fetchPageViews(startDate: Date, endDate: Date): Promise<PageRow[]> {
  const { data, error } = await platformClient()
    .from('user_analytics')
    .select('page')
    .eq('event_type', 'page_view')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao carregar paginas');
  }

  return (data as PageRow[] | null) || [];
}

export async function fetchCreatedAtEvents(startDate: Date, endDate: Date): Promise<CreatedAtRow[]> {
  const { data, error } = await platformClient()
    .from('user_analytics')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao carregar eventos por hora');
  }

  return (data as CreatedAtRow[] | null) || [];
}

export async function fetchMunicipalityProfiles(): Promise<MunicipalityProfileRow[]> {
  const { data, error } = await platformClient()
    .from('profiles')
    .select('microregiao_id, municipio')
    .not('municipio', 'is', null);

  if (error) {
    throw new Error(error.message || 'Falha ao carregar municipios');
  }

  return (data as MunicipalityProfileRow[] | null) || [];
}

export async function fetchLastMunicipalityActivities(): Promise<LastMunicipalityActivityRow[]> {
  const { data, error } = await platformClient()
    .from('user_analytics')
    .select(`
      user_id,
      created_at,
      profiles!inner(microregiao_id, municipio)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Falha ao carregar atividades por municipio');
  }

  return (data as unknown as LastMunicipalityActivityRow[] | null) || [];
}

export async function fetchRegionEngagementRows(): Promise<RegionEngagementRow[]> {
  const { data, error } = await platformClient().from('analytics_region_engagement').select('*');

  if (error) {
    throw new Error(error.message || 'Falha ao carregar view de engajamento');
  }

  return (data as RegionEngagementRow[] | null) || [];
}

export async function countActionsCreatedSince(startDate: Date): Promise<number> {
  const { count, error } = await platformClient()
    .from('actions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao contar acoes criadas');
  }

  return count || 0;
}

export async function countActionsUpdatedSince(startDate: Date): Promise<number> {
  const { count, error } = await platformClient()
    .from('actions')
    .select('*', { count: 'exact', head: true })
    .gte('updated_at', startDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao contar acoes atualizadas');
  }

  return count || 0;
}

export async function countCompletedActionsSince(startDate: Date): Promise<number> {
  const { count, error } = await platformClient()
    .from('actions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Conclu\u00EDdo')
    .gte('end_date', startDate.toISOString());

  if (error) {
    throw new Error(error.message || 'Falha ao contar acoes concluidas');
  }

  return count || 0;
}

export async function fetchCompletedActionDates(): Promise<CompletedActionDatesRow[]> {
  const { data, error } = await platformClient()
    .from('actions')
    .select('start_date, end_date')
    .eq('status', 'Conclu\u00EDdo')
    .not('start_date', 'is', null)
    .not('end_date', 'is', null);

  if (error) {
    throw new Error(error.message || 'Falha ao carregar datas de conclusao');
  }

  return (data as CompletedActionDatesRow[] | null) || [];
}

export async function fetchAnalyticsPageStats(startDate: Date, endDate: Date): Promise<AnalyticsPageStatsRow[]> {
  const { data, error } = await platformClient()
    .from('analytics_page_stats')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0]);

  if (error) {
    throw new Error(error.message || 'Falha ao carregar estatisticas por pagina');
  }

  return (data as AnalyticsPageStatsRow[] | null) || [];
}
