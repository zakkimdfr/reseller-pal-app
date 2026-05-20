import { MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <>
      {/* Mitra */}
      <section id="reseller" className="bg-primary px-[5%] py-20 text-primary-foreground md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Program Mitra</p>
          <h2 className="mb-4 font-serif font-bold leading-[1.1] text-primary-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
            Bergabung sebagai Mitra Reseller
          </h2>
          <p className="mx-auto mb-10 max-w-xl font-sans text-[15px] font-light leading-[1.7] text-primary-foreground/55">
            Mulai bisnis Anda sendiri dengan menjual produk British Propolis & Belgie. Modal terjangkau, margin menarik, support penuh dari kami.
          </p>
          <div className="mb-10 grid gap-5 sm:grid-cols-3">
            {[
              { i: "💰", t: "Margin Menarik", s: "Keuntungan hingga 38% per produk dengan harga jual kompetitif" },
              { i: "📦", t: "Stok Fleksibel", s: "Mulai dari 1 dus, beli sesuai kemampuan dan kebutuhan" },
              { i: "🤝", t: "Dukungan Penuh", s: "Materi promosi, panduan penjualan, konsultasi bisnis gratis" },
            ].map((b) => (
              <div key={b.t} className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.05] p-6">
                <div className="mb-2.5 text-2xl">{b.i}</div>
                <div className="mb-1 font-sans text-sm font-medium text-primary-foreground">{b.t}</div>
                <div className="font-sans text-xs leading-[1.5] text-primary-foreground/45">{b.s}</div>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20tertarik%20menjadi%20mitra%20reseller"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-secondary px-8 py-4 font-sans text-sm font-medium text-primary transition hover:-translate-y-0.5 hover:bg-secondary/90"
          >
            <MessageCircle className="h-4 w-4" /> Daftar Jadi Mitra
          </a>
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="bg-background px-[5%] py-20 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Hubungi Kami</p>
          <h2 className="mb-4 font-serif font-bold leading-[1.1] text-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
            Siap Order atau Ada Pertanyaan?
          </h2>
          <p className="mx-auto mb-8 font-sans text-[15px] font-light leading-[1.7] text-muted-foreground">
            Chat langsung dengan kami via WhatsApp. Kami siap bantu konsultasi produk, konfirmasi stok, dan proses pemesanan Anda.
          </p>
          <a
            href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20ingin%20bertanya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-md bg-[#25d366] px-9 py-4 font-sans text-[15px] font-medium text-white shadow-[0_4px_20px_rgba(37,211,102,0.3)] transition hover:-translate-y-0.5 hover:bg-[#20c45b] hover:shadow-[0_8px_28px_rgba(37,211,102,0.4)]"
          >
            <MessageCircle className="h-5 w-5" /> Chat WhatsApp Sekarang
          </a>
        </div>
      </section>
    </>
  );
}
