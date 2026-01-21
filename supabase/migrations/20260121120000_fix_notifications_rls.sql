-- Fix RLS policies for user_requests to allow admins to send notifications

-- Enable RLS
ALTER TABLE public.user_requests ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO AVOID CONFLICTS
-- This ensures we can run this migration safely multiple times
DROP POLICY IF EXISTS "Admins can insert notifications for any user" ON public.user_requests;
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.user_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.user_requests;
DROP POLICY IF EXISTS "Users and Admins can view requests" ON public.user_requests; -- Clean up potential duplicate naming
DROP POLICY IF EXISTS "Admins can update requests" ON public.user_requests;

-- 1. INSERT POLICY FOR ADMINS (SENDING NOTIFICATIONS)
-- Allows admins to insert records for ANY user_id (e.g. notifications)
CREATE POLICY "Admins can insert notifications for any user" ON public.user_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        is_admin_or_superadmin()
    );

-- 2. INSERT POLICY FOR USERS (REQUESTS)
-- Allows users to insert records only for themselves
CREATE POLICY "Users can insert their own requests" ON public.user_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
    );

-- 3. SELECT POLICY (ADMINS SEE ALL, USERS SEE THEIRS)
CREATE POLICY "Users and Admins can view requests" ON public.user_requests
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() 
        OR is_admin_or_superadmin()
    );

-- 4. UPDATE POLICY (ADMINS RESOLVE/REJECT)
CREATE POLICY "Admins can update requests" ON public.user_requests
    FOR UPDATE
    TO authenticated
    USING (
        is_admin_or_superadmin()
    )
    WITH CHECK (
        is_admin_or_superadmin()
    );
