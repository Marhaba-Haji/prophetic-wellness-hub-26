
-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_admin_user_id UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all admins
CREATE POLICY "Admins can view admins" 
  ON public.admins 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );
