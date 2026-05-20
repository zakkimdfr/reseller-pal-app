export default function AboutSection() {
  return (
    <section id="tentang" className="bg-white px-[5%] py-20 md:py-24 scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-20">
        <div className="relative">
          <div className="rounded-lg bg-primary p-10 text-primary-foreground">
            <h3 className="mb-3 font-serif text-2xl font-semibold md:text-[28px]">Mengapa British Propolis?</h3>
            <p className="font-sans text-sm font-light leading-[1.65] text-primary-foreground/60">
              Propolis adalah zat alami yang dihasilkan lebah dari tanaman. Kaya akan flavonoid, antioksidan, dan antimikroba yang telah terbukti secara ilmiah mendukung kesehatan tubuh.
            </p>
          </div>
          <div className="absolute -bottom-5 right-0 rounded-lg bg-secondary px-6 py-5 text-center shadow-[0_8px_32px_rgba(196,154,60,0.3)] md:-right-5">
            <div className="font-serif text-4xl font-bold leading-none text-primary">10+</div>
            <div className="mt-1 font-sans text-[11px] font-medium text-primary/70">Tahun<br/>Terpercaya</div>
          </div>
        </div>

        <div>
          <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Tentang Kami</p>
          <h2 className="mb-4 font-serif font-bold leading-[1.1] text-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
            Mitra Resmi.<br/>Produk Asli.
          </h2>
          <p className="font-sans text-[15px] font-light leading-[1.7] text-muted-foreground">
            Kami adalah distributor resmi British Propolis di komunitas kami, memastikan setiap produk yang sampai ke tangan Anda adalah original langsung dari produsen.
          </p>
          <div className="mt-7 flex flex-col gap-5">
            {[
              { i: "🌿", t: "100% Original & Bersertifikat", s: "Setiap produk memiliki kode verifikasi keaslian yang dapat dicek langsung." },
              { i: "🚚", t: "Pengiriman Cepat & Aman", s: "Packing rapi, pengiriman ke seluruh Indonesia melalui kurir terpercaya." },
              { i: "💬", t: "Konsultasi Personal", s: "Kami bantu pilihkan produk yang paling tepat sesuai kondisi dan kebutuhan Anda." },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-base">{f.i}</div>
                <div>
                  <div className="font-sans text-[15px] font-medium text-foreground">{f.t}</div>
                  <div className="font-sans text-[13px] font-light leading-[1.5] text-muted-foreground">{f.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
