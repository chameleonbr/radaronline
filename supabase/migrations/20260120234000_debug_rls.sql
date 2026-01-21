-- DEBUG: Make announcements visible to EVERYONE authenticated
DROP POLICY IF EXISTS "announcements_select_authenticated" ON public.announcements;

CREATE POLICY "announcements_select_authenticated"
ON public.announcements
FOR SELECT
TO authenticated
USING (true); -- Allow EVERYTHING
