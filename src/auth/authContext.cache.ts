import type { User } from '../types/auth.types';

const PROFILE_CACHE_KEY = 'radar_profile_cache';
const PROFILE_CACHE_TTL = 5 * 60 * 1000;
const profileMemoryCache = new Map<string, User>();

export function getProfileFromMemoryCache(userId: string): User | null {
  return profileMemoryCache.get(userId) || null;
}

export function setProfileInMemoryCache(userId: string, profile: User): void {
  profileMemoryCache.set(userId, profile);
}

export function deleteProfileFromMemoryCache(userId: string): void {
  profileMemoryCache.delete(userId);
}

export function clearProfileMemoryCache(): void {
  profileMemoryCache.clear();
}

export function getCachedProfile(): User | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const { profile, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > PROFILE_CACHE_TTL) {
      localStorage.removeItem(PROFILE_CACHE_KEY);
      return null;
    }
    return profile;
  } catch {
    return null;
  }
}

export function setCachedProfile(profile: User | null): void {
  try {
    if (profile) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ profile, timestamp: Date.now() }));
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
}

export function clearCachedProfile(): void {
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function clearSupabaseAuthStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
      if (key.includes('supabase') && key.includes('auth')) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage failures.
  }
}
