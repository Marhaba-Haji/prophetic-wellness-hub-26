-- Add payment-related fields to the appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_order_id TEXT,
ADD COLUMN IF NOT EXISTS payment_signature TEXT,
ADD COLUMN IF NOT EXISTS consultation_fee_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consultation_fee_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_appointments_payment_id ON public.appointments(payment_id);

-- Create index on consultation_fee_paid for filtering
CREATE INDEX IF NOT EXISTS idx_appointments_consultation_fee_paid ON public.appointments(consultation_fee_paid);

-- Update the status field to include payment-related statuses
-- This is a comment - the status field already exists and can be updated via application logic
