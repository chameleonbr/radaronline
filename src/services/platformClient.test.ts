import { describe, expect, it } from 'vitest';

import {
  configurePlatformClient,
  getPlatformClient,
  resetPlatformClient,
  type PlatformClient,
} from './platformClient';

function createMockPlatformClient(): PlatformClient {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    channel: () => ({
      on() {
        return this;
      },
      subscribe: () => ({}),
    }),
    from: () => ({}),
    functions: {
      invoke: async () => ({ data: null, error: null }),
    },
    removeAllChannels: () => Promise.resolve([]),
    removeChannel: () => Promise.resolve('ok'),
    rpc: async () => ({ data: null, error: null }),
    storage: {
      from: () => ({ upload: async () => ({ data: null, error: null }) }),
    },
  } as unknown as PlatformClient;
}

describe('platformClient', () => {
  it('allows overriding the current platform client and restoring the default', () => {
    const originalClient = getPlatformClient();
    const mockClient = createMockPlatformClient();

    configurePlatformClient(mockClient);
    expect(getPlatformClient()).toBe(mockClient);

    resetPlatformClient();
    expect(getPlatformClient()).toBe(originalClient);
  });
});
