import { Shield, Heart, Leaf, Sparkles } from "lucide-react";

const benefits = [
  { icon: Shield, title: "Meningkatkan Imunitas", desc: "Propolis mengandung flavonoid yang memperkuat sistem kekebalan tubuh secara alami." },
  { icon: Heart, title: "Menjaga Kesehatan Jantung", desc: "Membantu menjaga kolesterol dan tekanan darah tetap stabil." },
  { icon: Leaf, title: "100% Alami", desc: "Dibuat dari bahan-bahan alami tanpa bahan kimia berbahaya." },
  { icon: Sparkles, title: "Perawatan Kulit", desc: "Rangkaian skincare Belgie untuk kulit sehat, cerah, dan terawat." },
];

export default function BenefitsSection() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-widest text-secondary">Mengapa British Propolis?</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Manfaat Kesehatan Propolis</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-sans text-base font-semibold text-foreground">{b.title}</h3>
              <p className="font-sans text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
