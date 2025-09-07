
-- Add missing SEO and content fields to the blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS og_type TEXT DEFAULT 'article',
ADD COLUMN IF NOT EXISTS twitter_title TEXT,
ADD COLUMN IF NOT EXISTS twitter_description TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_card TEXT DEFAULT 'summary_large_image',
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS robots_meta TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS readability_score INTEGER,
ADD COLUMN IF NOT EXISTS seo_score INTEGER;

-- Create an index on the slug for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- Create an index on published status and date for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published, published_date);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);

-- Enable RLS (Row Level Security) on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published blogs
CREATE POLICY "Allow public read access to published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (published = true);

-- Create policy to allow admin full access (assuming admins table exists)
CREATE POLICY "Allow admin full access to blogs" 
  ON public.blogs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE user_id = auth.uid()
    )
  );
