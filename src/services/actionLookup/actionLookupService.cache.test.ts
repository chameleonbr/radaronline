import { afterEach, describe, expect, it } from 'vitest';

import {
  cacheActionDbId,
  clearActionIdCacheForUid,
  clearActionLookupCache,
  getCachedActionDbId,
} from './actionLookupService.cache';

describe('actionLookupService.cache', () => {
  afterEach(() => {
    clearActionLookupCache();
  });

  it('retorna item em cache dentro do TTL', () => {
    cacheActionDbId('uid-1', 'db-1', 1000);
    expect(getCachedActionDbId('uid-1', 1001)).toBe('db-1');
  });

  it('invalida item expirado', () => {
    cacheActionDbId('uid-1', 'db-1', 1000);
    expect(getCachedActionDbId('uid-1', 1000 + 60_000)).toBeNull();
  });

  it('remove item por uid', () => {
    cacheActionDbId('uid-1', 'db-1');
    clearActionIdCacheForUid('uid-1');
    expect(getCachedActionDbId('uid-1')).toBeNull();
  });
});
