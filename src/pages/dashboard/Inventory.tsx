import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type Transaction = Tables<"inventory_transactions"> & { products?: { name: string } };

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: p } = await supabase.from("products").select("*").order("name");
    if (p) setProducts(p);
    const { data: t } = await supabase.from("inventory_transactions").select("*, products(name)").order("created_at", { ascending: false }).limit(50);
    if (t) setTransactions(t as Transaction[]);
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventori</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="font-sans text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 font-sans text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Stok</span><span className="font-bold">{p.stock} pcs</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nilai Stok</span><span>{fmt(p.stock * Number(p.cost_price))}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-base">Riwayat Stok</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-sans text-sm">{t.products?.name ?? "-"}</TableCell>
                  <TableCell><span className={`rounded px-2 py-0.5 font-sans text-xs font-medium ${t.type === "IN" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{t.type}</span></TableCell>
                  <TableCell className="font-sans text-sm">{t.quantity}</TableCell>
                  <TableCell className="font-sans text-sm text-muted-foreground">{t.note || "-"}</TableCell>
                  <TableCell className="font-sans text-sm">{new Date(t.created_at).toLocaleDateString("id-ID")}</TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center font-sans text-sm text-muted-foreground">Belum ada transaksi.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
