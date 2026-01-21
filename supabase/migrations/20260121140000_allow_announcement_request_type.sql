-- Fix user_requests constraint to allow 'announcement' type
-- This allows admins to send mural notifications to users

-- Drop the existing constraint if it exists
ALTER TABLE public.user_requests 
DROP CONSTRAINT IF EXISTS user_requests_request_type_check;

-- Recreate the constraint with the new allowed values
-- Including: 'mention', 'announcement', and any other existing types
ALTER TABLE public.user_requests
ADD CONSTRAINT user_requests_request_type_check 
CHECK (request_type IN ('mention', 'announcement', 'request', 'feedback', 'support'));

-- Note: If there are other request_type values in use, add them to the list above
