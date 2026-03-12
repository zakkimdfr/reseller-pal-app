import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "owner", "staff"] },
  { label: "Produk", href: "/dashboard/products", icon: Package, roles: ["admin", "owner"] },
  { label: "Inventori", href: "/dashboard/inventory", icon: ArrowLeftRight, roles: ["admin", "owner", "staff"] },
  { label: "Penjualan", href: "/dashboard/sales", icon: ShoppingCart, roles: ["admin", "owner", "staff"] },
  { label: "Laporan", href: "/dashboard/reports", icon: BarChart3, roles: ["admin", "owner"] },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = navItems.filter((n) => role && n.roles.includes(role));

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8 px-2">
        <h2 className="font-serif text-lg font-bold text-sidebar-foreground">BP Dashboard</h2>
        <p className="font-sans text-xs text-sidebar-foreground/60">{user?.email}</p>
        <span className="mt-1 inline-block rounded-full bg-sidebar-accent px-2 py-0.5 font-sans text-xs font-medium text-sidebar-accent-foreground capitalize">{role}</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {filtered.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 font-sans text-sm transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button variant="ghost" onClick={handleSignOut} className="mt-auto flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground">
        <LogOut className="h-4 w-4" /> Keluar
      </Button>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-col border-r bg-sidebar p-4 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-60 flex-col bg-sidebar p-4">
            <button onClick={() => setSidebarOpen(false)} className="mb-4 self-end text-sidebar-foreground">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b bg-background px-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-serif text-sm font-bold">BP Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
