import { getBackendApiBaseUrl } from './backendApiConfig';

type BackendSessionResponse = {
  authenticated: boolean;
  traceId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'superadmin' | 'admin' | 'gestor' | 'usuario';
  };
};

export async function getCurrentSessionViaBackendApi(accessToken: string) {
  const baseUrl = getBackendApiBaseUrl();
  if (!baseUrl) {
    throw new Error('Backend API URL is not configured');
  }

  const response = await fetch(`${baseUrl}/v1/auth/session`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load backend session');
  }

  const payload = (await response.json()) as BackendSessionResponse;
  if (!payload.authenticated || !payload.user) {
    return {
      data: {
        session: null,
      },
      error: null,
    };
  }

  return {
    data: {
      session: {
        access_token: accessToken,
        user: {
          id: payload.user.id,
          email: payload.user.email,
          created_at: new Date().toISOString(),
          user_metadata: {
            nome: payload.user.name,
          },
          app_metadata: {
            role: payload.user.role,
          },
        },
      },
    },
    error: null,
  };
}
