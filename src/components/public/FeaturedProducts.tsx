import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";

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
    supabase
      .from("products")
      .select("id, name, category, selling_price, description")
      .order("name")
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const waUrl = (name: string) =>
    `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${name}. Bisa minta info lebih lanjut?`)}`;

  return (
    <section id="products" className="relative py-16 md:py-24 scroll-mt-20">
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Produk Kami</p>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl">Katalog Produk</h2>
          </div>
          <p className="max-w-md font-sans text-sm text-muted-foreground">
            Pilihan produk kesehatan & skincare terbaik dengan harga reseller paling kompetitif.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.id} className="group flex flex-col overflow-hidden border-border/60 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-muted to-muted/40">
                <span className="px-4 text-center font-serif text-lg font-semibold text-muted-foreground/80">{p.name}</span>
                <span className="absolute right-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                  {p.category}
                </span>
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                {p.description && (
                  <p className="mb-3 font-sans text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                )}
                <p className="mb-4 font-sans text-xl font-bold text-primary">{formatPrice(p.selling_price)}</p>
                <div className="mt-auto flex gap-2">
                  <a href={waUrl(p.name)} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full bg-[#25D366] text-white hover:bg-[#1faa54]">
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Order
                    </Button>
                  </a>
                  <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary hover:text-secondary-foreground">
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
