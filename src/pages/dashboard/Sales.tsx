import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type PackageType = "satuan" | "paket3" | "paket6";
type PaymentMethod = "cash" | "transfer";

type CartItem = {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  selling_price: number; // subtotal (unit_price * qty)
  cost_price: number; // unit cost
  package_type: PackageType;
};

const TIER_LABEL: Record<PackageType, string> = {
  satuan: "Satuan",
  paket3: "Paket 3",
  paket6: "Paket 6",
};

function resolveTier(p: Product, qty: number): { tier: PackageType; unit_price: number } {
  const price3 = Number((p as any).price_3 ?? 0);
  const price6 = Number((p as any).price_6 ?? 0);
  if (qty >= 6 && price6 > 0) return { tier: "paket6", unit_price: price6 };
  if (qty >= 3 && price3 > 0) return { tier: "paket3", unit_price: price3 };
  return { tier: "satuan", unit_price: Number(p.selling_price) };
}

function generateInvoiceNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = String(Math.floor(1000 + Math.random() * 9000));
  return `BP-${ymd}-${rnd}`;
}

export default function Sales() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transfer");
  const [invoicePreview, setInvoicePreview] = useState(generateInvoiceNumber());
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: p } = await supabase.from("products").select("*").order("name");
    if (p) setProducts(p as Product[]);
    const { data: s } = await supabase.from("sales").select("*, profiles(name)").order("created_at", { ascending: false }).limit(50);
    if (s) setSales(s);
  };

  const addToCart = () => {
    const p = products.find((x) => x.id === selectedProduct);
    if (!p) return;
    const existing = cart.find((c) => c.product_id === p.id);
    const newQty = existing ? existing.quantity + qty : qty;
    const { tier, unit_price } = resolveTier(p, newQty);
    const item: CartItem = {
      product_id: p.id,
      name: p.name,
      quantity: newQty,
      unit_price,
      selling_price: unit_price * newQty,
      cost_price: Number(p.cost_price),
      package_type: tier,
    };
    if (existing) {
      setCart(cart.map((c) => c.product_id === p.id ? item : c));
    } else {
      setCart([...cart, item]);
    }
    setSelectedProduct("");
    setQty(1);
  };

  const removeFromCart = (pid: string) => setCart(cart.filter((c) => c.product_id !== pid));

  const totalRevenue = cart.reduce((a, c) => a + c.selling_price, 0);
  const totalCost = cart.reduce((a, c) => a + c.cost_price * c.quantity, 0);
  const totalProfit = totalRevenue - totalCost;

  const resetForm = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("transfer");
    setInvoicePreview(generateInvoiceNumber());
  };

  const handleSubmitSale = async () => {
    if (!user || cart.length === 0) return;
    if (!customerName.trim()) {
      toast({ variant: "destructive", title: "Nama pelanggan wajib diisi" });
      return;
    }

    // Client-side stock pre-check (server trigger is the source of truth)
    for (const c of cart) {
      const p = products.find((x) => x.id === c.product_id);
      if (!p || p.stock < c.quantity) {
        toast({ variant: "destructive", title: "Stok tidak cukup", description: `${c.name}: tersedia ${p?.stock ?? 0}, dibutuhkan ${c.quantity}` });
        return;
      }
    }

    // Upsert customer first
    const phone = customerPhone.trim() || null;
    const name = customerName.trim();
    const customersTbl = supabase.from("customers" as any);
    let existingCustomer: any = null;
    if (phone) {
      const { data } = await customersTbl.select("*").eq("phone", phone).maybeSingle();
      existingCustomer = data;
    }
    if (!existingCustomer) {
      const { data } = await customersTbl.select("*").eq("name", name).is("phone", null).maybeSingle();
      existingCustomer = data;
    }

    let customerId: string | null = null;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      await customersTbl.update({
        total_orders: (existingCustomer.total_orders ?? 0) + 1,
        total_spent: Number(existingCustomer.total_spent ?? 0) + totalRevenue,
        name,
        phone: phone ?? existingCustomer.phone,
      }).eq("id", existingCustomer.id);
    } else {
      const { data } = await customersTbl.insert({
        name,
        phone,
        total_orders: 1,
        total_spent: totalRevenue,
      }).select().single();
      customerId = (data as any)?.id ?? null;
    }

    // Insert sale — invoice_number auto-generated by DB trigger
    const { data: sale, error: saleErr } = await supabase.from("sales").insert({
      created_by: user.id,
      total_revenue: totalRevenue,
      total_cost: totalCost,
      total_profit: totalProfit,
      customer_name: name,
      customer_id: customerId,
      payment_method: paymentMethod,
    } as any).select().single();

    if (saleErr || !sale) {
      toast({ variant: "destructive", title: "Error", description: saleErr?.message });
      return;
    }

    // Insert items — DB trigger validates stock, decrements products.stock, logs inventory_transactions
    const items = cart.map((c) => ({
      sale_id: sale.id,
      product_id: c.product_id,
      quantity: c.quantity,
      selling_price: c.unit_price,
      cost_price: c.cost_price,
      subtotal: c.selling_price,
      profit: c.selling_price - c.cost_price * c.quantity,
    }));
    const { error: itemsErr } = await supabase.from("sales_items").insert(items);
    if (itemsErr) {
      toast({ variant: "destructive", title: "Gagal menyimpan item", description: itemsErr.message });
      return;
    }

    toast({ title: "Penjualan berhasil dicatat!", description: `Invoice ${(sale as any).invoice_number ?? ""}` });
    resetForm();
    setOpen(false);
    load();
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Penjualan</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setInvoicePreview(generateInvoiceNumber()); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Catat Penjualan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Penjualan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 px-3 py-2 font-sans text-xs text-muted-foreground">
                Invoice: <span className="font-semibold text-foreground">{invoicePreview}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Label>Nama Pelanggan *</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama lengkap" />
                </div>
                <div>
                  <Label>No. HP</Label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="628..." />
                </div>
                <div>
                  <Label>Metode Pembayaran</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Produk</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} (stok: {p.stock})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-20">
                  <Label>Qty</Label>
                  <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                </div>
                <div className="flex items-end">
                  <Button onClick={addToCart} disabled={!selectedProduct}>Tambah</Button>
                </div>
              </div>

              {cart.length > 0 && (
                <div className="space-y-2">
                  {cart.map((c) => (
                    <div key={c.product_id} className="flex items-center justify-between rounded-md border px-3 py-2 font-sans text-sm">
                      <div className="flex items-center gap-2">
                        <span>{c.name} × {c.quantity}</span>
                        <Badge variant="secondary" className="text-xs">{TIER_LABEL[c.package_type]}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{fmt(c.selling_price)}</span>
                        <button onClick={() => removeFromCart(c.product_id)}><Trash2 className="h-4 w-4 text-destructive" /></button>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1 rounded-md bg-muted p-3 font-sans text-sm">
                    <div className="flex justify-between"><span>Revenue</span><span className="font-bold">{fmt(totalRevenue)}</span></div>
                    <div className="flex justify-between"><span>Modal</span><span>{fmt(totalCost)}</span></div>
                    <div className="flex justify-between text-primary"><span className="font-semibold">Profit</span><span className="font-bold">{fmt(totalProfit)}</span></div>
                  </div>
                  <Button onClick={handleSubmitSale} className="w-full">Simpan Penjualan</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-sans text-base">Riwayat Penjualan</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Oleh</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-sans text-sm">{new Date(s.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="font-sans text-xs text-muted-foreground">{s.invoice_number ?? "-"}</TableCell>
                  <TableCell className="font-sans text-sm">{s.customer_name ?? "-"}</TableCell>
                  <TableCell className="font-sans text-sm">{s.profiles?.name ?? "-"}</TableCell>
                  <TableCell className="font-sans text-sm">{fmt(Number(s.total_revenue))}</TableCell>
                  <TableCell className="font-sans text-sm font-bold text-primary">{fmt(Number(s.total_profit))}</TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center font-sans text-sm text-muted-foreground">Belum ada penjualan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
