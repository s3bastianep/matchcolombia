import React from "react";
import { Link } from "react-router-dom";
import { Home, Plus, MapPin, Check, Sparkles, ShieldCheck, Gift } from "lucide-react";

function PromoBenefit({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 text-center min-w-0 px-0.5">
      <Icon className="w-4 h-4 text-brand-violet shrink-0" strokeWidth={2.25} />
      <span className="text-[11px] font-bold text-foreground leading-none">{label}</span>
    </div>
  );
}

export default function ExploreOwnerPromoCard() {
  return (
    <div className="min-w-0 h-full rounded-xl">
      <Link
        to="/publicar"
        className="group block h-full min-w-0"
        aria-label="Publicar mi propiedad en MatchColombia"
      >
        <article className="h-full flex flex-col bg-white rounded-xl border border-[hsl(0,0%,92%)] ring-1 ring-brand-magenta/20 overflow-hidden transition-all group-hover:border-brand-violet/30 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="relative w-full aspect-[5/4] rounded-lg overflow-hidden gradient-cta flex flex-col items-center justify-center text-center px-4">
              <div
                className="absolute inset-0 opacity-30"
                aria-hidden
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 15%, white 0%, transparent 42%), radial-gradient(circle at 80% 85%, rgba(255,255,255,0.15) 0%, transparent 40%)",
                }}
              />

              <div className="relative mb-3">
                <div className="w-[4.25rem] h-[4.25rem] sm:w-[4.75rem] sm:h-[4.75rem] rounded-2xl bg-white/20 backdrop-blur-[2px] border border-white/25 flex items-center justify-center shadow-lg">
                  <Home className="w-10 h-10 sm:w-11 sm:h-11 text-white" strokeWidth={1.6} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-brand-magenta flex items-center justify-center shadow-md">
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </span>
              </div>

              <p className="relative text-white font-extrabold text-sm sm:text-[15px] leading-tight">
                Publica tu inmueble hoy
              </p>
              <p className="relative text-white/90 text-[11px] mt-1 font-semibold">
                Gratis · Gestión exclusiva
              </p>
            </div>
          </div>

          <div className="px-3 pt-0 pb-3 flex-1 flex flex-col">
            <h3 className="font-extrabold text-base text-foreground leading-tight tracking-tight line-clamp-2 min-h-[2.5rem]">
              ¿Quieres publicar tu propiedad?
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 min-h-[1.125rem]">
              Miles de arrendatarios verificados te esperan.
            </p>

            <div className="mt-2.5 rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,97%)] px-2 py-2.5 min-h-[4.75rem]">
              <div className="grid grid-cols-3 gap-y-3 h-full items-center">
                <PromoBenefit icon={Gift} label="Publicar gratis" />
                <PromoBenefit icon={ShieldCheck} label="Verificados" />
                <PromoBenefit icon={Sparkles} label="Listo rápido" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2 min-h-[2.75rem] content-start">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-[11px] font-semibold text-foreground/80 border border-[hsl(0,0%,88%)] shadow-sm">
                <Check className="w-3.5 h-3.5 text-brand-violet shrink-0" strokeWidth={2.5} />
                Publicación gratis
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-[11px] font-semibold text-foreground/80 border border-[hsl(0,0%,88%)] shadow-sm">
                <Check className="w-3.5 h-3.5 text-brand-violet shrink-0" strokeWidth={2.5} />
                Gestión exclusiva
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
