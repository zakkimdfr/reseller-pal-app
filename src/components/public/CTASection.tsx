import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section id="reseller" className="bg-primary/90 py-16 text-primary-foreground md:py-24 scroll-mt-20">
      <div className="container text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">Program Mitra</p>
        <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl text-primary-foreground">Bergabung sebagai<br/>Mitra Reseller</h2>
        <p className="mx-auto mb-10 max-w-lg font-sans text-base font-light opacity-60 leading-relaxed">
          Mulai bisnis Anda sendiri dengan menjual produk British Propolis & Belgie. Modal terjangkau, margin menarik, support penuh dari kami.
        </p>
        <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "💰", title: "Margin Menarik", desc: "Keuntungan hingga 38% per produk" },
            { icon: "📦", title: "Stok Fleksibel", desc: "Mulai dari 1 dus, beli sesuai kebutuhan" },
            { icon: "🤝", title: "Dukungan Penuh", desc: "Materi promosi & konsultasi bisnis gratis" },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
              <div className="mb-2 text-2xl">{b.icon}</div>
              <p className="mb-1 font-sans text-sm font-semibold text-primary-foreground">{b.title}</p>
              <p className="font-sans text-xs font-light text-primary-foreground/50">{b.desc}</p>
            </div>
          ))}
        </div>
        <a href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20tertarik%20jadi%20mitra%20reseller" target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <MessageCircle className="mr-2 h-4 w-4" /> Daftar Jadi Mitra
          </Button>
        </a>
      </div>
    </section>
  );
}
