-- Add package pricing tiers to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS price_3 numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_6 numeric NOT NULL DEFAULT 0;

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  total_orders integer NOT NULL DEFAULT 0,
  total_spent numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view customers"
  ON public.customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can insert customers"
  ON public.customers FOR INSERT TO authenticated
  WITH CHECK (public.is_authenticated_staff(auth.uid()));

CREATE POLICY "Staff can update customers"
  ON public.customers FOR UPDATE TO authenticated
  USING (public.is_authenticated_staff(auth.uid()));

CREATE POLICY "Admin can delete customers"
  ON public.customers FOR DELETE TO authenticated
  USING (public.is_admin_or_owner(auth.uid()));

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add columns to sales
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE;

-- Allow staff to update sales (needed to backfill customer_id after upsert)
CREATE POLICY "Staff can update sales"
  ON public.sales FOR UPDATE TO authenticated
  USING (public.is_authenticated_staff(auth.uid()));