import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

type CartItem = {
  product_id: string;
  name: string;
  quantity: number;
  selling_price: number;
  cost_price: number;
};

export default function Sales() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: p } = await supabase.from("products").select("*").order("name");
    if (p) setProducts(p);
    const { data: s } = await supabase.from("sales").select("*, profiles(name)").order("created_at", { ascending: false }).limit(50);
    if (s) setSales(s);
  };

  const addToCart = () => {
    const p = products.find((x) => x.id === selectedProduct);
    if (!p) return;
    const existing = cart.find((c) => c.product_id === p.id);
    if (existing) {
      setCart(cart.map((c) => c.product_id === p.id ? { ...c, quantity: c.quantity + qty } : c));
    } else {
      setCart([...cart, { product_id: p.id, name: p.name, quantity: qty, selling_price: Number(p.selling_price), cost_price: Number(p.cost_price) }]);
    }
    setSelectedProduct("");
    setQty(1);
  };

  const removeFromCart = (pid: string) => setCart(cart.filter((c) => c.product_id !== pid));

  const totalRevenue = cart.reduce((a, c) => a + c.selling_price * c.quantity, 0);
  const totalCost = cart.reduce((a, c) => a + c.cost_price * c.quantity, 0);
  const totalProfit = totalRevenue - totalCost;

  const handleSubmitSale = async () => {
    if (!user || cart.length === 0) return;

    // Create sale
    const { data: sale, error: saleErr } = await supabase.from("sales").insert({
      created_by: user.id,
      total_revenue: totalRevenue,
      total_cost: totalCost,
      total_profit: totalProfit,
    }).select().single();

    if (saleErr || !sale) { toast({ variant: "destructive", title: "Error", description: saleErr?.message }); return; }

    // Create sale items
    const items = cart.map((c) => ({
      sale_id: sale.id,
      product_id: c.product_id,
      quantity: c.quantity,
      selling_price: c.selling_price,
      cost_price: c.cost_price,
      subtotal: c.selling_price * c.quantity,
      profit: (c.selling_price - c.cost_price) * c.quantity,
    }));
    await supabase.from("sales_items").insert(items);

    // Update stock & create inventory transactions
    for (const c of cart) {
      await supabase.from("products").update({ stock: products.find((p) => p.id === c.product_id)!.stock - c.quantity }).eq("id", c.product_id);
      await supabase.from("inventory_transactions").insert({ product_id: c.product_id, type: "OUT", quantity: c.quantity, note: `Penjualan #${sale.id.slice(0, 8)}` });
    }

    toast({ title: "Penjualan berhasil dicatat!" });
    setCart([]);
    setOpen(false);
    load();
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Penjualan</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Catat Penjualan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Penjualan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                      <span>{c.name} × {c.quantity}</span>
                      <div className="flex items-center gap-3">
                        <span>{fmt(c.selling_price * c.quantity)}</span>
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
                <TableHead>Oleh</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-sans text-sm">{new Date(s.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="font-sans text-sm">{s.profiles?.name ?? "-"}</TableCell>
                  <TableCell className="font-sans text-sm">{fmt(Number(s.total_revenue))}</TableCell>
                  <TableCell className="font-sans text-sm font-bold text-primary">{fmt(Number(s.total_profit))}</TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center font-sans text-sm text-muted-foreground">Belum ada penjualan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
