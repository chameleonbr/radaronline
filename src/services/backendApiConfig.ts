function normalizeBaseUrl(value: string | undefined): string {
  return (value || '').trim().replace(/\/+$/, '');
}

export function isLegacySupabaseAdminFlowDisabled(): boolean {
  return import.meta.env.VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW === 'true';
}

export function getBackendApiBaseUrl(): string {
  return normalizeBaseUrl(import.meta.env.VITE_BACKEND_API_URL);
}

export function hasBackendApiConfig(): boolean {
  return getBackendApiBaseUrl().length > 0;
}

export function shouldUseBackendAdminUsersApi(): boolean {
  return (
    hasBackendApiConfig() &&
    (import.meta.env.VITE_USE_BACKEND_ADMIN_USERS === 'true' ||
      isLegacySupabaseAdminFlowDisabled())
  );
}

export function shouldUseBackendActionsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_ACTIONS === 'true';
}

export function shouldUseBackendRequestsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_REQUESTS === 'true';
}

export function shouldUseBackendAnnouncementsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_ANNOUNCEMENTS === 'true';
}

export function shouldUseBackendCommentsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_COMMENTS === 'true';
}

export function shouldUseBackendAuthProfileApi(): boolean {
  return (
    hasBackendApiConfig() &&
    (import.meta.env.VITE_USE_BACKEND_AUTH_PROFILE === 'true' ||
      isLegacySupabaseAdminFlowDisabled())
  );
}

export function shouldUseBackendTagsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_TAGS === 'true';
}

export function shouldUseBackendTeamsApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_TEAMS === 'true';
}

export function shouldUseBackendObjectivesActivitiesApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_OBJECTIVES_ACTIVITIES === 'true';
}

export function shouldUseBackendAuthSessionApi(): boolean {
  return hasBackendApiConfig() && import.meta.env.VITE_USE_BACKEND_AUTH_SESSION === 'true';
}
