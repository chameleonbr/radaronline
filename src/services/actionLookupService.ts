
import { logWarn } from '../lib/logger';
import {
  cacheActionDbId,
  clearActionIdCacheForUid,
  getCachedActionDbId,
} from './actionLookup/actionLookupService.cache';
import { findActionDbIdByUid } from './actionLookup/actionLookupService.repositories';

export async function getActionDbIdByUid(uid: string): Promise<string | null> {
  const now = Date.now();
  const cachedId = getCachedActionDbId(uid, now);
  if (cachedId) {
    return cachedId;
  }

  try {
    const actionDbId = await findActionDbIdByUid(uid);
    if (!actionDbId) {
      return null;
    }

    cacheActionDbId(uid, actionDbId, now);
    return actionDbId;
  } catch (error) {
    logWarn('actionLookupService', 'Erro ao buscar UUID interno da acao pelo UID', { uid, error });
    return null;
  }
}

export { clearActionIdCacheForUid };





