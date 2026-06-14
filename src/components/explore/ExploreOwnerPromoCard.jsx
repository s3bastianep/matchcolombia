import React from "react";
import { Link } from "react-router-dom";

export default function ExploreOwnerPromoCard() {
  return (
    <div className="min-w-0 rounded-xl">
      <Link
        to="/publicar"
        className="group block min-w-0"
        aria-label="Publicar mi propiedad en MatchColombia"
      >
        <article className="bg-white rounded-xl border-2 border-brand-magenta/35 overflow-hidden transition-all group-hover:border-brand-violet/45 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="p-3 pb-2">
            <div className="size-[7.25rem] rounded-lg bg-gradient-to-br from-brand-magenta/8 via-white to-brand-violet/10 flex items-center justify-center">
              <div className="w-11 h-11 rounded-xl gradient-cta flex items-center justify-center shadow-md shadow-brand-magenta/20 group-hover:scale-[1.03] transition-transform">
                <span className="text-xl font-extrabold text-white leading-none">M</span>
              </div>
            </div>
          </div>

          <div className="px-3 pt-0 pb-3">
            <h3 className="font-extrabold text-sm text-foreground leading-snug">
              ¿Quieres publicar tu propiedad?
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Publica gratis, arrienda rápido y cobra tu arriendo sin complicaciones.
            </p>
            <p className="text-[10px] font-extrabold text-foreground mt-1.5 leading-snug">
              Sin exclusividad con MatchColombia
            </p>
            <span className="mt-2.5 w-full flex items-center justify-center gradient-cta text-white text-[11px] font-bold py-2 rounded-lg group-hover:opacity-95 transition-opacity">
              Publicar mi propiedad
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
