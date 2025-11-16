-- Add user_number to track signup order for free tier
ALTER TABLE public.cases ADD COLUMN user_number INTEGER;

-- Create a function to get user signup number
CREATE OR REPLACE FUNCTION public.get_user_signup_number(user_email TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    signup_number INTEGER;
BEGIN
    -- Check if user already has a number assigned through any case
    SELECT DISTINCT user_number INTO signup_number
    FROM public.cases c
    JOIN auth.users u ON c.user_id = u.id
    WHERE u.email = user_email AND c.user_number IS NOT NULL
    LIMIT 1;
    
    -- If no number assigned, get the next available number
    IF signup_number IS NULL THEN
        SELECT COALESCE(MAX(user_number), 0) + 1 INTO signup_number
        FROM public.cases
        WHERE user_number IS NOT NULL;
        
        -- Update all cases for this user with the new number
        UPDATE public.cases
        SET user_number = signup_number
        WHERE user_id IN (
            SELECT id FROM auth.users WHERE email = user_email
        );
    END IF;
    
    RETURN signup_number;
END;
$$;

-- Create a view to check if user qualifies for free tier
CREATE OR REPLACE VIEW public.user_free_tier_status AS
SELECT 
    u.id as user_id,
    u.email,
    COALESCE(c.user_number, 999999) as signup_number,
    CASE 
        WHEN COALESCE(c.user_number, 999999) <= 500 THEN true 
        ELSE false 
    END as qualifies_for_free
FROM auth.users u
LEFT JOIN public.cases c ON u.id = c.user_id
WHERE c.user_number IS NOT NULL OR c.user_number IS NULL;;
