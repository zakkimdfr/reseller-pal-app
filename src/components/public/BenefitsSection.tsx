const items = [
  { i: "🛡️", t: "Meningkatkan Imunitas", d: "Flavonoid dalam propolis memperkuat sistem kekebalan tubuh secara alami dan berkelanjutan." },
  { i: "❤️", t: "Kesehatan Jantung", d: "Membantu menjaga kadar kolesterol normal dan tekanan darah tetap stabil." },
  { i: "🌿", t: "100% Bahan Alami", d: "Tanpa bahan kimia berbahaya. Aman untuk seluruh anggota keluarga termasuk anak-anak." },
  { i: "✨", t: "Perawatan Kulit", d: "Rangkaian Belgie Skincare untuk kulit sehat, cerah, dan terawat dari dalam maupun luar." },
  { i: "🔬", t: "Teruji Klinis", d: "Formula telah melalui uji klinis dan mendapatkan sertifikasi dari lembaga kesehatan terpercaya." },
  { i: "🍯", t: "Antioksidan Tinggi", d: "Kandungan antioksidan tinggi melawan radikal bebas dan memperlambat proses penuaan sel." },
];

export default function BenefitsSection() {
  return (
    <section id="education" className="bg-primary px-[5%] py-20 md:py-24 scroll-mt-20">
      <div className="mx-auto mb-12 max-w-6xl">
        <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">Manfaat & Keunggulan</p>
        <h2 className="font-serif font-bold leading-[1.1] text-primary-foreground" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
          Kenapa Ribuan Keluarga<br/>Percaya British Propolis?
        </h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div key={b.t} className="rounded-[10px] border border-primary-foreground/10 bg-primary-foreground/[0.04] p-7 transition hover:border-secondary/30 hover:bg-primary-foreground/[0.08]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/15 text-xl">{b.i}</div>
            <h3 className="mb-2 font-serif text-xl font-semibold text-primary-foreground">{b.t}</h3>
            <p className="font-sans text-[13.5px] font-light leading-[1.65] text-primary-foreground/50">{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
