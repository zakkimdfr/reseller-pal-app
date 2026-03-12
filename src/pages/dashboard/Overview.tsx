import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Package, AlertTriangle } from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState({ todayRevenue: 0, todayProfit: 0, totalRevenue: 0, totalProfit: 0 });
  const [lowStock, setLowStock] = useState<{ id: string; name: string; stock: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; total_qty: number }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data: allSales } = await supabase.from("sales").select("date, total_revenue, total_profit");
    if (allSales) {
      const todaySales = allSales.filter((s) => s.date === today);
      setStats({
        todayRevenue: todaySales.reduce((a, s) => a + Number(s.total_revenue), 0),
        todayProfit: todaySales.reduce((a, s) => a + Number(s.total_profit), 0),
        totalRevenue: allSales.reduce((a, s) => a + Number(s.total_revenue), 0),
        totalProfit: allSales.reduce((a, s) => a + Number(s.total_profit), 0),
      });
    }

    const { data: products } = await supabase.from("products").select("id, name, stock").lte("stock", 10).order("stock");
    if (products) setLowStock(products);

    const { data: items } = await supabase.from("sales_items").select("product_id, quantity, products(name)");
    if (items) {
      const map: Record<string, { name: string; total_qty: number }> = {};
      items.forEach((it: any) => {
        const pid = it.product_id;
        if (!map[pid]) map[pid] = { name: it.products?.name ?? "Unknown", total_qty: 0 };
        map[pid].total_qty += it.quantity;
      });
      setTopProducts(Object.values(map).sort((a, b) => b.total_qty - a.total_qty).slice(0, 5));
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const statCards = [
    { label: "Revenue Hari Ini", value: fmt(stats.todayRevenue), icon: DollarSign },
    { label: "Profit Hari Ini", value: fmt(stats.todayProfit), icon: TrendingUp },
    { label: "Total Revenue", value: fmt(stats.totalRevenue), icon: DollarSign },
    { label: "Total Profit", value: fmt(stats.totalProfit), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-sans text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="font-sans text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">Semua stok aman.</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="font-sans text-sm">{p.name}</span>
                    <span className="font-sans text-sm font-bold text-destructive">{p.stock} pcs</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base">
              <Package className="h-4 w-4 text-primary" /> Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">Belum ada data penjualan.</p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="font-sans text-sm">{p.name}</span>
                    <span className="font-sans text-sm font-bold text-primary">{p.total_qty} terjual</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
