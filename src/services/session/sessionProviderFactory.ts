import { shouldUseBackendAuthSessionApi } from '../backendApiConfig';
import { backendFirstSessionProvider } from './backendFirstSessionProvider';
import { supabaseSessionProvider } from './supabaseSessionProvider';
import type { SessionProvider } from './sessionProvider.types';

export function getSessionProvider(): SessionProvider {
  return shouldUseBackendAuthSessionApi()
    ? backendFirstSessionProvider
    : supabaseSessionProvider;
}
