import type { getPlatformClient } from '../platformClient';

type PlatformAuthClient = ReturnType<typeof getPlatformClient>['auth'];

export type AuthStateCallback = Parameters<PlatformAuthClient['onAuthStateChange']>[0];
export type AuthSubscriptionResult = ReturnType<PlatformAuthClient['onAuthStateChange']>;
export type SignInResult = Awaited<ReturnType<PlatformAuthClient['signInWithPassword']>>;
export type SignOutResult = Awaited<ReturnType<PlatformAuthClient['signOut']>>;

export interface SessionUserLike {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface SessionLike {
  access_token?: string;
  user: SessionUserLike | null;
}

export interface SessionResult {
  data: {
    session: SessionLike | null;
  };
  error: unknown;
}

export interface UserResult {
  data: {
    user: SessionUserLike | null;
  };
  error: unknown;
}

export interface SessionProvider {
  getSession(): Promise<SessionResult>;
  getAccessToken(): Promise<string | null>;
  getUser(): Promise<UserResult>;
  signInWithPassword(email: string, password: string): Promise<SignInResult>;
  signOut(): Promise<SignOutResult>;
  onAuthStateChange(callback: AuthStateCallback): AuthSubscriptionResult;
}
