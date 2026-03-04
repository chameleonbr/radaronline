import { shouldUseBackendAuthSessionApi } from '../backendApiConfig';
import { getCurrentSessionViaBackendApi } from '../sessionApi';
import { supabaseSessionProvider } from './supabaseSessionProvider';
import type { SessionProvider } from './sessionProvider.types';

export const backendFirstSessionProvider: SessionProvider = {
  async getSession() {
    if (!shouldUseBackendAuthSessionApi()) {
      return supabaseSessionProvider.getSession();
    }

    const accessToken = await supabaseSessionProvider.getAccessToken();
    if (!accessToken) {
      return {
        data: { session: null },
        error: null,
      };
    }

    try {
      return await getCurrentSessionViaBackendApi(accessToken);
    } catch {
      return supabaseSessionProvider.getSession();
    }
  },

  async getAccessToken() {
    return supabaseSessionProvider.getAccessToken();
  },

  async getUser() {
    if (!shouldUseBackendAuthSessionApi()) {
      return supabaseSessionProvider.getUser();
    }

    const {
      data: { session },
    } = await this.getSession();

    return {
      data: {
        user: session?.user || null,
      },
      error: null,
    };
  },

  async signInWithPassword(email: string, password: string) {
    return supabaseSessionProvider.signInWithPassword(email, password);
  },

  async signOut() {
    return supabaseSessionProvider.signOut();
  },

  onAuthStateChange(callback) {
    return supabaseSessionProvider.onAuthStateChange(callback);
  },
};
