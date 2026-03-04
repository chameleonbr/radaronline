import { getSessionProvider } from './session/sessionProviderFactory';
import type { AuthStateCallback } from './session/sessionProvider.types';

export async function getCurrentAccessToken(): Promise<string | null> {
  return getSessionProvider().getAccessToken();
}

export async function getCurrentSession() {
  return getSessionProvider().getSession();
}

export async function getCurrentAuthUser() {
  return getSessionProvider().getUser();
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await getCurrentAuthUser();
  return user?.id || null;
}

export async function requireCurrentAuthUser(errorMessage = 'Usu\u00E1rio n\u00E3o autenticado') {
  const { data: { user }, error } = await getCurrentAuthUser();
  if (error || !user) {
    throw new Error(errorMessage);
  }
  return user;
}

export async function requireCurrentUserId(errorMessage = 'Usu\u00E1rio n\u00E3o autenticado'): Promise<string> {
  const user = await requireCurrentAuthUser(errorMessage);
  return user.id;
}

export async function signInWithPassword(email: string, password: string) {
  return getSessionProvider().signInWithPassword(email, password);
}

export async function signOutCurrentSession() {
  return getSessionProvider().signOut();
}

export function subscribeToAuthStateChanges(callback: AuthStateCallback) {
  return getSessionProvider().onAuthStateChange(callback);
}
