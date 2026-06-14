import React from "react";
import { Link } from "react-router-dom";

export default function ExploreOwnerPromoCard() {
  return (
    <Link
      to="/publicar"
      className="block h-full group"
      aria-label="Publicar mi propiedad en MatchColombia"
    >
      <article className="h-full min-h-[300px] rounded-xl border-2 border-brand-magenta/35 bg-white p-5 sm:p-6 flex flex-col items-center text-center justify-between shadow-sm hover:border-brand-violet/45 hover:shadow-md transition-all">
        <div className="w-full">
          <h3 className="font-extrabold text-[15px] sm:text-base text-foreground leading-snug px-1">
            ¿Quieres publicar tu propiedad en MatchColombia?
          </h3>

          <div className="mt-5 mb-4 w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center mx-auto shadow-md shadow-brand-magenta/20 group-hover:scale-[1.03] transition-transform">
            <span className="text-2xl font-extrabold text-white leading-none">M</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Publica, arrienda en tiempo récord y recibe siempre el pago de tu arriendo.
          </p>
          <p className="mt-3 text-sm font-extrabold text-foreground leading-snug">
            Anuncia gratis y sin exclusividad con MatchColombia
          </p>
        </div>

        <span className="mt-5 w-full inline-flex items-center justify-center gradient-cta text-white font-bold text-sm py-3 rounded-full group-hover:opacity-95 transition-opacity">
          Publicar mi propiedad
        </span>
      </article>
    </Link>
  );
}
