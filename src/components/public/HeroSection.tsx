import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-32">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(38 65% 49% / 0.4), transparent 60%)" }} />
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">
            Kesehatan Alami dari Alam
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            British Propolis & Skincare Terbaik
          </h1>
          <p className="mb-8 text-lg opacity-80 font-sans">
            Produk propolis dan perawatan kulit berkualitas tinggi untuk kesehatan keluarga Indonesia. 100% alami, teruji klinis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <ShoppingBag className="mr-2 h-4 w-4" /> Beli di Shopee
              </Button>
            </a>
            <a href="https://tokopedia.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <ShoppingBag className="mr-2 h-4 w-4" /> Beli di Tokopedia
              </Button>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <MessageCircle className="mr-2 h-4 w-4" /> Order via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
