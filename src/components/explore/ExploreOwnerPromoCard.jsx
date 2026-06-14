import React from "react";
import { Link } from "react-router-dom";

export default function ExploreOwnerPromoCard() {
  return (
    <div className="min-w-0 card-hover rounded-xl">
      <Link
        to="/publicar"
        className="group block min-w-0"
        aria-label="Publicar mi propiedad en MatchColombia"
      >
        <article className="bg-white rounded-xl border-2 border-brand-magenta/35 overflow-hidden transition-all group-hover:border-brand-violet/45 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="aspect-[5/4] bg-gradient-to-br from-brand-magenta/8 via-white to-brand-violet/10 flex flex-col items-center justify-center px-4">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-md shadow-brand-magenta/20 group-hover:scale-[1.03] transition-transform">
              <span className="text-2xl font-extrabold text-white leading-none">M</span>
            </div>
          </div>

          <div className="px-3 pt-3 pb-3.5">
            <h3 className="font-extrabold text-sm sm:text-[15px] text-foreground leading-snug">
              ¿Quieres publicar tu propiedad en MatchColombia?
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
              Publica, arrienda en tiempo récord y recibe siempre el pago de tu arriendo.
            </p>
            <p className="text-[11px] font-extrabold text-foreground mt-2 leading-snug">
              Anuncia gratis y sin exclusividad
            </p>
            <span className="mt-3 w-full flex items-center justify-center gradient-cta text-white text-xs font-bold py-2.5 rounded-lg group-hover:opacity-95 transition-opacity">
              Publicar mi propiedad
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
