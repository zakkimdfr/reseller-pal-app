import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Dist = { id: string; name: string; percentage: number };

export default function SettingsPage() {
  const [distributions, setDistributions] = useState<Dist[]>([]);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("profit_distribution").select("*").order("name");
    if (data) setDistributions(data.map((d) => ({ ...d, percentage: Number(d.percentage) })));
  };

  const updateDist = (id: string, field: keyof Dist, value: string | number) => {
    setDistributions(distributions.map((d) => d.id === id ? { ...d, [field]: value } : d));
  };

  const save = async () => {
    const total = distributions.reduce((a, d) => a + d.percentage, 0);
    if (total !== 100) {
      toast({ variant: "destructive", title: "Error", description: `Total persentase harus 100% (sekarang ${total}%)` });
      return;
    }
    for (const d of distributions) {
      await supabase.from("profit_distribution").update({ name: d.name, percentage: d.percentage }).eq("id", d.id);
    }
    toast({ title: "Distribusi profit diperbarui!" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-base">Distribusi Profit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {distributions.map((d) => (
            <div key={d.id} className="flex items-end gap-3">
              <div className="flex-1">
                <Label>Nama</Label>
                <Input value={d.name} onChange={(e) => updateDist(d.id, "name", e.target.value)} />
              </div>
              <div className="w-24">
                <Label>%</Label>
                <Input type="number" value={d.percentage} onChange={(e) => updateDist(d.id, "percentage", Number(e.target.value))} />
              </div>
            </div>
          ))}
          <p className="font-sans text-sm text-muted-foreground">
            Total: {distributions.reduce((a, d) => a + d.percentage, 0)}%
          </p>
          <Button onClick={save}>Simpan Perubahan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
