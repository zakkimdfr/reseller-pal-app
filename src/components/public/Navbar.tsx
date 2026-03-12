import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Edukasi", href: "/education" },
  { label: "Testimoni", href: "/testimonials" },
  { label: "Jadi Reseller", href: "/reseller" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold text-primary">
          British Propolis
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="text-sm font-medium text-muted-foreground transition hover:text-primary">
              {l.label}
            </Link>
          ))}
          <Link to="/login">
            <Button size="sm">Dashboard</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button size="sm" className="mt-2 w-full">Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
