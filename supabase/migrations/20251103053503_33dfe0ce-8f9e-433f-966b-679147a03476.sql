-- Create product_variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL, -- e.g., "Size", "Color", "Weight"
  variant_value TEXT NOT NULL, -- e.g., "Large", "Red", "500g"
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  featured_image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view product variants"
  ON public.product_variants
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product variants"
  ON public.product_variants
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);

-- Create trigger for updated_at
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_products_updated_at();