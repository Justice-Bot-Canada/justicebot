-- Fix security issues by removing the problematic view and function
DROP VIEW IF EXISTS public.user_free_tier_status;

-- Create a secure function to check free tier eligibility without exposing auth.users
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_signup_number INTEGER;
    current_user_id UUID;
BEGIN
    -- Get current authenticated user
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user already has a signup number
    SELECT user_number INTO user_signup_number
    FROM public.cases
    WHERE user_id = current_user_id AND user_number IS NOT NULL
    LIMIT 1;
    
    -- If no number assigned, assign one
    IF user_signup_number IS NULL THEN
        SELECT COALESCE(MAX(user_number), 0) + 1 INTO user_signup_number
        FROM public.cases
        WHERE user_number IS NOT NULL;
        
        -- Update user's cases with the signup number
        UPDATE public.cases
        SET user_number = user_signup_number
        WHERE user_id = current_user_id;
    END IF;
    
    -- Return true if user is in first 500
    RETURN user_signup_number <= 500;
END;
$$;

-- Remove the problematic function that accessed auth.users
DROP FUNCTION IF EXISTS public.get_user_signup_number(TEXT);;
