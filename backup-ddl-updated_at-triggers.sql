-- ========================================
-- BACKUP DDL: Função e Triggers updated_at
-- Gerado em: 11/01/2026
-- Status: FUNCIONANDO CORRETAMENTE
-- ========================================

-- ========================================
-- FUNÇÃO TRIGGER
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
Usar APENAS em tabelas: activities, objectives. 
NÃO usar em storage.objects!';

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para activities
-- DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON public.activities 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para objectives
-- DROP TRIGGER IF EXISTS update_objectives_updated_at ON public.objectives;
CREATE TRIGGER update_objectives_updated_at 
    BEFORE UPDATE ON public.objectives 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO (para confirmar que está OK)
-- ========================================
-- SELECT 
--     c.relname AS tabela, 
--     t.tgname AS trigger, 
--     p.proname AS funcao
-- FROM pg_trigger t
-- JOIN pg_class c ON t.tgrelid = c.oid
-- JOIN pg_proc p ON t.tgfoid = p.oid
-- JOIN pg_namespace n ON c.relnamespace = n.oid
-- WHERE NOT t.tgisinternal
-- AND p.proname = 'update_updated_at_column'
-- ORDER BY c.relname;

-- ========================================
-- NOTA IMPORTANTE
-- ========================================
-- O erro "record 'new' has no field 'updated_at'" era causado por um
-- trigger na tabela storage.objects que não possui a coluna updated_at.
-- 
-- NUNCA adicione esta função como trigger em tabelas que não têm
-- a coluna updated_at!
-- ========================================
