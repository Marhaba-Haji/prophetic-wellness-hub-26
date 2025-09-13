-- Create payment_attempts table to track all payment interactions
CREATE TABLE public.payment_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  amount NUMERIC NOT NULL DEFAULT 299,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'initiated', -- initiated, completed, failed, abandoned
  payment_method TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_attempts
CREATE POLICY "Allow admins to view all payment attempts" 
ON public.payment_attempts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE admins.user_id = auth.uid()
));

CREATE POLICY "Allow public to insert payment attempts" 
ON public.payment_attempts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public to update payment attempts" 
ON public.payment_attempts 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_payment_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_attempts_updated_at
    BEFORE UPDATE ON public.payment_attempts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_payment_attempts_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_payment_attempts_status ON public.payment_attempts(payment_status);
CREATE INDEX idx_payment_attempts_email ON public.payment_attempts(customer_email);
CREATE INDEX idx_payment_attempts_created_at ON public.payment_attempts(created_at DESC);