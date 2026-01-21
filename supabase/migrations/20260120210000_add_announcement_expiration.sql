-- Add expiration_date to announcements
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS expiration_date DATE DEFAULT NULL;

COMMENT ON COLUMN public.announcements.expiration_date IS 'Data limite de exibição. Se NULL, exibe indefinidamente.';

-- Update RLS/Query performance index if needed
CREATE INDEX IF NOT EXISTS idx_announcements_expiration ON public.announcements(expiration_date);
