import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const isDev = import.meta.env.DEV;
  const message = isDev
    ? 'Supabase environment variables are missing.\n\n' +
      'Create a .env file in project root with:\n' +
      'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      'VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
      'See .env.example for details.'
    : 'Supabase environment variables are not configured.\n\n' +
      'Configure these variables in your deploy environment:\n' +
      '- VITE_SUPABASE_URL\n' +
      '- VITE_SUPABASE_ANON_KEY';

  console.error(message);
  throw new Error(message);
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function createInMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

function getSafeBrowserStorage(): StorageLike {
  if (typeof window === 'undefined') {
    return createInMemoryStorage();
  }

  try {
    const key = '__radar_storage_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    // Fallback for private mode / blocked storage.
    return createInMemoryStorage();
  }
}

const auth =
  typeof window !== 'undefined'
    ? {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: getSafeBrowserStorage(),
      }
    : {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth,
  // Realtime enabled: app uses subscriptions in user_requests.
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'radar-2.0',
    },
  },
});
