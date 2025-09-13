-- Fix RLS policies for abandoned_payments table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert abandoned payments" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Admins can view abandoned payments" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Admins can update abandoned payments" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Allow insert for all" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Allow select for authenticated" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Allow update for authenticated" ON public.abandoned_payments;

-- Create simple, working policies
CREATE POLICY "Allow all operations for authenticated users" 
  ON public.abandoned_payments 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert (for tracking)
CREATE POLICY "Allow anonymous insert" 
  ON public.abandoned_payments 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow anonymous users to select (for debugging)
CREATE POLICY "Allow anonymous select" 
  ON public.abandoned_payments 
  FOR SELECT 
  TO anon 
  USING (true);
