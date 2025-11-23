-- Enable RLS on admins table for audit trail protection
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin audit table
CREATE POLICY "Admins can view admin table"
ON public.admins
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can modify admin tracking records
CREATE POLICY "Admins can manage admin table"
ON public.admins
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));