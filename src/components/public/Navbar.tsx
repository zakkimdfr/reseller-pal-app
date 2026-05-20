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
<<<<<<< HEAD
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/15">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold text-primary-foreground tracking-wide">
          British <span className="text-secondary">Propolis</span>
=======
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          British Propolis
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
<<<<<<< HEAD
              className="text-sm font-light text-primary-foreground/70 transition hover:text-secondary tracking-wide">
=======
              className="relative text-sm font-medium text-muted-foreground transition hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
              {l.label}
            </button>
          ))}
          <Link to="/login">
<<<<<<< HEAD
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium">
=======
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
>>>>>>> de76d127878e4568f1fddf8edfd693ffe015144c
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
