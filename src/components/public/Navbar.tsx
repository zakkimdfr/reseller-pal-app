import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Produk", id: "products" },
  { label: "Manfaat", id: "education" },
  { label: "Testimoni", id: "testimonials" },
  { label: "Jadi Mitra", id: "reseller" },
  { label: "Kontak", id: "kontak" },
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-[100] flex h-[68px] items-center justify-between border-b border-secondary/15 bg-primary/95 px-[5%] backdrop-blur-md">
        <Link to="/" className="font-serif text-[22px] font-semibold tracking-wide text-primary-foreground">
          British <span className="text-secondary">Propolis</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollTo(l.id)}
                className="font-sans text-[13.5px] text-primary-foreground/70 tracking-wide transition hover:text-secondary"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://wa.me/628XXXXXXXXX?text=Halo%2C%20saya%20ingin%20tanya%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-secondary px-5 py-2.5 font-sans text-[13px] font-medium text-primary transition hover:bg-secondary/90"
          >
            Order via WA
          </a>
          <Link
            to="/login"
            className="font-sans text-[12px] text-primary-foreground/40 transition hover:text-primary-foreground/70"
            title="Internal Dashboard"
          >
            •
          </Link>
        </div>

        <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-[68px] z-[99] flex flex-col border-t border-secondary/15 bg-primary px-[5%] py-5 md:hidden">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="border-b border-white/[0.06] py-3 text-left font-sans text-[15px] text-primary-foreground/75"
            >
              {l.label}
            </button>
          ))}
          <a
            href="https://wa.me/628XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 text-left font-sans text-[15px] text-secondary"
          >
            Order via WhatsApp ↗
          </a>
        </div>
      )}

      <div className="h-[68px]" />
    </>
  );
}
