
-- 1. Cleanup duplicate roles: keep highest role per user (admin > owner > staff)
WITH ranked AS (
  SELECT id, user_id, role,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'owner' THEN 2 WHEN 'staff' THEN 3 END
    ) AS rn
  FROM public.user_roles
)
DELETE FROM public.user_roles WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2. Fix get_user_role to return highest role deterministically
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'owner' THEN 2 WHEN 'staff' THEN 3 END
  LIMIT 1
$$;

-- 3. Fix handle_new_user: first user = admin, others = staff, no double assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_count int;
  assigned_role app_role;
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );

  SELECT count(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'staff';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Unique constraint on user_roles to prevent duplicates
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_role_unique;
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);

-- 5. Constrain inventory_transactions.type
ALTER TABLE public.inventory_transactions
  DROP CONSTRAINT IF EXISTS inventory_transactions_type_check;
ALTER TABLE public.inventory_transactions
  ADD CONSTRAINT inventory_transactions_type_check
  CHECK (type IN ('IN', 'OUT', 'ADJUST'));

-- 6. Invoice number sequence + generator
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  seq_val bigint;
BEGIN
  seq_val := nextval('public.invoice_seq');
  RETURN 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq_val::text, 4, '0');
END;
$$;

-- 7. Trigger to auto-fill invoice_number on sales insert if null
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_invoice_number ON public.sales;
CREATE TRIGGER trg_set_invoice_number
BEFORE INSERT ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

ALTER TABLE public.sales
  DROP CONSTRAINT IF EXISTS sales_invoice_number_unique;
ALTER TABLE public.sales
  ADD CONSTRAINT sales_invoice_number_unique UNIQUE (invoice_number);

-- 8. Stock validation + auto-decrement on sales_items insert
CREATE OR REPLACE FUNCTION public.handle_sales_item_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_stock int;
  product_name text;
BEGIN
  SELECT stock, name INTO current_stock, product_name
  FROM public.products WHERE id = NEW.product_id FOR UPDATE;

  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Produk tidak ditemukan';
  END IF;

  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Stok tidak cukup untuk produk %: tersedia %, dibutuhkan %',
      product_name, current_stock, NEW.quantity;
  END IF;

  UPDATE public.products
  SET stock = stock - NEW.quantity, updated_at = now()
  WHERE id = NEW.product_id;

  INSERT INTO public.inventory_transactions (product_id, quantity, type, note)
  VALUES (NEW.product_id, NEW.quantity, 'OUT',
    'Sale ' || NEW.sale_id::text);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_sales_item_stock ON public.sales_items;
CREATE TRIGGER trg_handle_sales_item_stock
AFTER INSERT ON public.sales_items
FOR EACH ROW EXECUTE FUNCTION public.handle_sales_item_stock();
