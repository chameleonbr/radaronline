-- ==========================================
-- SCRIPT DE CORREÇÃO DE PERMISSÕES (Login 403)
-- ==========================================
-- Execute este script no SQL Editor do Supabase para corrigir 
-- o erro de "Forbidden" ao carregar o perfil no login.

-- 1. Habilitar RLS na tabela (garantia de segurança)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Conceder permissões básicas de acesso ao schema e tabela
-- Necessário para que a role 'authenticated' consiga fazer queries
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT UPDATE ON public.profiles TO authenticated;

-- 3. Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 4. Criar política: Usuário vê seu próprio perfil
-- Essencial para o login carregar os dados
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ( 
  auth.uid() = id 
);

-- 5. Criar política: Usuário atualiza seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- 6. (Opcional) Política para Admins verem todos (evita 403 em listagens)
-- CUIDADO: Se sua tabela profiles tiver coluna 'role', isso pode criar recursão infinita se não usar security definer function.
-- Por segurança, descomente a linha abaixo APENAS se tiver certeza ou use uma função segura.
-- CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'service_role'); 
-- (Nota: A policy acima é apenas exemplo. Geralmente admins são verificados via claim ou tabela separada)

-- Verificação final
SELECT 'Permissões aplicadas com sucesso!' as status;
