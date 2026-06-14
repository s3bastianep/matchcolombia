import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function ExploreOwnerPromoCard() {
  return (
    <div className="min-w-0 h-full rounded-xl">
      <Link
        to="/publicar"
        className="group block h-full min-w-0"
        aria-label="Publicar mi propiedad en MatchColombia"
      >
        <article className="h-full flex flex-col bg-white rounded-xl border border-brand-magenta/35 overflow-hidden transition-all group-hover:border-brand-violet/45 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="relative w-full aspect-[5/4] rounded-lg bg-gradient-to-br from-brand-magenta/8 via-white to-brand-violet/10 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-md shadow-brand-magenta/20 group-hover:scale-[1.03] transition-transform">
                <span className="text-2xl font-extrabold text-white leading-none">M</span>
              </div>
            </div>
          </div>

          <div className="px-3 pt-0 pb-3 flex-1 flex flex-col">
            <h3 className="font-extrabold text-base text-foreground leading-tight tracking-tight line-clamp-2 min-h-[2.5rem]">
              ¿Quieres publicar tu propiedad?
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 min-h-[1rem]">
              Publica gratis y arrienda en tiempo récord.
            </p>

            <div className="mt-2 min-h-[1.25rem] text-[10px] font-semibold text-foreground/75">
              Sin comisiones ocultas · Cobro garantizado
            </div>

            <div className="flex flex-wrap gap-1 mt-2 min-h-[2.5rem] content-start">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[hsl(0,0%,96%)] text-[9px] font-semibold text-foreground/70 border border-[hsl(0,0%,90%)]">
                Publicación gratis
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[hsl(0,0%,96%)] text-[9px] font-semibold text-foreground/70 border border-[hsl(0,0%,90%)]">
                Sin exclusividad
              </span>
            </div>

            <p className="text-xs font-bold text-foreground mt-2 min-h-[1.25rem] line-clamp-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-magenta" />
              MatchColombia · Propietarios
            </p>

            <span className="mt-auto pt-2.5 w-full flex items-center justify-center gradient-cta text-white text-[11px] font-bold py-2 rounded-lg group-hover:opacity-95 transition-opacity">
              Publicar mi propiedad
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
