-- Create testimonials table for user feedback and success stories
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  
  -- Testimonial content
  name TEXT NOT NULL,
  location TEXT,
  case_type TEXT NOT NULL,
  story TEXT NOT NULL,
  outcome TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Status and moderation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Users can create their own testimonials
CREATE POLICY "Users can create their own testimonials"
  ON public.testimonials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own testimonials
CREATE POLICY "Users can view their own testimonials"
  ON public.testimonials
  FOR SELECT
  USING (auth.uid() = user_id);

-- Everyone can view approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON public.testimonials
  FOR SELECT
  USING (status = 'approved');

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials
  FOR ALL
  USING (is_admin());

-- Create index for performance
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_testimonials_featured ON public.testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_case_type ON public.testimonials(case_type);

-- Add trigger for updated_at
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();