
# Chat-to-Order: Telegram Bot + Midtrans + Biteship

## Tujuan Akhir

Lo (atau staff) chat ke bot Telegram:
> "Order dari Andi 0812xxx, BP merah 2 BP biru 3, alamat: Jl. Sudirman 5 Jakarta, kurir JNE"

Bot otomatis:
1. Parse order pakai AI (Lovable AI Gateway) → match ke produk di DB
2. Reply preview: produk, qty, subtotal, ongkir, total → minta konfirmasi
3. Setelah lo confirm → bikin record `sales` (pending) + generate **invoice number** + **Midtrans payment link** + kirim link bayar ke customer (atau ke lo buat di-forward)
4. Customer bayar → Midtrans webhook → status `paid` → bot notify lo
5. Lo trigger "kirim" → Biteship bikin order pengiriman → resi otomatis → bot kirim link tracking ke customer
6. Update status pengiriman otomatis dari Biteship webhook (picked → in_transit → delivered)

Semua tercatat di dashboard, profit auto-calc, stok auto-reduce (sudah ada di Sprint 1).

---

## Fase 1 — Foundation (schema + state machine)

Sebelum bikin bot, siapin model data dulu biar order punya lifecycle yang jelas.

### Schema baru / perubahan

```sql
-- Tambah kolom status & alamat di sales
ALTER TABLE sales
  ADD COLUMN status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','pending_payment','paid','shipped','delivered','cancelled','refunded')),
  ADD COLUMN customer_phone text,
  ADD COLUMN shipping_address text,
  ADD COLUMN shipping_city text,
  ADD COLUMN shipping_postal_code text,
  ADD COLUMN shipping_courier text,
  ADD COLUMN shipping_service text,
  ADD COLUMN shipping_cost numeric DEFAULT 0,
  ADD COLUMN tracking_number text,
  ADD COLUMN paid_at timestamptz,
  ADD COLUMN shipped_at timestamptz,
  ADD COLUMN delivered_at timestamptz,
  ADD COLUMN notes text;

-- Tabel payment (audit trail dari Midtrans)
CREATE TABLE payments (
  id uuid PRIMARY KEY,
  sale_id uuid REFERENCES sales(id),
  provider text DEFAULT 'midtrans',
  provider_order_id text UNIQUE,  -- order_id yg dikirim ke Midtrans
  provider_transaction_id text,
  amount numeric NOT NULL,
  status text,  -- pending, settlement, capture, deny, expire, cancel, refund
  payment_method text,  -- qris, gopay, bca_va, dst
  payment_url text,
  raw_response jsonb,
  created_at, updated_at
);

-- Tabel shipping tracking
CREATE TABLE shipping_events (
  id uuid PRIMARY KEY,
  sale_id uuid REFERENCES sales(id),
  status text,        -- picked, in_transit, delivered, dst
  description text,
  location text,
  occurred_at timestamptz,
  raw_event jsonb
);

-- Telegram conversation state (biar bot inget context per chat)
CREATE TABLE telegram_sessions (
  chat_id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users,  -- linked staff/admin
  current_draft jsonb,                  -- order draft yg lagi disusun
  last_message_at timestamptz
);

-- Whitelist chat_id yg boleh akses bot (karena internal)
CREATE TABLE telegram_authorized_users (
  chat_id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text,
  added_at timestamptz
);
```

Plus GRANTs + RLS sesuai pattern existing.

### State machine sale
```text
draft → pending_payment → paid → shipped → delivered
                ↓                    ↓
            cancelled            refunded
```

---

## Fase 2 — Telegram Bot (internal staff only)

### Connector & secrets
- Pakai connector **Telegram** resmi Lovable → `standard_connectors--connect`
- Lo buat bot via @BotFather di Telegram → dapet bot token → masukin ke connection
- Tambah `chat_id` lo & tim ke `telegram_authorized_users` (sekali setup)

