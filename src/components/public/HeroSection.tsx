import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle, Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-32">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 backdrop-blur-sm">
            <Leaf className="h-3.5 w-3.5 text-secondary" />
            <span className="font-sans text-xs font-medium uppercase tracking-widest text-secondary">Kesehatan Alami dari Alam</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
            British Propolis <span className="italic text-secondary">&</span> Skincare Terbaik
          </h1>
          <p className="mb-10 font-sans text-base opacity-80 md:text-lg">
            Produk propolis dan perawatan kulit berkualitas tinggi untuk kesehatan keluarga Indonesia. 100% alami, teruji klinis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 hover:bg-secondary/90">
                <ShoppingBag className="mr-2 h-4 w-4" /> Beli di Shopee
              </Button>
            </a>
            <a href="https://tokopedia.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/25 border border-primary-foreground/30">
                <ShoppingBag className="mr-2 h-4 w-4" /> Beli di Tokopedia
              </Button>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#25D366] text-white hover:bg-[#1faa54]">
                <MessageCircle className="mr-2 h-4 w-4" /> Order via WhatsApp
              </Button>
            </a>
          </div>

          {/* trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-8 text-left sm:gap-8">
            <div>
              <p className="font-serif text-2xl font-bold text-secondary md:text-3xl">10K+</p>
              <p className="font-sans text-xs uppercase tracking-wider opacity-70">Pelanggan Puas</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-secondary md:text-3xl">5★</p>
              <p className="font-sans text-xs uppercase tracking-wider opacity-70">Rating Marketplace</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-secondary md:text-3xl">100%</p>
              <p className="font-sans text-xs uppercase tracking-wider opacity-70">Original BPOM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
