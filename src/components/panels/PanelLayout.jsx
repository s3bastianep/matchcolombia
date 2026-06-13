import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/brand/BrandLogo";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Menu, X } from "lucide-react";

export default function PanelLayout({ title, subtitle, navItems, accent = "purple" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const accentRing =
    accent === "orange"
      ? "bg-[hsl(32,95%,54%)]"
      : accent === "green"
        ? "bg-[hsl(168,72%,40%)]"
        : accent === "blue"
          ? "bg-[hsl(200,70%,42%)]"
          : "bg-[hsl(265,75%,58%)]";

  return (
    <div className="min-h-screen bg-[hsl(240,30%,98%)] flex">
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border/40 flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-border/30">
          <Link to="/" className="block mb-4">
            <BrandLogo size="sm" />
          </Link>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  active ? "bg-[hsl(265,75%,58%)]/10 text-[hsl(265,75%,45%)]" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-foreground text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/30">
          <p className="text-xs font-semibold truncate">{user?.name}</p>
          <p className="text-[10px] text-muted-foreground truncate mb-3">@{user?.username}</p>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {open && (
        <button type="button" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
      )}

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border/30 px-4 lg:px-8 py-3 flex items-center gap-3">
          <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className={cn("w-1 h-6 rounded-full shrink-0", accentRing)} />
          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-sm truncate">
              {navItems.find((i) => location.pathname === i.to || location.pathname.startsWith(`${i.to}/`))?.label || title}
            </h1>
          </div>
          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground hidden sm:block">
            Ver sitio →
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
