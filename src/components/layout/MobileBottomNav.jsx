import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Sparkles, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/haptics";

const TABS = [
  { id: "home", to: "/", label: "Inicio", icon: Home, match: (path) => path === "/" },
  {
    id: "explore",
    to: "/explorar",
    label: "Buscar",
    icon: Search,
    match: (path) => path === "/explorar" || path.startsWith("/propiedad"),
  },
  { id: "quiz", type: "action", label: "Cuestionario", icon: Sparkles },
  { id: "favorites", to: "/favoritos", label: "Guardados", icon: Heart, match: (path) => path === "/favoritos" },
  { id: "account", type: "account", label: "Cuenta", icon: User },
];

function NavItem({ active, label, icon: Icon, onClick, to, accent }) {
  const handleClick = (e) => {
    if (onClick) {
      hapticLight();
      onClick(e);
    }
  };

  const body = (
    <>
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl transition-all duration-200",
          accent
            ? "h-9 w-9 gradient-cta shadow-sm"
            : active
              ? "h-9 w-9 bg-brand-violet/12"
              : "h-9 w-9"
        )}
      >
        <Icon
          className={cn(
            "w-[22px] h-[22px] shrink-0 transition-colors",
            accent && "text-white",
            !accent && active && "text-brand-magenta",
            !accent && !active && "text-muted-foreground"
          )}
          strokeWidth={active || accent ? 2.25 : 1.85}
        />
      </span>
      <span
        className={cn(
          "text-[10px] leading-none mt-1.5 transition-colors",
          accent && "font-bold text-brand-violet",
          !accent && active && "font-bold text-brand-violet",
          !accent && !active && "font-medium text-muted-foreground"
        )}
      >
        {label}
      </span>
    </>
  );

  const className = cn(
    "relative flex flex-col items-center justify-center flex-1 min-w-0 h-full",
    "active:opacity-70 transition-opacity"
  );

  if (to) {
    return (
      <Link to={to} className={className} onClick={() => hapticLight()} aria-current={active ? "page" : undefined}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {body}
    </button>
  );
}

export default function MobileBottomNav({ onMatchClick, onAccountClick, accountActive }) {
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 native-tab-bar pb-safe" aria-label="Navegación principal">
      <div className="flex items-stretch h-[56px] max-w-lg mx-auto px-1">
        {TABS.map((tab) => {
          const active =
            tab.type === "account"
              ? accountActive
              : tab.type === "action"
                ? false
                : tab.match?.(pathname);

          if (tab.type === "action") {
            return (
              <NavItem key={tab.id} label={tab.label} icon={tab.icon} accent onClick={onMatchClick} />
            );
          }

          if (tab.type === "account") {
            return (
              <NavItem key={tab.id} label={tab.label} icon={tab.icon} active={active} onClick={onAccountClick} />
            );
          }

          return <NavItem key={tab.id} to={tab.to} label={tab.label} icon={tab.icon} active={active} />;
        })}
      </div>
    </nav>
  );
}
