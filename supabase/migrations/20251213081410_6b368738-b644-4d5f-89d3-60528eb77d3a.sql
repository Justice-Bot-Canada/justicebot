-- Drop existing restrictive policies on admins table
DROP POLICY IF EXISTS "admins_delete" ON public.admins;
DROP POLICY IF EXISTS "admins_insert" ON public.admins;
DROP POLICY IF EXISTS "admins_select" ON public.admins;
DROP POLICY IF EXISTS "admins_update" ON public.admins;

-- Create proper PERMISSIVE policies that require admin authentication
CREATE POLICY "admins_select_admin_only" 
ON public.admins 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "admins_insert_admin_only" 
ON public.admins 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "admins_update_admin_only" 
ON public.admins 
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admins_delete_admin_only" 
ON public.admins 
FOR DELETE 
TO authenticated
USING (is_admin());

-- Ensure RLS is enforced even for table owner
ALTER TABLE public.admins FORCE ROW LEVEL SECURITY;