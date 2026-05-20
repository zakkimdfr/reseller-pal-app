import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">British Propolis</h3>
            <p className="text-sm font-light opacity-60 leading-relaxed">
              Distributor resmi British Propolis & Belgie Skincare di Bandung. Produk kesehatan alami berkualitas untuk keluarga Indonesia.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider opacity-70">Navigasi</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100">Home</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100">Produk</Link>
              <Link to="/testimonials" className="text-sm opacity-80 hover:opacity-100">Testimoni</Link>
              <Link to="/reseller" className="text-sm opacity-80 hover:opacity-100">Jadi Reseller</Link>
            </div>
          </div>
          <div>
            {/* <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider opacity-70">Belanja</h4> */}
            <div>
              <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider opacity-70">Kontak</h4>
              <div className="flex flex-col gap-2">
                <a href="https://wa.me/628XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-sm opacity-70 hover:opacity-100 hover:text-secondary transition">WhatsApp</a>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs opacity-60">
          © {new Date().getFullYear()} British Propolis. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
