export default function Footer() {
  return (
    <footer className="bg-primary px-[5%] pb-8 pt-12 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="mb-3 font-serif text-2xl font-semibold">
            British <span className="text-secondary">Propolis</span>
          </div>
          <p className="font-sans text-[13px] font-light leading-[1.65] text-primary-foreground/40">
            Distributor resmi British Propolis & Belgie Skincare di Bandung. Produk kesehatan alami berkualitas untuk keluarga Indonesia tercinta.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-secondary">Produk</h4>
          <ul className="flex flex-col gap-2.5 font-sans text-[13px] font-light text-primary-foreground/50">
            <li><a href="#products" className="transition hover:text-primary-foreground">British Propolis</a></li>
            <li><a href="#products" className="transition hover:text-primary-foreground">Belgie Skincare</a></li>
            <li><a href="#reseller" className="transition hover:text-primary-foreground">Jadi Mitra</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-secondary">Info</h4>
          <ul className="flex flex-col gap-2.5 font-sans text-[13px] font-light text-primary-foreground/50">
            <li><a href="#education" className="transition hover:text-primary-foreground">Manfaat Propolis</a></li>
            <li><a href="#testimonials" className="transition hover:text-primary-foreground">Testimoni</a></li>
            <li><a href="#kontak" className="transition hover:text-primary-foreground">Kontak Kami</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-primary-foreground/10 pt-5 text-center font-sans text-xs text-primary-foreground/25">
        <div>© {new Date().getFullYear()} British Propolis. Distributor Resmi.</div>
        <div>Dibuat dengan ❤️ untuk kesehatan keluarga Indonesia</div>
      </div>
    </footer>
  );
}
