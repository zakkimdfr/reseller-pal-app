<<<<<<< HEAD
import { Shield, Heart, Leaf, Sparkles, Zap, FlaskConical } from "lucide-react";
=======
import { Shield, Heart, Leaf, Sparkles } from "lucide-react";
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c

const benefits = [
  { icon: Shield, title: "Meningkatkan Imunitas", desc: "Propolis mengandung flavonoid yang memperkuat sistem kekebalan tubuh secara alami." },
  { icon: Heart, title: "Menjaga Kesehatan Jantung", desc: "Membantu menjaga kolesterol dan tekanan darah tetap stabil." },
  { icon: Leaf, title: "100% Alami", desc: "Dibuat dari bahan-bahan alami tanpa bahan kimia berbahaya." },
  { icon: Sparkles, title: "Perawatan Kulit", desc: "Rangkaian skincare Belgie untuk kulit sehat, cerah, dan terawat." },
<<<<<<< HEAD
  { icon: FlaskConical, title: "Teruji Klinis", desc: "Formula telah melalui uji klinis dan mendapatkan sertifikasi dari lembaga kesehatan terpercaya." },
  { icon: Zap, title: "Antioksidan Tinggi", desc: "Kandungan antioksidan tinggi melawan radikal bebas dan memperlambat penuaan sel." },
=======
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
];

export default function BenefitsSection() {
  return (
<<<<<<< HEAD
    <section className="bg-primary py-16 md:py-24">
=======
    <section className="bg-muted py-16 md:py-24">
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Mengapa British Propolis?</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Manfaat Kesehatan Propolis</h2>
        </div>
<<<<<<< HEAD
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-7 transition hover:border-secondary/30 hover:bg-primary-foreground/8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/20">
                <b.icon className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-primary-foreground">{b.title}</h3>
              <p className="font-sans text-sm font-light text-primary-foreground/50 leading-relaxed">{b.desc}</p>
=======
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-sans text-base font-semibold text-foreground">{b.title}</h3>
              <p className="font-sans text-sm text-muted-foreground">{b.desc}</p>
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
