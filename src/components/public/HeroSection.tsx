import { MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden bg-primary px-[5%] py-24 text-primary-foreground md:py-32">
      {/* radial light */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 50%, hsl(var(--primary) / 0.6) 0%, transparent 70%)" }} />
      {/* big bg word */}
      <div
        className="pointer-events-none absolute -right-[2%] bottom-[5%] select-none whitespace-nowrap font-serif font-bold leading-none text-secondary/[0.06]"
        style={{ fontSize: "clamp(80px, 12vw, 180px)" }}
      >
        Propolis
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <span className="mb-5 inline-block font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-secondary">
            Distributor Resmi — Kesehatan Alami
          </span>
          <h1 className="mb-6 font-serif font-bold leading-[1.05] text-primary-foreground" style={{ fontSize: "clamp(46px, 7vw, 82px)" }}>
            British Propolis<br />&amp; <em className="italic text-secondary">Belgie</em><br />Skincare
          </h1>
          <p className="mb-10 max-w-lg font-sans text-base font-light leading-[1.7] text-primary-foreground/65">
            Distributor resmi British Propolis & Belgie Skincare di Bandung. Produk kesehatan alami terpercaya untuk keluarga Indonesia.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20ingin%20order%20British%20Propolis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-secondary px-7 py-3.5 font-sans text-sm font-medium text-primary transition hover:-translate-y-0.5 hover:bg-secondary/90"
            >
              <MessageCircle className="h-4 w-4" /> Order Sekarang
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded border border-primary-foreground/30 px-7 py-3.5 font-sans text-sm text-primary-foreground transition hover:border-primary-foreground hover:bg-primary-foreground/5"
            >
              Lihat Produk
            </a>
          </div>

          {/* certifications */}
          <div className="mt-12 flex flex-wrap gap-3 border-t border-primary-foreground/10 pt-10">
            {[
              { name: "BPOM RI", sub: "Badan Pengawas Obat & Makanan", svg: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17" fill="#006B3F" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <text x="18" y="13" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="7.5" fill="white">BPOM</text>
                  <text x="18" y="21" textAnchor="middle" fontFamily="Arial" fontSize="4.5" fill="rgba(255,255,255,0.75)">RI</text>
                  <path d="M10 24 Q18 28 26 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
                </svg>
              )},
              { name: "FDA", sub: "U.S. Food & Drug Administration", svg: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="1" y="1" width="34" height="34" rx="6" fill="#003087" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <text x="18" y="15" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="9" fill="white">FDA</text>
                  <text x="18" y="24" textAnchor="middle" fontFamily="Arial" fontSize="4" fill="rgba(255,255,255,0.6)">U.S. APPROVED</text>
                </svg>
              )},
              { name: "Halal MUI", sub: "Majelis Ulama Indonesia", svg: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17" fill="#00843D" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <text x="18" y="17" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="8" fill="white">حلال</text>
                  <text x="18" y="25" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="5.5" fill="rgba(255,255,255,0.9)">HALAL</text>
                </svg>
              )},
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-2.5 rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.07] px-4 py-2.5 transition hover:border-secondary/40">
                {c.svg}
                <div>
                  <div className="font-sans text-[13px] font-medium text-primary-foreground">{c.name}</div>
                  <div className="font-sans text-[10px] text-primary-foreground/45">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
