import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  category: string;
  selling_price: number;
  description: string | null;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products").select("id, name, category, selling_price, description").order("name").then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Produk Kami</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Katalog Produk</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.id} className="group overflow-hidden transition hover:shadow-lg">
              <div className="flex h-40 items-center justify-center bg-muted">
                <span className="font-serif text-lg font-semibold text-muted-foreground">{p.name}</span>
              </div>
              <CardContent className="p-4">
                <p className="mb-1 font-sans text-xs font-medium uppercase tracking-wider text-secondary">{p.category}</p>
                <h3 className="mb-2 font-sans text-base font-semibold text-foreground">{p.name}</h3>
                <p className="font-sans text-lg font-bold text-primary">{formatPrice(p.selling_price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
