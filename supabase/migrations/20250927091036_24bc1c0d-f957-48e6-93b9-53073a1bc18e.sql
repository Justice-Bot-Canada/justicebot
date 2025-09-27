-- Create payments table for tracking PayPal transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  payment_provider TEXT NOT NULL DEFAULT 'paypal',
  payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payer_id TEXT,
  captured_at TIMESTAMP WITH TIME ZONE,
  paypal_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = payments.user_id 
    AND auth.uid() = auth.users.id
  )
);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = payments.user_id 
    AND auth.uid() = auth.users.id
  )
);

CREATE POLICY "System can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);