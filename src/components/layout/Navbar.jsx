import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserRole, PANEL_HOME, ROLE_LABELS } from "@/lib/roles";
import { LayoutDashboard, Heart, LogOut, LogIn, UserPlus, Building2, TrendingUp, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import BrandLogo from "../brand/BrandLogo";

const seekerLinks = [
  { to: "/explorar?intent=compra", label: "Comprar", intent: "compra", theme: "compra" },
  { to: "/explorar", label: "Arrendar", intent: "arriendo", theme: "rentar" },
];

const ownerLinks = [
  { to: "/publicar", label: "Vender", publish: true, theme: "vender" },
  { to: "/anunciar", label: "Anunciar", advertise: true, theme: "anunciar" },
];

const NAV_THEMES = {
  compra: {
    idle: "text-brand-violet hover:text-brand-violet/80",
    active: "bg-brand-violet/10 text-brand-violet font-semibold",
  },
  rentar: {
    idle: "text-brand-magenta hover:text-brand-magenta/80",
    active: "bg-brand-magenta/10 text-brand-magenta font-semibold",
  },
  vender: {
    idle: "text-brand-magenta hover:text-brand-magenta/80",
    active: "bg-brand-magenta/10 text-brand-magenta font-semibold",
  },
  anunciar: {
    idle: "text-brand-violet hover:text-brand-violet/80",
    active: "bg-brand-violet/10 text-brand-violet font-semibold",
  },
};

function navLinkClass(theme, active) {
  const t = NAV_THEMES[theme];
  return cn(
    "block px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
    active ? t.active : t.idle
  );
}

function NavLink({ link, pathname, search }) {
  const active = isNavLinkActive(link, pathname, search);

  return (
    <Link to={link.to}>
      <span className={navLinkClass(link.theme, active)}>
        {link.label}
      </span>
    </Link>
  );
}

function NavGroup({ links, pathname, search }) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-secondary/70">
      {links.map((link) => (
        <NavLink key={link.label} link={link} pathname={pathname} search={search} />
      ))}
    </div>
  );
}

function isNavLinkActive(link, pathname, search) {
  if (link.advertise) return pathname === "/anunciar";
  if (link.publish) return pathname.startsWith("/publicar");
  if (pathname !== "/explorar") return false;
  const intent = new URLSearchParams(search).get("intent");
  if (link.intent === "compra") return intent === "compra";
  return intent !== "compra";
}

export default function Navbar({ onAccountClick = () => {} }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoadingAuth } = useAuth();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="color-bar h-[2px] w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-14 lg:h-[56px]">
          <BrandLogo size="sm" />

          <div className="hidden lg:flex items-center gap-3">
            <NavGroup
              links={seekerLinks}
              pathname={location.pathname}
              search={location.search}
            />

            <div className="w-px h-4 bg-border/80" aria-hidden />

            <NavGroup
              links={ownerLinks}
              pathname={location.pathname}
              search={location.search}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/favoritos" className="hidden sm:flex p-2 rounded-full hover:bg-secondary transition-colors">
              <Heart className="w-5 h-5 text-foreground/45" />
            </Link>

            {!isLoadingAuth && isAuthenticated && user ? (
              <>
                <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/60 hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-white text-xs font-extrabold">
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-bold max-w-[100px] truncate">{user.username}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-border/50 shadow-xl z-50 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border/40">
                          <p className="font-bold text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                          <p className="text-[10px] font-semibold text-brand-violet mt-1">{ROLE_LABELS[getUserRole(user)]}</p>
                        </div>
                        <Link
                          to={PANEL_HOME[getUserRole(user)] || "/portal"}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Mi panel
                        </Link>
                        <Link
                          to="/favoritos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                          <Heart className="w-4 h-4" /> Mis guardados
                        </Link>
                        <Link
                          to="/anunciar"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                          <Building2 className="w-4 h-4" /> Anunciar inmueble
                        </Link>
                        <Link
                          to="/publicar"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                          <TrendingUp className="w-4 h-4" /> Vender inmueble
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Cerrar sesión
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
                <button
                  type="button"
                  onClick={onAccountClick}
                  className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border/60 bg-secondary/50"
                  aria-label="Mi cuenta"
                >
                  <div className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-white text-xs font-extrabold">
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>
              </>
            ) : !isLoadingAuth ? (
              <>
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-bold text-foreground/70 hover:text-foreground px-4 py-2.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="gradient-cta text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-md"
                >
                  Registrarse
                </Link>
              </div>
                <button
                  type="button"
                  onClick={onAccountClick}
                  className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border/60 hover:bg-secondary transition-colors"
                  aria-label="Iniciar sesión"
                >
                  <User className="w-5 h-5 text-foreground/60" />
                </button>
              </>
            ) : null}

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
              className="hidden md:block gradient-cta text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-md shadow-brand-violet/20"
            >
              Match inteligente
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
