-- Create table for tracking abandoned payments
CREATE TABLE IF NOT EXISTS public.abandoned_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  consultation_fee_amount INTEGER DEFAULT 299,
  payment_status TEXT DEFAULT 'abandoned',
  abandonment_reason TEXT, -- 'modal_closed', 'payment_failed', 'timeout', etc.
  session_id TEXT, -- To track user sessions
  user_agent TEXT, -- Browser information
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  retargeted BOOLEAN DEFAULT false,
  retargeted_at TIMESTAMP WITH TIME ZONE,
  retargeting_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_abandoned_payments_email ON public.abandoned_payments(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_payments_phone ON public.abandoned_payments(phone);
CREATE INDEX IF NOT EXISTS idx_abandoned_payments_created_at ON public.abandoned_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_abandoned_payments_retargeted ON public.abandoned_payments(retargeted);
CREATE INDEX IF NOT EXISTS idx_abandoned_payments_payment_status ON public.abandoned_payments(payment_status);

-- Enable Row Level Security
ALTER TABLE public.abandoned_payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert abandoned payments (for tracking)
CREATE POLICY "Anyone can insert abandoned payments" 
  ON public.abandoned_payments 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

-- Create policy to allow admins to view all abandoned payments
CREATE POLICY "Admins can view abandoned payments" 
  ON public.abandoned_payments 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ) OR 
    (auth.jwt() ->> 'user_metadata'->>'is_super_admin')::boolean = true
  );

-- Create policy to allow admins to update abandoned payments (for retargeting tracking)
CREATE POLICY "Admins can update abandoned payments" 
  ON public.abandoned_payments 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ) OR 
    (auth.jwt() ->> 'user_metadata'->>'is_super_admin')::boolean = true
  );
