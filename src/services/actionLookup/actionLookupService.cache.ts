import type { ActionLookupCacheEntry } from './actionLookupService.types';

const actionUuidCache = new Map<string, ActionLookupCacheEntry>();
const ACTION_ID_CACHE_TTL_MS = 60_000;

export function getCachedActionDbId(uid: string, now: number = Date.now()): string | null {
  const cached = actionUuidCache.get(uid);
  if (!cached) {
    return null;
  }

  if (now - cached.timestamp >= ACTION_ID_CACHE_TTL_MS) {
    actionUuidCache.delete(uid);
    return null;
  }

  return cached.id;
}

export function cacheActionDbId(uid: string, id: string, now: number = Date.now()): void {
  actionUuidCache.set(uid, { id, timestamp: now });
}

export function clearActionIdCacheForUid(uid: string): void {
  actionUuidCache.delete(uid);
}

export function clearActionLookupCache(): void {
  actionUuidCache.clear();
}
