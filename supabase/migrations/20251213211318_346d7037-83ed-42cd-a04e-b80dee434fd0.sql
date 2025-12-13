-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Force RLS on profiles table to block even table owners
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Force RLS on support_tickets table
ALTER TABLE public.support_tickets FORCE ROW LEVEL SECURITY;

-- Drop existing overly permissive policies on profiles if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Create strict RLS policies for profiles - users can only access their own data
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = id);

-- Admin bypass for profiles
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Drop existing support_tickets policies
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.support_tickets;

-- Create strict RLS policies for support_tickets
CREATE POLICY "support_tickets_select_own" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "support_tickets_insert_own" ON public.support_tickets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "support_tickets_update_own" ON public.support_tickets
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "support_tickets_delete_admin" ON public.support_tickets
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Create table to store CanLII case law updates
CREATE TABLE IF NOT EXISTS public.canlii_case_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text NOT NULL,
  title text,
  citation text,
  decision_date date,
  court text,
  jurisdiction text,
  url text,
  keywords text[],
  summary text,
  fetched_at timestamptz DEFAULT now(),
  UNIQUE(case_id)
);

-- Enable RLS on canlii_case_updates
ALTER TABLE public.canlii_case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canlii_case_updates FORCE ROW LEVEL SECURITY;

-- Everyone can read case law updates (public legal information)
CREATE POLICY "canlii_updates_public_read" ON public.canlii_case_updates
  FOR SELECT TO authenticated
  USING (true);

-- Only system/admin can insert/update
CREATE POLICY "canlii_updates_admin_write" ON public.canlii_case_updates
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create table for legal updates tracking
CREATE TABLE IF NOT EXISTS public.legal_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL, -- 'canlii', 'ontario_laws', etc.
  update_type text NOT NULL, -- 'new_case', 'law_amendment', 'new_regulation'
  title text NOT NULL,
  description text,
  effective_date date,
  jurisdiction text,
  affected_areas text[], -- 'ltb', 'hrto', 'family', etc.
  url text,
  is_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_updates FORCE ROW LEVEL SECURITY;

CREATE POLICY "legal_updates_public_read" ON public.legal_updates
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "legal_updates_admin_write" ON public.legal_updates
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());