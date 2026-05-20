import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Produk", id: "products" },
  { label: "Edukasi", id: "education" },
  { label: "Testimoni", id: "testimonials" },
  { label: "Jadi Reseller", id: "reseller" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/15">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold text-primary-foreground tracking-wide">
          British <span className="text-secondary">Propolis</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-light text-primary-foreground/70 transition hover:text-secondary tracking-wide">
              {l.label}
            </button>
          ))}
          <Link to="/login">
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium">
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full py-2 text-left text-sm font-medium text-muted-foreground"
            >
              {l.label}
            </button>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" variant="outline" className="mt-2 w-full border-primary/30 text-primary">Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
