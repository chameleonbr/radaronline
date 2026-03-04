import {
  getBackendApiBaseUrl,
  hasBackendApiConfig,
  isLegacySupabaseAdminFlowDisabled,
  shouldUseBackendActionsApi,
  shouldUseBackendAdminUsersApi,
  shouldUseBackendAnnouncementsApi,
  shouldUseBackendAuthProfileApi,
  shouldUseBackendAuthSessionApi,
  shouldUseBackendCommentsApi,
  shouldUseBackendRequestsApi,
  shouldUseBackendTagsApi,
  shouldUseBackendTeamsApi,
  shouldUseBackendObjectivesActivitiesApi,
} from './backendApiConfig';
import { getCurrentAccessToken } from './sessionService';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type ProblemPayload = {
  title?: string;
  detail?: string;
  error?: string;
};

async function buildHeaders(hasBody: boolean): Promise<HeadersInit> {
  const headers: Record<string, string> = {};
  const accessToken = await getCurrentAccessToken();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export async function apiRequest<T>(path: string, options: { method?: HttpMethod; body?: unknown } = {}): Promise<T> {
  const baseUrl = getBackendApiBaseUrl();
  if (!baseUrl) {
    throw new Error('Backend API URL is not configured');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: await buildHeaders(options.body !== undefined),
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let payload: ProblemPayload | null = null;

    try {
      payload = (await response.json()) as ProblemPayload;
    } catch {
      payload = null;
    }

    throw new Error(payload?.detail || payload?.title || payload?.error || 'Backend API request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export {
  getBackendApiBaseUrl,
  hasBackendApiConfig,
  isLegacySupabaseAdminFlowDisabled,
  shouldUseBackendActionsApi,
  shouldUseBackendAdminUsersApi,
  shouldUseBackendAnnouncementsApi,
  shouldUseBackendAuthProfileApi,
  shouldUseBackendAuthSessionApi,
  shouldUseBackendCommentsApi,
  shouldUseBackendRequestsApi,
  shouldUseBackendTagsApi,
  shouldUseBackendTeamsApi,
  shouldUseBackendObjectivesActivitiesApi,
};
