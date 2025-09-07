-- Enable Row Level Security on tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to view all appointments
CREATE POLICY "Admins can view appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ) OR 
    (auth.jwt() ->> 'user_metadata'->>'is_super_admin')::boolean = true
  );

-- Create policy to allow admins to update appointments
CREATE POLICY "Admins can update appointments" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ) OR 
    (auth.jwt() ->> 'user_metadata'->>'is_super_admin')::boolean = true
  );

-- Create policy to allow anyone to insert appointments (for booking form)
CREATE POLICY "Anyone can insert appointments" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true);

-- Create policy to allow admins to view all contact submissions
CREATE POLICY "Admins can view contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ) OR 
    (auth.jwt() ->> 'user_metadata'->>'is_super_admin')::boolean = true
  );

-- Create policy to allow anyone to insert contact submissions (for contact form)
CREATE POLICY "Anyone can insert contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (true); 