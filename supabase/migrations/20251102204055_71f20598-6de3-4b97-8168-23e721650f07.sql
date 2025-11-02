-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Public can view active categories"
  ON public.categories
  FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.categories
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Public can view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Storage policies for category images
CREATE POLICY "Public can view category images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update category images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'category-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete category images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'category-images' AND auth.uid() IS NOT NULL);

-- Migrate existing product categories to categories table
INSERT INTO public.categories (name, slug, active)
SELECT DISTINCT 
  category as name,
  LOWER(REPLACE(REPLACE(category, ' ', '-'), '&', 'and')) as slug,
  true as active
FROM public.products
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (name) DO NOTHING;

-- Add category_id column to products and create foreign key
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Update products to link to categories table
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE p.category = c.name;

-- Create trigger to update categories updated_at
CREATE OR REPLACE FUNCTION public.update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_categories_updated_at();