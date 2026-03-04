export type ApiEnvironment = 'development' | 'test' | 'production';
export type AuthProviderMode = 'auto' | 'dev-header' | 'supabase-bridge' | 'entra-jwt';

export interface EntraAuthConfig {
  tenantId: string;
  audience: string;
  issuer: string;
  jwksUri: string;
  roleClaim: string;
}

export interface AppConfig {
  appName: string;
  env: ApiEnvironment;
  port: number;
  host: string;
  authProviderMode: AuthProviderMode;
  entra: EntraAuthConfig;
}

function normalizeEnv(value: string | undefined): ApiEnvironment {
  if (value === 'production' || value === 'test') {
    return value;
  }

  return 'development';
}

function normalizeAuthProviderMode(value: string | undefined): AuthProviderMode {
  if (
    value === 'dev-header' ||
    value === 'supabase-bridge' ||
    value === 'entra-jwt'
  ) {
    return value;
  }

  return 'auto';
}

function trim(value: string | undefined): string {
  return (value || '').trim();
}

function deriveEntraJwksUri(issuer: string, explicitJwksUri: string): string {
  if (explicitJwksUri) {
    return explicitJwksUri;
  }

  if (!issuer) {
    return '';
  }

  const normalizedIssuer = issuer.replace(/\/+$/, '').replace(/\/v2\.0$/, '');
  return `${normalizedIssuer}/discovery/v2.0/keys`;
}

export function loadConfig(): AppConfig {
  const issuer = trim(process.env.ENTRA_ISSUER);
  const explicitJwksUri = trim(process.env.ENTRA_JWKS_URI);

  return {
    appName: process.env.APP_NAME || 'radar-api',
    env: normalizeEnv(process.env.NODE_ENV),
    port: Number(process.env.PORT || 3001),
    host: process.env.HOST || '0.0.0.0',
    authProviderMode: normalizeAuthProviderMode(process.env.AUTH_PROVIDER),
    entra: {
      tenantId: trim(process.env.ENTRA_TENANT_ID),
      audience: trim(process.env.ENTRA_AUDIENCE),
      issuer,
      jwksUri: deriveEntraJwksUri(issuer, explicitJwksUri),
      roleClaim: trim(process.env.ENTRA_ROLE_CLAIM) || 'roles',
    },
  };
}
