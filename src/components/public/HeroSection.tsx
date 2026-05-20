import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle, Leaf } from "lucide-react";

export default function HeroSection() {
  return (

    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-36">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 backdrop-blur-sm">
            <Leaf className="h-3.5 w-3.5 text-secondary" />
            <span className="font-sans text-xs font-medium uppercase tracking-widest text-secondary">Kesehatan Alami dari Alam</span>
          </div>
          
          <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.05] md:text-7xl">
            British Propolis <span className="italic text-secondary">&</span> Skincare Terbaik
          </h1>
          <p className="mb-10 font-sans text-base font-light opacity-65 md:text-lg max-w-lg leading-relaxed">
            Produk propolis dan perawatan kulit berkualitas tinggi untuk kesehatan keluarga Indonesia. 100% alami, teruji klinis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://wa.me/628XXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25">
                <MessageCircle className="mr-2 h-4 w-4" /> Order via WhatsApp
              </Button>
            </a>
            <button onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Lihat Produk
              </Button>
            </button>
          </div>

          {/* certifications */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-primary-foreground/15 pt-8">
            {/* BPOM */}
            <div className="flex items-center gap-2.5 rounded-lg border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-2.5 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#006B3F" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="18" y="13" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="7.5" fill="white">BPOM</text>
                <text x="18" y="21" textAnchor="middle" fontFamily="Arial" fontSize="4.5" fill="rgba(255,255,255,0.75)">RI</text>
                <path d="M10 24 Q18 28 26 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
              </svg>
              <div className="text-left">
                <p className="font-sans text-xs font-semibold text-primary-foreground">BPOM RI</p>
                <p className="font-sans text-[10px] opacity-50">Badan Pengawas Obat & Makanan</p>
              </div>
            </div>

            {/* FDA */}
            <div className="flex items-center gap-2.5 rounded-lg border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-2.5 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect x="1" y="1" width="34" height="34" rx="6" fill="#003087" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="18" y="16" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="10" fill="white">FDA</text>
                <text x="18" y="24" textAnchor="middle" fontFamily="Arial" fontSize="3.8" fill="rgba(255,255,255,0.6)">U.S. APPROVED</text>
              </svg>
              <div className="text-left">
                <p className="font-sans text-xs font-semibold text-primary-foreground">FDA</p>
                <p className="font-sans text-[10px] opacity-50">U.S. Food & Drug Administration</p>
              </div>
            </div>

            {/* Halal */}
            <div className="flex items-center gap-2.5 rounded-lg border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-2.5 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#00843D" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="18" y="17" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="8" fill="white">حلال</text>
                <text x="18" y="25" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="5.5" fill="rgba(255,255,255,0.9)">HALAL</text>
              </svg>
              <div className="text-left">
                <p className="font-sans text-xs font-semibold text-primary-foreground">Halal MUI</p>
                <p className="font-sans text-[10px] opacity-50">Majelis Ulama Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
