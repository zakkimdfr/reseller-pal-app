import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="bg-secondary py-16 text-secondary-foreground md:py-24">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Tertarik Jadi Reseller?</h2>
        <p className="mx-auto mb-8 max-w-lg font-sans text-base opacity-90">
          Dapatkan harga khusus reseller dan mulai bisnis kesehatan bersama British Propolis. Modal kecil, untung besar!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <MessageCircle className="mr-2 h-4 w-4" /> Hubungi Kami
            </Button>
          </a>
          <Link to="/reseller">
            <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
              Pelajari Selengkapnya
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
