-- Drop ALL existing policies on affected tables first
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "admin_bypass__public__user_roles" ON user_roles;

DROP POLICY IF EXISTS "Admins can manage entitlements" ON entitlements;
DROP POLICY IF EXISTS "admin_bypass__public__entitlements" ON entitlements;
DROP POLICY IF EXISTS "Users can view their own entitlements" ON entitlements;

DROP POLICY IF EXISTS "Users can view their own applications" ON low_income_applications;
DROP POLICY IF EXISTS "Users can update their own pending applications" ON low_income_applications;
DROP POLICY IF EXISTS "admin_bypass__public__low_income_applications" ON low_income_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON low_income_applications;

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "admin_bypass__public__profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view only their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

DROP POLICY IF EXISTS "Admins can view all agreements" ON user_agreements;
DROP POLICY IF EXISTS "admin_bypass__public__user_agreements" ON user_agreements;
DROP POLICY IF EXISTS "Users can view their own agreements" ON user_agreements;
DROP POLICY IF EXISTS "System can insert agreements" ON user_agreements;

-- Now drop and recreate the function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create is_admin helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE  
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  );
$$;

-- Recreate user_roles policies
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON user_roles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_bypass__public__user_roles"
ON user_roles FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Recreate entitlements policies
CREATE POLICY "Users can view their own entitlements"
ON entitlements FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage entitlements"
ON entitlements FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_bypass__public__entitlements"
ON entitlements FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Recreate low_income_applications policies  
CREATE POLICY "Users can create their own applications"
ON low_income_applications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
ON low_income_applications FOR SELECT TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own pending applications"
ON low_income_applications FOR UPDATE TO authenticated
USING (((auth.uid() = user_id) AND (status = 'pending'::text)) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (((auth.uid() = user_id) AND (status = 'pending'::text)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_bypass__public__low_income_applications"
ON low_income_applications FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Recreate profiles policies
CREATE POLICY "Users can view only their own profile"
ON profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_bypass__public__profiles"
ON profiles FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Recreate user_agreements policies
CREATE POLICY "Users can view their own agreements"
ON user_agreements FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert agreements"
ON user_agreements FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all agreements"
ON user_agreements FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_bypass__public__user_agreements"
ON user_agreements FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;;
