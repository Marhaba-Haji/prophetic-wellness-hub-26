-- Fix search_path for the update function by recreating it properly
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;