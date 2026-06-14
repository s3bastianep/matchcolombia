import React from "react";
import { Link } from "react-router-dom";
import { Home, Plus, Megaphone, MapPin } from "lucide-react";

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
            <div className="relative w-full aspect-[5/4] rounded-lg overflow-hidden bg-gradient-to-br from-brand-magenta/14 via-brand-violet/10 to-brand-magenta/8">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--brand-violet) / 0.12) 1px, transparent 0)",
                  backgroundSize: "14px 14px",
                }}
                aria-hidden
              />
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-violet/12 blur-sm" aria-hidden />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-brand-magenta/12 blur-sm" aria-hidden />

              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 shadow-sm border border-brand-magenta/15">
                <Megaphone className="w-3.5 h-3.5 text-brand-magenta shrink-0" strokeWidth={2.25} />
                <span className="text-[9px] font-bold text-brand-magenta leading-none">Anuncia</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-5">
                <div className="relative group-hover:scale-[1.03] transition-transform duration-300">
                  <div className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] border border-white/90 flex items-center justify-center">
                    <Home className="w-9 h-9 sm:w-10 sm:h-10 text-brand-violet" strokeWidth={1.65} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full gradient-cta flex items-center justify-center shadow-md ring-2 ring-white">
                    <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>

              <p className="absolute bottom-2 inset-x-2 text-center text-[9px] font-bold text-brand-violet/80 leading-tight">
                Sube fotos y publica en minutos
              </p>
            </div>
          </div>

          <div className="px-3 pt-0 pb-3 flex-1 flex flex-col">
            <h3 className="font-extrabold text-base text-foreground leading-tight tracking-tight line-clamp-2 min-h-[2.5rem]">
              ¿Quieres publicar tu propiedad?
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 min-h-[1.125rem]">
              Publica gratis y arrienda en tiempo récord.
            </p>

            <div className="mt-2.5 rounded-lg border border-brand-magenta/15 bg-brand-magenta/5 px-2.5 py-3 min-h-[4.75rem] flex items-center">
              <p className="text-xs font-semibold text-foreground/80 leading-relaxed text-center w-full">
                Llega a miles de arrendatarios verificados en Bogotá y Barranquilla.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2 min-h-[2.75rem] content-start">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-[11px] font-semibold text-foreground/80 border border-[hsl(0,0%,88%)] shadow-sm">
                Publicación gratis
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-[11px] font-semibold text-foreground/80 border border-[hsl(0,0%,88%)] shadow-sm">
                Sin exclusividad
              </span>
            </div>

            <p className="text-sm font-bold text-foreground mt-2 min-h-[1.375rem] line-clamp-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-brand-magenta" strokeWidth={2.25} />
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
