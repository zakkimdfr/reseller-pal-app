import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  selling_price: number;
  description: string | null;
};

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "bp", label: "British Propolis" },
  { key: "belgie", label: "Belgie Skincare" },
];

function classify(p: Product): "bp" | "belgie" {
  const c = (p.category || "").toLowerCase();
  const n = p.name.toLowerCase();
  if (c.includes("belgie") || n.includes("belgie")) return "belgie";
  return "bp";
}

function thumbVariant(p: Product): string {
  const cat = classify(p);
  const n = p.name.toLowerCase();
  if (cat === "belgie") return "bg-gradient-to-br from-[#ede7db] to-[#ddd5c5] text-primary";
  if (n.includes("biru") || n.includes("norway")) return "bg-gradient-to-br from-[#2a1f0a] to-[#5a3c0f] text-secondary";
  return "bg-gradient-to-br from-primary to-[hsl(153,40%,25%)] text-primary-foreground/90";
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("semua");

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, category, selling_price, description")
      .order("name")
      .then(({ data }) => data && setProducts(data));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const waUrl = (name: string) =>
    `https://wa.me/628XXXXXXXXX?text=${encodeURIComponent(`Halo, saya mau order ${name}`)}`;

  const filtered = useMemo(
    () => (filter === "semua" ? products : products.filter((p) => classify(p) === filter)),
    [products, filter]
  );

  return (
    <section id="products" className="bg-background px-[5%] py-20 md:py-24 scroll-mt-20">
      <div className="mx-auto mb-12 flex max-w-6xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Katalog Produk</p>
          <h2 className="font-serif font-bold leading-[1.1] text-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
            Pilihan Terbaik<br/>untuk Keluarga
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 font-sans text-[13px] transition ${
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-transparent text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => {
          const cat = classify(p);
          const isBp = cat === "bp";
          return (
            <article key={p.id} className="overflow-hidden rounded-[10px] border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-[0_12px_40px_hsl(var(--primary)/0.12)]">
              <div className={`flex h-44 items-center justify-center font-serif text-xl font-semibold tracking-wide ${thumbVariant(p)}`}>
                {p.name}
              </div>
              <div className="p-5">
                <p className="mb-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-secondary">
                  {isBp ? "British Propolis" : "Belgie Skincare"}
                </p>
                <h3 className="mb-1 font-serif text-xl font-semibold text-foreground">{p.name}</h3>
                {p.description && (
                  <p className="mb-3 font-sans text-[12.5px] leading-[1.5] text-muted-foreground line-clamp-2">{p.description}</p>
                )}
                {isBp && (
                  <div className="my-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-muted bg-muted/40 px-2.5 py-1 font-sans text-[11px] text-muted-foreground">1 biji</span>
                    <span className="rounded-full border border-muted bg-muted/40 px-2.5 py-1 font-sans text-[11px] text-muted-foreground">Paket 3</span>
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 font-sans text-[11px] font-medium text-secondary">Paket 6 ✦</span>
                  </div>
                )}
                <div className="font-serif text-2xl font-bold text-primary">{formatPrice(p.selling_price)}</div>
                <div className="mb-4 font-sans text-[11px] text-muted-foreground">{isBp ? "per botol / mulai dari" : "per pcs"}</div>
                <a
                  href={waUrl(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 font-sans text-[13px] font-medium text-primary-foreground transition hover:bg-primary/85"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Order via WA
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
