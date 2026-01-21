-- =============================================
-- FULL MURAL SETUP (CONSOLIDATED)
-- =============================================

-- 1. Create Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'news' CHECK (type IN ('news', 'alert', 'maintenance', 'tutorial')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
    display_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE DEFAULT NULL, -- NULL means display indefinitely
    target_micros TEXT[] DEFAULT ARRAY[]::TEXT[], -- Empty array = all micros
    link_url TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE public.announcements IS 'Admin-created messages for the Mural da Rede (News Feed)';
COMMENT ON COLUMN public.announcements.target_micros IS 'Array of microregiao IDs. Empty array means visible to all.';
COMMENT ON COLUMN public.announcements.expiration_date IS 'Display limit. If NULL, displays forever (or until manually archived).';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_display_date ON public.announcements(display_date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_expiration ON public.announcements(expiration_date);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policies

-- SELECT: Authenticated users can read active announcements
DROP POLICY IF EXISTS "announcements_select_authenticated" ON public.announcements;
CREATE POLICY "announcements_select_authenticated"
ON public.announcements
FOR SELECT
TO authenticated
USING (
    (is_active = true AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE))
    OR 
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    )
);

-- INSERT: Only admins/superadmins
DROP POLICY IF EXISTS "announcements_insert_admin" ON public.announcements;
CREATE POLICY "announcements_insert_admin"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    )
);

-- UPDATE: Only admins/superadmins
DROP POLICY IF EXISTS "announcements_update_admin" ON public.announcements;
CREATE POLICY "announcements_update_admin"
ON public.announcements
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    )
);

-- DELETE: Only superadmins
DROP POLICY IF EXISTS "announcements_delete_superadmin" ON public.announcements;
CREATE POLICY "announcements_delete_superadmin"
ON public.announcements
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'superadmin'
    )
);

-- 2. Create Macrorregioes Table (Analyst Mapping)
CREATE TABLE IF NOT EXISTS public.macrorregioes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    codigo TEXT,
    focal_point_name TEXT,
    focal_point_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.macrorregioes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Macrorregioes viewable by authenticated users" ON public.macrorregioes;
CREATE POLICY "Macrorregioes viewable by authenticated users" 
ON public.macrorregioes FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Macrorregioes editable by admins" ON public.macrorregioes;
CREATE POLICY "Macrorregioes editable by admins" 
ON public.macrorregioes FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);

-- Insert Data for Macrorregioes and Assignments
INSERT INTO public.macrorregioes (id, codigo, nome, focal_point_name) VALUES
('MAC01', '3101', 'Sul', 'Jonathan Souza'),
('MAC02', '3102', 'Centro Sul', 'Jonathan Souza'),
('MAC03', '3103', 'Centro', 'Gabrielle Guimarães Gonçalves'),
('MAC04', '3104', 'Jequitinhonha', 'Gabrielle Guimarães Gonçalves'),
('MAC05', '3105', 'Oeste', 'Jonathan Souza'),
('MAC06', '3106', 'Leste', 'João Paulo Gomes Carvalho'),
('MAC07', '3107', 'Sudeste', 'João Paulo Gomes Carvalho'),
('MAC08', '3108', 'Norte', 'João Paulo Gomes Carvalho'),
('MAC09', '3109', 'Noroeste', 'João Paulo Gomes Carvalho'),
('MAC10', '3110', 'Leste do Sul', 'Gabrielle Guimarães Gonçalves'),
('MAC11', '3111', 'Nordeste', 'Gabrielle Guimarães Gonçalves'),
('MAC12', '3112', 'Triângulo do Sul', 'Jonathan Souza'),
('MAC13', '3113', 'Triângulo do Norte', 'João Paulo Gomes Carvalho'),
('MAC14', '3114', 'Vale do Aço', 'Gabrielle Guimarães Gonçalves'),
('MAC15', '3115', 'Extremo Sul', 'Jonathan Souza'),
('MAC16', '3116', 'Sudoeste', 'Jonathan Souza')
ON CONFLICT (id) DO UPDATE SET
    focal_point_name = EXCLUDED.focal_point_name,
    nome = EXCLUDED.nome,
    updated_at = NOW();

-- Attempt to link profiles automatically
DO $$
DECLARE
    p_id UUID;
BEGIN
    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%Jonathan Souza%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'Jonathan Souza';
    END IF;

    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%Gabrielle Guimarães%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'Gabrielle Guimarães Gonçalves';
    END IF;

    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%João Paulo Gomes%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'João Paulo Gomes Carvalho';
    END IF;
END $$;
