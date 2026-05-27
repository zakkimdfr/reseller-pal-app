
-- 1) Hide products.cost_price from anonymous users (column-level grants)
REVOKE SELECT ON public.products FROM anon;
GRANT SELECT (id, name, category, description, selling_price, price_3, price_6, stock, created_at, updated_at)
  ON public.products TO anon;

-- 2) Restrict profiles visibility: own profile, or admin/owner
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin_or_owner(auth.uid()));

-- 3) Revoke EXECUTE on SECURITY DEFINER helper functions from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_owner(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_authenticated_staff(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.generate_invoice_number() FROM anon, public;
