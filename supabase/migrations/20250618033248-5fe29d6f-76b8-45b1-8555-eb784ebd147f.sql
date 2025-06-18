
-- Drop the current problematic policies
DROP POLICY IF EXISTS "Allow admin full access to blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;

-- Create new simplified policies
-- Allow public read access to published blogs (no auth required)
CREATE POLICY "Public read published blogs" ON public.blogs
    FOR SELECT USING (published = true);

-- Allow any authenticated user to manage blogs (admins should be authenticated)
CREATE POLICY "Authenticated users manage blogs" ON public.blogs
    FOR ALL TO authenticated USING (true);

-- Allow anonymous users to read published blogs
CREATE POLICY "Anonymous read published blogs" ON public.blogs
    FOR SELECT TO anon USING (published = true);
