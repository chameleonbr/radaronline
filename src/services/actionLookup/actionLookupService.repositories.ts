import { getPlatformClient } from '../platformClient';

const platformClient = getPlatformClient;

export async function findActionDbIdByUid(uid: string): Promise<string | null> {
  const { data, error } = await platformClient()
    .from('actions')
    .select('id')
    .eq('uid', uid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id || null;
}
