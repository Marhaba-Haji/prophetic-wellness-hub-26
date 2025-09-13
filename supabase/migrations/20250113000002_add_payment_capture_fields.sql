-- Add payment capture fields to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS payment_captured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_captured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_captured_amount INTEGER,
ADD COLUMN IF NOT EXISTS payment_capture_error TEXT;

-- Create index on payment_captured for filtering
CREATE INDEX IF NOT EXISTS idx_appointments_payment_captured ON public.appointments(payment_captured);

-- Create index on payment_captured_at for analytics
CREATE INDEX IF NOT EXISTS idx_appointments_payment_captured_at ON public.appointments(payment_captured_at);
