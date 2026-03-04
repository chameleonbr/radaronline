import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getBackendApiBaseUrl,
  hasBackendApiConfig,
  isLegacySupabaseAdminFlowDisabled,
  shouldUseBackendAdminUsersApi,
  shouldUseBackendAuthProfileApi,
} from './backendApiConfig';

describe('backendApiConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('normalizes backend base url', () => {
    vi.stubEnv('VITE_BACKEND_API_URL', 'https://api.example.gov.br///');

    expect(getBackendApiBaseUrl()).toBe('https://api.example.gov.br');
    expect(hasBackendApiConfig()).toBe(true);
  });

  it('enables backend admin users api when explicit flag is active', () => {
    vi.stubEnv('VITE_BACKEND_API_URL', 'https://api.example.gov.br');
    vi.stubEnv('VITE_USE_BACKEND_ADMIN_USERS', 'true');

    expect(shouldUseBackendAdminUsersApi()).toBe(true);
  });

  it('forces backend admin flow when legacy cutover is enabled', () => {
    vi.stubEnv('VITE_BACKEND_API_URL', 'https://api.example.gov.br');
    vi.stubEnv('VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW', 'true');

    expect(isLegacySupabaseAdminFlowDisabled()).toBe(true);
    expect(shouldUseBackendAdminUsersApi()).toBe(true);
    expect(shouldUseBackendAuthProfileApi()).toBe(true);
  });

  it('does not enable backend routing without backend api base url', () => {
    vi.stubEnv('VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW', 'true');

    expect(hasBackendApiConfig()).toBe(false);
    expect(shouldUseBackendAdminUsersApi()).toBe(false);
    expect(shouldUseBackendAuthProfileApi()).toBe(false);
  });
});
