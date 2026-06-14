import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserRole, PANEL_HOME, ROLE_LABELS, ROLES } from "@/lib/roles";
import { LayoutDashboard, User, Menu, X, Heart, LogOut, LogIn, UserPlus, MessageSquare } from "lucide-react";
import { useProcessNotifications } from "@/lib/useProcessNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import BrandLogo from "../brand/BrandLogo";

const seekerLinks = [
  { to: "/explorar?intent=compra", label: "Comprar", intent: "compra", theme: "compra" },
  { to: "/explorar", label: "Rentar", intent: "arriendo", theme: "rentar" },
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoadingAuth } = useAuth();
  const unreadCount = useProcessNotifications();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/60 shadow-[0_1px_0_hsl(var(--border)),0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="color-bar h-[2px] w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[56px]">
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

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/portal/mensajes" className="touch-target rounded-full hover:bg-secondary transition-colors" aria-label="Mensajes">
                <MessageSquare className="w-5 h-5 text-foreground/45" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
            <Link to="/favoritos" className="touch-target rounded-full hover:bg-secondary transition-colors" aria-label="Favoritos">
              <Heart className="w-5 h-5 text-foreground/45" />
            </Link>

            {!isLoadingAuth && isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/60 hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--brand-violet))] flex items-center justify-center text-white text-xs font-extrabold transition-smooth">
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
                          to="/publicar"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                        >
                          <User className="w-4 h-4" /> Publicar inmueble
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
            ) : !isLoadingAuth ? (
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
            ) : null}

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-match-quiz"))}
              className="hidden md:block gradient-cta text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-md shadow-brand-violet/20"
            >
              Match inteligente
            </button>

            <button className="lg:hidden touch-target rounded-full hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 pb-safe space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {seekerLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-center px-3 py-3 text-sm font-semibold rounded-xl transition-colors",
                      navLinkClass(link.theme, isNavLinkActive(link, location.pathname, location.search))
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {ownerLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-center px-3 py-3 text-sm font-semibold rounded-xl transition-colors",
                      navLinkClass(link.theme, isNavLinkActive(link, location.pathname, location.search))
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-3 text-xs text-muted-foreground border-t border-border/40">
                    Sesión: <span className="font-bold text-foreground">@{user.username}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      to={PANEL_HOME[getUserRole(user)] || "/portal"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 text-sm font-semibold hover:bg-secondary rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Mi panel
                    </Link>
                    <Link
                      to="/favoritos"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 text-sm font-semibold hover:bg-secondary rounded-xl"
                    >
                      <Heart className="w-4 h-4" /> Mis guardados
                    </Link>
                    <Link
                      to="/publicar"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 text-sm font-semibold hover:bg-secondary rounded-xl"
                    >
                      <User className="w-4 h-4" /> Publicar inmueble
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-3 text-sm font-semibold text-destructive hover:bg-destructive/5 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-border font-bold text-sm"
                  >
                    <LogIn className="w-4 h-4" /> Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 gradient-cta text-white font-bold py-3 rounded-xl"
                  >
                    <UserPlus className="w-4 h-4" /> Registrarse
                  </Link>
                </div>
              )}

              <button
                onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent("open-match-quiz")); }}
                className="w-full mt-2 gradient-cta text-white font-bold py-3 rounded-full"
              >
                Match inteligente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
