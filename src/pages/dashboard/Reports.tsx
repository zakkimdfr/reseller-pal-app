import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Reports() {
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; profit: number }[]>([]);
  const [distribution, setDistribution] = useState<{ name: string; percentage: number; amount: number }[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: sales } = await supabase.from("sales").select("date, total_revenue, total_profit").order("date", { ascending: false });
    if (sales) {
      const map: Record<string, { revenue: number; profit: number }> = {};
      let tp = 0;
      sales.forEach((s) => {
        if (!map[s.date]) map[s.date] = { revenue: 0, profit: 0 };
        map[s.date].revenue += Number(s.total_revenue);
        map[s.date].profit += Number(s.total_profit);
        tp += Number(s.total_profit);
      });
      setDailyData(Object.entries(map).map(([date, v]) => ({ date, ...v })).slice(0, 30));
      setTotalProfit(tp);
    }

    const { data: dist } = await supabase.from("profit_distribution").select("name, percentage");
    if (dist) {
      const tp2 = totalProfit || (sales ? sales.reduce((a, s) => a + Number(s.total_profit), 0) : 0);
      setDistribution(dist.map((d) => ({ name: d.name, percentage: Number(d.percentage), amount: tp2 * Number(d.percentage) / 100 })));
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan</h1>

      <Card>
        <CardHeader><CardTitle className="font-sans text-base">Revenue & Profit Harian</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyData.map((d) => (
                <TableRow key={d.date}>
                  <TableCell className="font-sans text-sm">{new Date(d.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="font-sans text-sm">{fmt(d.revenue)}</TableCell>
                  <TableCell className="font-sans text-sm font-bold text-primary">{fmt(d.profit)}</TableCell>
                </TableRow>
              ))}
              {dailyData.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center font-sans text-sm text-muted-foreground">Belum ada data.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-base">Distribusi Profit Tim</CardTitle>
          <p className="font-sans text-sm text-muted-foreground">Total Profit: {fmt(totalProfit)}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-md border px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-semibold">{d.name}</p>
                  <p className="font-sans text-xs text-muted-foreground">{d.percentage}%</p>
                </div>
                <p className="font-sans text-lg font-bold text-primary">{fmt(d.amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
