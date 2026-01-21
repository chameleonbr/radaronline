-- Create a secure function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the policy to use this function
DROP POLICY IF EXISTS "announcements_select_authenticated" ON public.announcements;

CREATE POLICY "announcements_select_authenticated"
ON public.announcements
FOR SELECT
TO authenticated
USING (
    -- Normal users see active & non-expired
    (is_active = true AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE))
    OR 
    -- Admins see EVERYTHING (is_admin function bypasses RLS on profiles)
    public.is_admin()
);
