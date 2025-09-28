-- Update free tier eligibility to 800 users instead of 500
CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    
    -- Return true if user is in first 800 (changed from 500)
    RETURN user_signup_number <= 800;
END;
$function$;