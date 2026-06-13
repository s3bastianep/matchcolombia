import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, User, LogOut, LogIn, UserPlus, Search, KeyRound, TrendingUp, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import BrandLogo from "../brand/BrandLogo";

const seekerLinks = [
  { to: "/explorar?intent=compra", label: "Comprar", intent: "compra", icon: Search },
  { to: "/explorar", label: "Rentar", intent: "arriendo", icon: KeyRound },
];

const ownerLinks = [
  { to: "/publicar", label: "Vender", publish: true, icon: TrendingUp, tone: "sell" },
  { to: "/anunciar", label: "Anunciar", advertise: true, icon: Megaphone, tone: "advertise" },
];

function NavLink({ link, pathname, search, variant = "seeker" }) {
  const active = isNavLinkActive(link, pathname, search);
  const isOwner = variant === "owner";
  const Icon = link.icon;

  return (
    <Link to={link.to} className="flex-1 min-w-0">
      <span
        className={cn(
          "flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap",
          active && !isOwner && "bg-white text-[hsl(265,75%,48%)] shadow-sm ring-1 ring-white/80",
          !active && !isOwner && "text-foreground/60 hover:text-foreground hover:bg-white/50",
          active && isOwner && link.tone === "sell" && "bg-gradient-to-r from-[hsl(32,95%,54%)] to-[hsl(340,82%,52%)] text-white shadow-md shadow-[hsl(340,82%,52%)]/25",
          active && isOwner && link.tone === "advertise" && "bg-[hsl(265,35%,22%)] text-white shadow-md",
          !active && isOwner && link.tone === "sell" && "text-[hsl(32,70%,38%)] hover:bg-white/80 hover:text-[hsl(32,80%,32%)]",
          !active && isOwner && link.tone === "advertise" && "text-[hsl(265,50%,42%)] hover:bg-white/80 hover:text-[hsl(265,35%,28%)]"
        )}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2.25} />}
        {link.label}
      </span>
    </Link>
  );
}

function NavGroup({ label, links, variant, pathname, search }) {
  const isOwner = variant === "owner";

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={cn(
          "text-[9px] font-extrabold uppercase tracking-[0.16em] leading-none pl-1",
          isOwner ? "text-[hsl(265,75%,48%)]" : "text-[hsl(200,50%,42%)]"
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "flex items-center gap-0.5 p-1 rounded-full",
          isOwner
            ? "bg-[hsl(265,30%,93%)] ring-1 ring-[hsl(265,75%,58%)]/25 shadow-sm"
            : "bg-[hsl(210,35%,94%)] ring-1 ring-[hsl(200,60%,88%)]/80 shadow-sm"
        )}
      >
        {links.map((link) => (
          <NavLink key={link.label} link={link} pathname={pathname} search={search} variant={variant} />
        ))}
      </div>
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

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="color-bar h-[2px] w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[60px] lg:h-[64px]">
          <BrandLogo size="sm" />

          <div className="hidden lg:flex items-center gap-5">
            <NavGroup
              label="Buscar"
              links={seekerLinks}
              variant="seeker"
              pathname={location.pathname}
              search={location.search}
            />

            <div className="flex flex-col items-center gap-1 self-stretch py-1" aria-hidden>
              <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
            </div>

            <NavGroup
              label="Publicar"
              links={ownerLinks}
              variant="owner"
              pathname={location.pathname}
              search={location.search}
            />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/favoritos" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Heart className="w-5 h-5 text-foreground/45" />
            </Link>

            {!isLoadingAuth && isAuthenticated && user ? (
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
                        </div>
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
              className="hidden md:block gradient-cta text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-md shadow-[hsl(265,75%,58%)]/20"
            >
              Empieza tu match
            </button>

            <button className="lg:hidden p-2 rounded-full hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
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
            <div className="px-4 py-3 space-y-4">
              <div>
                <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[hsl(200,50%,42%)]">
                  Buscar inmueble
                </p>
                <div className="flex gap-1 p-1 rounded-full bg-[hsl(210,35%,94%)] ring-1 ring-[hsl(200,60%,88%)]/80">
                  {seekerLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isNavLinkActive(link, location.pathname, location.search);
                    return (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold rounded-full transition-colors",
                          active ? "bg-white text-[hsl(265,75%,48%)] shadow-sm" : "text-foreground/65 hover:bg-white/50"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[hsl(265,75%,48%)]">
                  Publicar inmueble
                </p>
                <div className="flex gap-1 p-1 rounded-full bg-[hsl(265,30%,93%)] ring-1 ring-[hsl(265,75%,58%)]/25">
                  {ownerLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isNavLinkActive(link, location.pathname, location.search);
                    return (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold rounded-full transition-colors",
                          active && link.tone === "sell" && "bg-gradient-to-r from-[hsl(32,95%,54%)] to-[hsl(340,82%,52%)] text-white shadow-sm",
                          active && link.tone === "advertise" && "bg-[hsl(265,35%,22%)] text-white shadow-sm",
                          !active && link.tone === "sell" && "text-[hsl(32,70%,38%)] hover:bg-white/70",
                          !active && link.tone === "advertise" && "text-[hsl(265,50%,42%)] hover:bg-white/70"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-3 text-xs text-muted-foreground border-t border-border/40 mt-2">
                    Sesión: <span className="font-bold text-foreground">@{user.username}</span>
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
                Empieza tu match
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
