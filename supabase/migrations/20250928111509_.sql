-- Allow admin users to view all profiles for the admin dashboard
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update existing profile policy to be less restrictive for admins
DROP POLICY IF EXISTS "Users can view their own profiles only" ON public.profiles;

CREATE POLICY "Users can view their own profiles or admins can view all" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));;
