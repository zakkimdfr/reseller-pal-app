
-- ============ SALES: extend with order lifecycle ============
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'paid',
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS shipping_address text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_postal_code text,
  ADD COLUMN IF NOT EXISTS shipping_courier text,
  ADD COLUMN IF NOT EXISTS shipping_service text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual'; -- manual | telegram

ALTER TABLE public.sales
  DROP CONSTRAINT IF EXISTS sales_status_check;
ALTER TABLE public.sales
  ADD CONSTRAINT sales_status_check
  CHECK (status IN ('draft','pending_payment','paid','shipped','delivered','cancelled','refunded'));

ALTER TABLE public.sales
  DROP CONSTRAINT IF EXISTS sales_source_check;
ALTER TABLE public.sales
  ADD CONSTRAINT sales_source_check
  CHECK (source IN ('manual','telegram'));

CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at DESC);

-- ============ PAYMENTS ============
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'midtrans',
  provider_order_id text UNIQUE,
  provider_transaction_id text,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  payment_url text,
  payment_token text,
  raw_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated staff can view payments"
  ON public.payments FOR SELECT TO authenticated
  USING (is_authenticated_staff(auth.uid()));

CREATE POLICY "Admin can manage payments"
  ON public.payments FOR ALL TO authenticated
  USING (is_admin_or_owner(auth.uid()))
  WITH CHECK (is_admin_or_owner(auth.uid()));

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payments_sale_id ON public.payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ============ SHIPPING EVENTS ============
CREATE TABLE IF NOT EXISTS public.shipping_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  status text NOT NULL,
  description text,
  location text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  raw_event jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.shipping_events TO authenticated;
GRANT ALL ON public.shipping_events TO service_role;

ALTER TABLE public.shipping_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated staff can view shipping events"
  ON public.shipping_events FOR SELECT TO authenticated
  USING (is_authenticated_staff(auth.uid()));

CREATE POLICY "Admin can insert shipping events"
  ON public.shipping_events FOR INSERT TO authenticated
  WITH CHECK (is_admin_or_owner(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_shipping_events_sale_id ON public.shipping_events(sale_id);

-- ============ TELEGRAM SESSIONS ============
CREATE TABLE IF NOT EXISTS public.telegram_sessions (
  chat_id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  current_draft jsonb,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.telegram_sessions TO authenticated;
GRANT ALL ON public.telegram_sessions TO service_role;

ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view telegram sessions"
  ON public.telegram_sessions FOR SELECT TO authenticated
  USING (is_admin_or_owner(auth.uid()));

CREATE TRIGGER telegram_sessions_updated_at
  BEFORE UPDATE ON public.telegram_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TELEGRAM AUTHORIZED USERS ============
CREATE TABLE IF NOT EXISTS public.telegram_authorized_users (
  chat_id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  added_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.telegram_authorized_users TO authenticated;
GRANT ALL ON public.telegram_authorized_users TO service_role;

ALTER TABLE public.telegram_authorized_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage telegram users"
  ON public.telegram_authorized_users FOR ALL TO authenticated
  USING (is_admin_or_owner(auth.uid()))
  WITH CHECK (is_admin_or_owner(auth.uid()));

-- ============ CANCEL → RESTORE STOCK ============
CREATE OR REPLACE FUNCTION public.handle_sale_cancellation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  item record;
BEGIN
  IF NEW.status IN ('cancelled','refunded')
     AND OLD.status NOT IN ('cancelled','refunded')
     AND OLD.status IN ('paid','pending_payment','shipped') THEN

    FOR item IN
      SELECT product_id, quantity FROM public.sales_items WHERE sale_id = NEW.id
    LOOP
      UPDATE public.products
      SET stock = stock + item.quantity, updated_at = now()
      WHERE id = item.product_id;

      INSERT INTO public.inventory_transactions (product_id, quantity, type, note)
      VALUES (item.product_id, item.quantity, 'IN',
        'Cancel sale ' || COALESCE(NEW.invoice_number, NEW.id::text));
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sales_cancel_restore_stock ON public.sales;
CREATE TRIGGER sales_cancel_restore_stock
  AFTER UPDATE OF status ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_sale_cancellation();
