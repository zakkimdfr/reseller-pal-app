import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">British Propolis</h3>
            <p className="text-sm opacity-80">
              Produk kesehatan alami terbaik dari British Propolis untuk keluarga Indonesia.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider opacity-70">Navigasi</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100">Home</Link>
              <Link to="/products" className="text-sm opacity-80 hover:opacity-100">Produk</Link>
              <Link to="/education" className="text-sm opacity-80 hover:opacity-100">Edukasi</Link>
              <Link to="/reseller" className="text-sm opacity-80 hover:opacity-100">Jadi Reseller</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider opacity-70">Belanja</h4>
            <div className="flex flex-col gap-2">
              <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100">Shopee</a>
              <a href="https://tokopedia.com" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100">Tokopedia</a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100">WhatsApp</a>
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
