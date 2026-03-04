export type UserAnalyticsUserRow = {
  user_id: string | null;
  created_at: string;
};

export type ProfileSummaryRow = {
  id: string;
  nome: string | null;
  email: string | null;
  microregiao_id: string | null;
  municipio: string | null;
  created_at?: string | null;
};

export type SessionStartedAtRow = {
  started_at: string;
};

export type SessionDurationRow = {
  duration_seconds: number | null;
};

export type PageRow = {
  page: string;
};

export type CreatedAtRow = {
  created_at: string;
};

export type MunicipalityProfileRow = {
  microregiao_id: string;
  municipio: string | null;
};

export type LastMunicipalityActivityRow = {
  user_id: string | null;
  created_at: string;
  profiles: {
    microregiao_id: string;
    municipio: string;
  };
};

export type RegionEngagementRow = {
  microregiao_id: string;
  municipio: string | null;
  active_users: number;
  total_views: number;
  total_sessions: number;
  avg_session_duration: number | null;
  last_activity: string;
};

export type CompletedActionDatesRow = {
  start_date: string | null;
  end_date: string | null;
};

export type AnalyticsPageStatsRow = {
  page: string;
  view_count: number | null;
  avg_time_seconds: number | null;
  avg_scroll_depth: number | null;
  unique_users: number | null;
};
