-- Create macrorregioes table
CREATE TABLE IF NOT EXISTS public.macrorregioes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    codigo TEXT,
    focal_point_name TEXT,
    focal_point_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.macrorregioes ENABLE ROW LEVEL SECURITY;

-- Create policies (viewable by everyone/authenticated, editable by admins)
CREATE POLICY "Macrorregioes viewable by authenticated users" 
ON public.macrorregioes FOR SELECT 
TO authenticated 
USING (true);

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

-- Insert Data
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
    nome = EXCLUDED.nome, -- Ensure names match just in case
    updated_at = NOW();

-- Attempt to link to profiles table
DO $$
DECLARE
    p_id UUID;
    user_record RECORD;
BEGIN
    -- Update Jonathan Souza
    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%Jonathan Souza%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'Jonathan Souza';
    END IF;

    -- Update Gabrielle
    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%Gabrielle Guimarães%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'Gabrielle Guimarães Gonçalves';
    END IF;

    -- Update João Paulo
    SELECT id INTO p_id FROM public.profiles WHERE nome ILIKE '%João Paulo Gomes%' LIMIT 1;
    IF p_id IS NOT NULL THEN
        UPDATE public.macrorregioes SET focal_point_id = p_id WHERE focal_point_name = 'João Paulo Gomes Carvalho';
    END IF;
END $$;
