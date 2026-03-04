import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';

export type PlatformClient = Pick<
  SupabaseClient<any, any, any>,
  'from' | 'rpc' | 'auth' | 'functions' | 'storage' | 'channel' | 'removeChannel' | 'removeAllChannels'
>;

const defaultPlatformClient: PlatformClient = supabase as PlatformClient;

let currentPlatformClient: PlatformClient = defaultPlatformClient;

export function getPlatformClient(): PlatformClient {
  return currentPlatformClient;
}

export function configurePlatformClient(nextClient: PlatformClient): void {
  currentPlatformClient = nextClient;
}

export function resetPlatformClient(): void {
  currentPlatformClient = defaultPlatformClient;
}