### Edge function `telegram-webhook`
- Verify Telegram secret token (anti-spoofing)
- Cek `chat_id` ada di whitelist — kalau enggak, reply "Unauthorized"
- Route command:
  - `/start` → tampilkan menu
  - `/order <text bebas>` atau pesan biasa → AI parse
  - `/confirm` → finalize draft jadi `pending_payment` + generate Midtrans link
  - `/cancel` → reset draft
  - `/status <invoice>` → cek status order
  - `/today` → ringkasan order hari ini

### AI parsing (Lovable AI Gateway, `google/gemini-2.5-flash`)
Tools yang di-expose ke AI:
- `search_products(query)` → fuzzy match ke `products.name` (mis. "bp merah" → "British Propolis Merah")
- `create_order_draft({customer, items[], address, courier})` → simpan ke `telegram_sessions.current_draft`
- `get_shipping_quote(address, items)` → panggil Biteship rates

Output draft balik ke chat sebagai preview rapi:
```
📦 Draft Order
Customer: Andi (0812xxx)
- BP Merah × 2 = Rp 600.000
- BP Biru × 3  = Rp 750.000
Subtotal: Rp 1.350.000
Ongkir JNE REG: Rp 25.000
TOTAL: Rp 1.375.000

Ketik /confirm untuk buat invoice & link bayar
Ketik /cancel untuk batal
```

---

## Fase 3 — Midtrans Payment Integration

### Setup
- Daftar Midtrans (mode sandbox dulu) → dapet **Server Key** & **Client Key**
- Lo input lewat `add_secret`: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION` (boolean)

### Edge function `create-payment`
Dipanggil dari `telegram-webhook` saat `/confirm`:
1. Insert `sales` (status=`pending_payment`, invoice_number auto-generated)
2. Insert `sales_items` (trigger existing reserve stok)
3. POST ke Midtrans Snap API:
   ```
   POST https://app.sandbox.midtrans.com/snap/v1/transactions
   {
     "transaction_details": { "order_id": "<sale.id>", "gross_amount": <total> },
     "item_details": [...],
     "customer_details": {...},
     "callbacks": { "finish": "<dashboard_url>/orders/<id>" }
   }
   ```
4. Simpan `payment_url` ke `payments` table
5. Bot kirim link ke chat: `💳 Link bayar: https://app.sandbox.midtrans.com/snap/...`

### Edge function `midtrans-webhook` (`verify_jwt = false`)
- Verify signature key (SHA512 server_key + order_id + status_code + gross_amount)
- Update `payments.status` + `sales.status`:
  - `settlement` / `capture` → `paid`, set `paid_at`
  - `expire` / `cancel` / `deny` → `cancelled`, **restore stok** (trigger baru: kalau sale cancelled, generate inventory `IN`)
- Kirim notif Telegram ke admin: "✅ Order INV-xxx PAID (Rp 1.375.000 via QRIS)"

---

## Fase 4 — Biteship Shipping

### Setup
- Daftar Biteship → dapet API key → `add_secret`: `BITESHIP_API_KEY`

### Edge function `create-shipment`
Trigger manual dari dashboard atau via `/ship <invoice>` di bot:
1. POST `https://api.biteship.com/v1/orders` dengan asal, tujuan, items, kurir pilihan
2. Dapet `tracking_id` + `waybill_id`
3. Update `sales.status = 'shipped'`, `tracking_number`, `shipped_at`
4. Bot kirim ke customer (via lo): "📦 Pesanan dikirim! Resi: JX12345 (JNE). Track: https://biteship.com/track/<id>"

### Edge function `biteship-webhook` (`verify_jwt = false`)
- Verify signature
- Insert ke `shipping_events`
- Saat `status = delivered` → update `sales.status = 'delivered'`, `delivered_at`
- Notif ke bot Telegram

---

## Fase 5 — Dashboard UI (untuk monitoring)

