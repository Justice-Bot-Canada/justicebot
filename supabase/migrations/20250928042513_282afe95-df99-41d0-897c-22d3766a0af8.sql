-- Create user feedback and reviews table
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug_report', 'feature_request', 'testimonial', 'complaint', 'suggestion')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  case_id UUID,
  is_public BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment audit table for better tracking
CREATE TABLE public.payment_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_audit ENABLE ROW LEVEL SECURITY;

-- Create policies for user_feedback
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (true); -- Allow anyone to submit feedback

CREATE POLICY "Users can update their own feedback" 
ON public.user_feedback 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create policies for payment_audit (read-only for users)
CREATE POLICY "Users can view their own payment audit" 
ON public.payment_audit 
FOR SELECT 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_feedback_updated_at
BEFORE UPDATE ON public.user_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_type ON public.user_feedback(feedback_type);
CREATE INDEX idx_user_feedback_rating ON public.user_feedback(rating);
CREATE INDEX idx_user_feedback_public ON public.user_feedback(is_public);
CREATE INDEX idx_payment_audit_payment_id ON public.payment_audit(payment_id);
CREATE INDEX idx_payment_audit_user_id ON public.payment_audit(user_id);