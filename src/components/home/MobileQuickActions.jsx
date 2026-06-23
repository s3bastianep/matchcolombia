import React from "react";
import { Link } from "react-router-dom";
import { KeyRound, Home, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    to: "/explorar",
    label: "Arrendar",
    desc: "Apartamentos y casas",
    icon: KeyRound,
    theme: "from-brand-magenta/15 to-brand-magenta/5 border-brand-magenta/20 text-brand-magenta",
  },
  {
    to: "/explorar?intent=compra",
    label: "Comprar",
    desc: "Inmuebles en venta",
    icon: Home,
    theme: "from-brand-violet/15 to-brand-violet/5 border-brand-violet/20 text-brand-violet",
  },
  {
    to: "/anunciar",
    label: "Publicar",
    desc: "Anuncia tu inmueble",
    icon: Building2,
    theme: "from-brand-violet/12 to-brand-magenta/8 border-border text-foreground",
  },
];

export default function MobileQuickActions({ onMatchClick }) {
  return (
    <section className="lg:hidden px-4 -mt-2 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to}
              to={action.to}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border bg-gradient-to-br p-4 min-h-[88px] active:scale-[0.98] transition-transform",
                action.theme
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={2.25} />
              <div>
                <p className="font-bold text-sm leading-tight">{action.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{action.desc}</p>
              </div>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMatchClick}
          className="col-span-2 flex items-center justify-center gap-2 rounded-2xl gradient-cta text-white font-bold py-3.5 shadow-md shadow-brand-magenta/25 active:scale-[0.99] transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          Cuestionario Habibar — encuentra tu inmueble ideal
        </button>
      </div>
    </section>
  );
}
