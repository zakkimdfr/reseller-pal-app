import { Shield, Heart, Leaf, Sparkles, Zap, FlaskConical } from "lucide-react";

const benefits = [
  { icon: Shield, title: "Meningkatkan Imunitas", desc: "Propolis mengandung flavonoid yang memperkuat sistem kekebalan tubuh secara alami." },
  { icon: Heart, title: "Menjaga Kesehatan Jantung", desc: "Membantu menjaga kolesterol dan tekanan darah tetap stabil." },
  { icon: Leaf, title: "100% Alami", desc: "Dibuat dari bahan-bahan alami tanpa bahan kimia berbahaya." },
  { icon: Sparkles, title: "Perawatan Kulit", desc: "Rangkaian skincare Belgie untuk kulit sehat, cerah, dan terawat." },
  { icon: FlaskConical, title: "Teruji Klinis", desc: "Formula telah melalui uji klinis dan mendapatkan sertifikasi dari lembaga kesehatan terpercaya." },
  { icon: Zap, title: "Antioksidan Tinggi", desc: "Kandungan antioksidan tinggi melawan radikal bebas dan memperlambat penuaan sel." },
];

export default function BenefitsSection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Mengapa British Propolis?</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Manfaat Kesehatan Propolis</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-7 transition hover:border-secondary/30 hover:bg-primary-foreground/8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/20">
                <b.icon className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-primary-foreground">{b.title}</h3>
              <p className="font-sans text-sm font-light text-primary-foreground/50 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
