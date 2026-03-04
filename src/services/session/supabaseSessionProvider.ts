import { getPlatformClient } from '../platformClient';
import type { SessionProvider } from './sessionProvider.types';

const platformClient = getPlatformClient;

export const supabaseSessionProvider: SessionProvider = {
  async getSession() {
    return platformClient().auth.getSession();
  },

  async getAccessToken() {
    const {
      data: { session },
    } = await platformClient().auth.getSession();

    return session?.access_token || null;
  },

  async getUser() {
    return platformClient().auth.getUser();
  },

  async signInWithPassword(email: string, password: string) {
    return platformClient().auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return platformClient().auth.signOut();
  },

  onAuthStateChange(callback) {
    return platformClient().auth.onAuthStateChange(callback);
  },
};
