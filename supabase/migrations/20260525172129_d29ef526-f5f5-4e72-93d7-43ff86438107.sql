
-- Helper: admin check (security definer to bypass RLS on admins inside policies safely)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = _user_id);
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- ============ admins ============
DROP POLICY IF EXISTS "Allow admin registration" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;
DROP POLICY IF EXISTS "Allow users to manage their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Users can insert their own admin record" ON public.admins;
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can view other admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can update their own record" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete other admins" ON public.admins;

CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert admins" ON public.admins FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update admins" ON public.admins FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete admins" ON public.admins FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============ abandoned_payments ============
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Allow anonymous select" ON public.abandoned_payments;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.abandoned_payments;

CREATE POLICY "Public can insert abandoned payments" ON public.abandoned_payments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read abandoned payments" ON public.abandoned_payments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update abandoned payments" ON public.abandoned_payments FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete abandoned payments" ON public.abandoned_payments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ appointments ============
DROP POLICY IF EXISTS "Allow delete for all users" ON public.appointments;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.appointments;
DROP POLICY IF EXISTS "Allow select for all users" ON public.appointments;
DROP POLICY IF EXISTS "Allow update for all users" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.appointments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.appointments;

CREATE POLICY "Public can book appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ contact_submissions ============
DROP POLICY IF EXISTS "Allow delete for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow select for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow update for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

CREATE POLICY "Public can submit contact forms" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ payment_attempts ============
DROP POLICY IF EXISTS "Allow public to update payment attempts" ON public.payment_attempts;
DROP POLICY IF EXISTS "Allow public to insert payment attempts" ON public.payment_attempts;
DROP POLICY IF EXISTS "Allow admins to view all payment attempts" ON public.payment_attempts;

CREATE POLICY "Public can insert payment attempts" ON public.payment_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read payment attempts" ON public.payment_attempts FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update payment attempts" ON public.payment_attempts FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete payment attempts" ON public.payment_attempts FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ categories ============
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ customers ============
DROP POLICY IF EXISTS "Authenticated users can manage customers" ON public.customers;
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ orders ============
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ order_items ============
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ products ============
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ product_variants ============
DROP POLICY IF EXISTS "Authenticated users can manage product variants" ON public.product_variants;
CREATE POLICY "Admins can manage product variants" ON public.product_variants FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ storage: remove broad SELECT (bucket listing). Public URLs still work via the public bucket flag. ============
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view category images" ON storage.objects;

-- ============ trigger functions: switch to SECURITY INVOKER and lock down EXECUTE ============
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_categories_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_products_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_categories_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_payment_attempts_updated_at() FROM PUBLIC, anon, authenticated;
