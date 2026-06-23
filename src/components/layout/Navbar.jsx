import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserRole, PANEL_HOME, ROLE_LABELS } from "@/lib/roles";
import {
  LayoutDashboard,
  Heart,
  LogOut,
  Building2,
  TrendingUp,
  User,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import BrandLogo from "../brand/BrandLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/explorar", label: "Arrendar", intent: "arriendo" },
  { to: "/explorar/compra", label: "Comprar", intent: "compra" },
];

const advertiseItems = [
  { to: "/anunciar", label: "Renta", rent: true },
  { to: "/publicar", label: "Venta", sale: true },
];

function isNavLinkActive(item, pathname, search) {
  if (pathname !== "/explorar") return false;
  const intent = new URLSearchParams(search).get("intent");
  if (item.intent === "compra") return intent === "compra";
  return intent !== "compra";
}

function isAdvertiseItemActive(item, pathname) {
  if (item.rent) return pathname === "/anunciar";
  if (item.sale) return pathname.startsWith("/publicar");
  return false;
}

function isAdvertiseActive(pathname) {
  return pathname === "/anunciar" || pathname.startsWith("/publicar");
}

function AnunciarNavMenu({ pathname }) {
  const active = isAdvertiseActive(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1 py-2 outline-none transition-colors",
          "text-[15px] font-semibold leading-none text-foreground/85 hover:text-foreground",
          "data-[state=open]:text-foreground",
          active && "text-foreground"
        )}
      >
        Anunciar
        <ChevronDown className="size-4 text-foreground/45" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-44 rounded-xl p-1.5 shadow-lg border-border/70">
        {advertiseItems.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link
              to={item.to}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-semibold cursor-pointer",
                isAdvertiseItemActive(item, pathname) && "bg-secondary"
              )}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ user, onLogout }) {
  const initial = (user.username?.[0] || user.name?.[0] || "U").toUpperCase();

  return (
    <div className="flex items-center">
      <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group inline-flex h-9 items-center gap-2.5 rounded-lg px-1 pr-2 outline-none transition-opacity hover:opacity-90",
          "text-sm font-bold leading-none text-foreground",
          "data-[state=open]:opacity-90 [&_svg]:block"
        )}
      >
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full gradient-cta text-[11px] font-extrabold text-white shadow-sm">
          {initial}
        </span>
        <span className="max-w-[7rem] truncate">{user.username}</span>
        <ChevronDown className="size-4 shrink-0 text-foreground/45" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-56 rounded-xl p-1.5 shadow-lg border-border/70">
        <div className="px-3 py-2.5 border-b border-border/50 mb-1">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          <p className="text-[10px] font-semibold text-brand-violet mt-1">
            {ROLE_LABELS[getUserRole(user)]}
          </p>
        </div>
        <DropdownMenuItem asChild>
          <Link
            to={PANEL_HOME[getUserRole(user)] || "/portal"}
            className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Mi panel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/favoritos" className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer">
            <Heart className="w-4 h-4" />
            Mis favoritos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/anunciar" className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer">
            <Building2 className="w-4 h-4" />
            Anunciar inmueble
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/publicar" className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            Vender propiedad
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onSelect={onLogout}
          className="rounded-lg px-3 py-2.5 text-sm font-medium text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function Navbar({ onAccountClick = () => {} }) {
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoadingAuth } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="color-bar w-full h-[2px]" />
      <div className="site-container">
        <div className="flex items-center h-14">
          <BrandLogo size="nav" layout="lockup" className="flex items-center shrink-0" />

          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
            <div className="hidden lg:flex items-center gap-4 sm:gap-5">
              {navLinks.map((item) => {
                const active = isNavLinkActive(item, location.pathname, location.search);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={cn(
                      "inline-flex items-center py-2 text-[15px] font-semibold leading-none transition-colors",
                      active
                        ? "text-foreground"
                        : "text-foreground/85 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <AnunciarNavMenu pathname={location.pathname} />
            </div>

            {!isLoadingAuth && isAuthenticated && user ? (
              <div className="hidden sm:flex items-center ml-4 lg:ml-6 pl-4 lg:pl-6 border-l border-border/50">
                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : !isLoadingAuth ? (
              <div className="hidden sm:flex items-center ml-4 lg:ml-6 pl-4 lg:pl-6 border-l border-border/50">
                <Link
                  to="/login"
                  className="group inline-flex h-9 items-center gap-2.5 rounded-lg px-1 pr-2 text-sm font-bold leading-none transition-opacity hover:opacity-90 [&_svg]:block"
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full gradient-cta shadow-sm">
                    <User className="size-3.5 text-white" strokeWidth={2.25} />
                  </span>
                  <span className="text-gradient">Entrar</span>
                </Link>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onAccountClick}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label={isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
            >
              <User className="w-5 h-5 text-foreground/60" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