Tambahan halaman/perubahan minimal:
- **Sales table** → tambah kolom `status`, `tracking_number`, badge warna (pending/paid/shipped/delivered/cancelled)
- **Detail Sale modal** → tab timeline (order → paid → shipped → delivered + events Biteship)
- **Tombol "Refund"** (admin only) untuk paid sale → refund Midtrans + restore stok
- **Settings page** → daftar `telegram_authorized_users` (admin bisa add/remove)

Tidak rebuild Sales form — yang existing tetap jalan untuk order manual (walk-in).

---

## Implementation Order (saran sprint)

```text
Sprint A (Foundation)            ~migration + state machine
  1. Migration: sales status + payments + shipping_events + telegram tables
  2. RLS + GRANTs + cancel-restore-stock trigger
  3. Dashboard: tambah kolom status di Sales list

Sprint B (Telegram bot dasar)    ~tanpa AI dulu
  4. Connect Telegram connector + setup webhook
  5. Whitelist + /start /today /status (read-only commands)
  6. Test end-to-end flow webhook

Sprint C (AI order parsing)
  7. AI Gateway tool calls (search_products, create_draft)
  8. /order parsing + preview + /confirm /cancel
  9. Generate invoice (tanpa payment dulu — manual transfer mode)

Sprint D (Midtrans)
  10. add_secret Midtrans + create-payment function
  11. midtrans-webhook + verify signature + cancel-restore-stock
  12. Snap link delivery via bot

Sprint E (Biteship)
  13. add_secret Biteship + get-rates di parsing flow
  14. create-shipment function + bot /ship command
  15. biteship-webhook + shipping_events timeline UI

Sprint F (Polish)
  16. Refund button + Midtrans refund API
  17. Daily summary ke Telegram (cron) — order count, revenue, pending shipments
  18. Low-stock alert ke bot
```

Tiap sprint bisa di-ship independen. Lo bisa pakai bot dari Sprint C (manual transfer mode) sambil setup Midtrans paralel.

---

## Yang Lo Perlu Siapin di Luar Lovable

| Item | Kapan | Effort |
|---|---|---|
| Bot Telegram via @BotFather | Sebelum Sprint B | 2 menit |
| Akun Midtrans (sandbox dulu, production nanti pas ready) | Sebelum Sprint D | 10 menit register, 1–3 hari verifikasi production |
| Akun Biteship (free tier ada) | Sebelum Sprint E | 10 menit register |
| Chat ID Telegram lo & tim | Sebelum Sprint B | 1 menit (chat @userinfobot) |

---

## Detail Teknis (untuk konteks)

- **AI model**: `google/gemini-2.5-flash` (cepat + cheap, support tools, cukup buat parsing order ID)
- **Telegram secret token**: di-derive dari `TELEGRAM_API_KEY` pakai SHA-256 (sesuai pattern bawaan Lovable, ga perlu secret terpisah)
- **Webhook URLs**: semua via Supabase Edge Functions, `verify_jwt = false` untuk endpoint yg dipanggil 3rd party
- **Idempotency**: Telegram pakai `update_id` (PK), Midtrans pakai `order_id` (UNIQUE di `payments`), Biteship pakai event ID
- **Realtime**: dashboard subscribe `sales` table → status update otomatis pas webhook fire
- **Multi-tenant aman**: chat_id whitelist + RLS biar staff cuma liat sales-nya sendiri kalau perlu (saat ini semua authenticated bisa liat semua sales — sesuai existing policy)

---

## Pertanyaan Lo Harus Putusin Sebelum Mulai

1. **Setuju Midtrans?** Atau mau Xendit?
2. **Mulai dari sprint mana?** Saran: Sprint A + B dulu (foundation + bot read-only) — 1 message implementation.
3. **Customer terima link bayar gimana?** Opsi: (a) bot kirim ke lo, lo forward manual ke customer WA — paling simpel & internal. (b) bot kirim langsung ke customer via WA — perlu integrasi WA juga, skip dulu.

Begitu lo OK, gue eksekusi Sprint A + B sekaligus.
