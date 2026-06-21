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
  Sparkles,
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

const searchItems = [
  { to: "/explorar", label: "Arrendar inmueble", intent: "arriendo" },
  { to: "/explorar?intent=compra", label: "Comprar inmueble", intent: "compra" },
];

const toolItems = (onMatchClick) => [
  { to: "/favoritos", label: "Mis favoritos" },
  { label: "Match inteligente", onClick: onMatchClick },
];

const ownerItems = [
  { to: "/anunciar", label: "Anunciar inmueble", advertise: true },
  { to: "/publicar", label: "Vender propiedad", publish: true },
  { to: "/portal", label: "Portal propietario" },
];

function isItemActive(item, pathname, search) {
  if (item.advertise) return pathname === "/anunciar";
  if (item.publish) return pathname.startsWith("/publicar");
  if (item.to === "/portal") return pathname.startsWith("/portal");
  if (item.to === "/favoritos") return pathname === "/favoritos";
  if (!item.to?.startsWith("/explorar")) return false;
  if (pathname !== "/explorar") return false;
  const intent = new URLSearchParams(search).get("intent");
  if (item.intent === "compra") return intent === "compra";
  return intent !== "compra";
}

function isGroupActive(items, pathname, search) {
  return items.some((item) => isItemActive(item, pathname, search));
}

function NavMenu({ label, items, pathname, search }) {
  const active = isGroupActive(items, pathname, search);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 outline-none transition-colors",
          "text-[15px] font-medium text-foreground/85 hover:text-foreground",
          "data-[state=open]:text-foreground",
          active && "text-foreground font-semibold"
        )}
      >
        {label}
        <ChevronDown className="w-4 h-4 text-foreground/45" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className="w-56 rounded-xl p-1.5 shadow-lg border-border/70">
        {items.map((item) =>
          item.onClick ? (
            <DropdownMenuItem
              key={item.label}
              onSelect={() => item.onClick()}
              className="rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-violet" strokeWidth={2} />
              {item.label}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                to={item.to}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer",
                  isItemActive(item, pathname, search) && "bg-secondary font-semibold"
                )}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 outline-none transition-colors",
          "text-[15px] font-medium text-foreground/85 hover:text-foreground",
          "data-[state=open]:text-foreground"
        )}
      >
        {user.username}
        <ChevronDown className="w-4 h-4 text-foreground/45" strokeWidth={2} />
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
  );
}

export default function Navbar({ onAccountClick = () => {} }) {
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoadingAuth } = useAuth();

  const openMatch = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="color-bar w-full h-[2px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8 lg:gap-10">
          <BrandLogo size="sm" />

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <NavMenu
              label="Buscar inmuebles"
              items={searchItems}
              pathname={location.pathname}
              search={location.search}
            />
            <NavMenu
              label="Herramientas"
              items={toolItems(openMatch)}
              pathname={location.pathname}
              search={location.search}
            />
            <NavMenu
              label="Para propietarios"
              items={ownerItems}
              pathname={location.pathname}
              search={location.search}
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5 ml-auto">
            <Link
              to="/favoritos"
              className="hidden sm:flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Mis favoritos"
            >
              <Heart className="w-[22px] h-[22px]" strokeWidth={1.75} />
            </Link>

            {!isLoadingAuth && isAuthenticated && user ? (
              <div className="hidden sm:block">
                <UserMenu user={user} onLogout={logout} />
              </div>
            ) : !isLoadingAuth ? (
              <div className="hidden sm:flex items-center gap-5">
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="gradient-cta btn-glow inline-flex items-center justify-center px-5 py-2.5 rounded-md text-[15px] font-semibold"
                >
                  Registrarse
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
