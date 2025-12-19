import { createClient } from '@supabase/supabase-js';

// As chaves que você já colocou no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('⚠️ Variáveis do Supabase não encontradas no .env. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Mantém o usuário logado mesmo após refresh
    autoRefreshToken: true, // Renova token automaticamente
    detectSessionInUrl: true, // Detecta sessão na URL (útil para redirects)
    storage: window.localStorage, // Onde salvar a sessão
  },
});


