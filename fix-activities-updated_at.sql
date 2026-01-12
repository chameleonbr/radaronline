-- ========================================
-- CORREÇÃO DEFINITIVA: Erro "record new has no field updated_at"
-- Execute este script no SQL Editor do Supabase
-- Data: 11/01/2026
-- ========================================
-- 
-- 🔍 DIAGNÓSTICO: O trigger "update_objects_updated_at" na tabela "objects"
--    está usando a função update_updated_at_column(), mas a tabela objects
--    (do Supabase Storage) NÃO tem a coluna updated_at!
--
-- ========================================

-- ========================================
-- PASSO 1: REMOVER O TRIGGER PROBLEMÁTICO NA TABELA OBJECTS
-- Este é o causador do erro!
-- ========================================
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS update_objects_updated_at ON public.objects;

-- ========================================
-- PASSO 2: REMOVER TRIGGERS NAS TABELAS ACTIVITIES E OBJECTIVES
-- ========================================
DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
DROP TRIGGER IF EXISTS update_objectives_updated_at ON public.objectives;
DROP TRIGGER IF EXISTS set_updated_at ON public.activities;
DROP TRIGGER IF EXISTS set_updated_at ON public.objectives;

-- ========================================
-- PASSO 3: REMOVER A FUNÇÃO ANTIGA
-- ========================================
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ========================================
-- PASSO 4: CRIAR FUNÇÃO TRIGGER NOVA E SEGURA
-- (Com verificação do nome da tabela)
-- ========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Só atualiza updated_at para tabelas que realmente têm essa coluna
    IF TG_TABLE_NAME IN ('activities', 'objectives') THEN
        NEW.updated_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Trigger function para atualizar automaticamente a coluna updated_at. 
Usar APENAS em tabelas: activities, objectives. NÃO usar em storage.objects!';

-- ========================================
-- PASSO 5: CRIAR TRIGGERS APENAS NAS TABELAS CORRETAS
-- ========================================
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_objectives_updated_at
    BEFORE UPDATE ON public.objectives
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- PASSO 6: ATUALIZAR REGISTROS EXISTENTES
-- ========================================
UPDATE public.activities 
SET updated_at = COALESCE(updated_at, created_at, NOW()) 
WHERE updated_at IS NULL;

UPDATE public.objectives 
SET updated_at = COALESCE(updated_at, created_at, NOW()) 
WHERE updated_at IS NULL;

-- ========================================
-- PASSO 7: VERIFICAÇÃO FINAL
-- ========================================

-- Verificar que o trigger problemático foi removido
SELECT 
    'TRIGGERS ATUAIS' AS status,
    c.relname AS tabela,
    t.tgname AS trigger,
    p.proname AS funcao
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE NOT t.tgisinternal
AND p.proname = 'update_updated_at_column'
ORDER BY c.relname;

-- Deve mostrar APENAS activities e objectives, NÃO objects!
