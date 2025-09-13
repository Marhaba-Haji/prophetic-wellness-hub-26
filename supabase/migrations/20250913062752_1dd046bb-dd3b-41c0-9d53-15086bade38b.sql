-- Add payment columns to appointments table
ALTER TABLE public.appointments 
ADD COLUMN payment_id TEXT,
ADD COLUMN payment_amount DECIMAL(10,2);

-- Add index for payment_id for faster lookups
CREATE INDEX idx_appointments_payment_id ON public.appointments(payment_id);

-- Add comment for the new columns
COMMENT ON COLUMN public.appointments.payment_id IS 'Razorpay payment ID for the consultation fee';
COMMENT ON COLUMN public.appointments.payment_amount IS 'Amount paid for consultation in INR';