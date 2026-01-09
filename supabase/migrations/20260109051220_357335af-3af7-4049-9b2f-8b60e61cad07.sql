-- Add more columns to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS story text;

-- Add more columns to tutorial_videos
ALTER TABLE public.tutorial_videos ADD COLUMN IF NOT EXISTS pathway_type text;
ALTER TABLE public.tutorial_videos ADD COLUMN IF NOT EXISTS step_number integer;

-- Add more columns to programs
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS disable_pricing boolean DEFAULT false;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS disable_ai_beyond_procedural boolean DEFAULT false;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS show_no_legal_advice_banner boolean DEFAULT true;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS cohort_batch text;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS max_users integer;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}'::jsonb;

-- Add more columns to evidence_metadata
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS doc_type text;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS parties jsonb;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS dates jsonb;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS extracted_text text;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS confidence_score numeric;
ALTER TABLE public.evidence_metadata ADD COLUMN IF NOT EXISTS flags jsonb;

-- Add content column to support_messages
ALTER TABLE public.support_messages DROP COLUMN IF EXISTS message;
ALTER TABLE public.support_messages RENAME COLUMN content TO message;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS content text;
UPDATE public.support_messages SET content = message WHERE content IS NULL;

-- Create admin functions
CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN (
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', ur.user_id,
        'role', ur.role,
        'created_at', ur.created_at
      )
    ), '[]'::jsonb)
    FROM public.user_roles ur
    WHERE ur.role = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_admin_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = p_user_id AND role = 'admin';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_program_stats(p_program_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN jsonb_build_object(
    'program_id', p_program_id,
    'stats', '{}'::jsonb
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.export_program_summary(p_program_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN jsonb_build_object(
    'program_id', p_program_id,
    'summary', '{}'::jsonb
  );
END;
$$;