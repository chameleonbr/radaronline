-- =============================================
-- Migration: Create Announcements Table
-- Purpose: Store admin-created messages for the "Mural da Rede"
-- =============================================

-- Create table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'news' CHECK (type IN ('news', 'alert', 'maintenance', 'tutorial')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
    display_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_micros TEXT[] DEFAULT ARRAY[]::TEXT[], -- Empty array = all micros
    link_url TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comment on table
COMMENT ON TABLE public.announcements IS 'Admin-created messages for the Mural da Rede (News Feed)';
COMMENT ON COLUMN public.announcements.target_micros IS 'Array of microregiao IDs. Empty array means visible to all.';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_display_date ON public.announcements(display_date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- SELECT: Authenticated users can read active announcements
CREATE POLICY "announcements_select_authenticated"
ON public.announcements
FOR SELECT
TO authenticated
USING (is_active = true);

-- INSERT: Only admins/superadmins can insert
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

-- UPDATE: Only admins/superadmins can update
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

-- DELETE: Only superadmins can delete
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
