
-- First, let's drop any existing policies on the blogs table to start fresh
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin full access to blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.blogs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.blogs;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.blogs;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.blogs;

-- Create simple RLS policies for the blogs table
-- Allow public read access to published blogs
CREATE POLICY "Allow public read access to published blogs" ON public.blogs
    FOR SELECT USING (published = true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Allow admin full access to blogs" ON public.blogs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Enable RLS on the blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Also fix the admins table policies to prevent recursion
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;
DROP POLICY IF EXISTS "Allow users to manage their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admins;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admins;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.admins;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.admins;

-- Simple policy for admins table
CREATE POLICY "Allow authenticated users to read admins" ON public.admins
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to manage their own admin record" ON public.admins
    FOR ALL USING (auth.uid() = user_id);

-- Enable RLS on the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
