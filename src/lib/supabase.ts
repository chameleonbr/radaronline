import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('⚠️ Variáveis do Supabase não encontradas no .env. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

// ✅ CORREÇÃO: Condicionar objeto auth inteiro para evitar edge cases (SSR safe)
const auth =
  typeof window !== 'undefined'
    ? {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      }
    : {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth });


