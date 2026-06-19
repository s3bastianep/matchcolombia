import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import InlineMatchBar from "../search/InlineMatchBar";
import VerifiedBadge from "../brand/VerifiedBadge";
import { PEOPLE } from "@/lib/colombiaImages";
import { HERO_SUBTITLE } from "@/lib/siteCopy";
import { cn } from "@/lib/utils";

function CollagePhoto({ src, alt, className, priority = false }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border-[3px] sm:border-4 border-white shadow-xl shadow-black/10 bg-muted",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </div>
  );
}

function HeroCollage() {
  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-8 py-8 sm:py-10 lg:py-12 min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/8 via-white to-brand-magenta/6 pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full gradient-cta opacity-[0.14] blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-square mx-auto">
        <div className="hero-collage-main absolute inset-[6%] z-10">
          <CollagePhoto src={PEOPLE.collageMain} alt="Sala moderna de apartamento" className="w-full h-full shadow-2xl" priority />
        </div>
        <div className="hero-collage-bed absolute bottom-0 left-[-2%] w-[44%] aspect-[4/5] z-20">
          <CollagePhoto src={PEOPLE.collageBedroom} alt="Habitación de apartamento" className="w-full h-full" />
        </div>
        <div className="hero-collage-kitchen absolute top-0 right-[-2%] w-[40%] aspect-square z-20">
          <CollagePhoto src={PEOPLE.collageKitchen} alt="Cocina de apartamento" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

function HeroMobileImage() {
  return (
    <div className="lg:hidden relative mx-4 mb-2 rounded-3xl overflow-hidden aspect-[16/10] shadow-lg shadow-brand-violet/10 border border-border/40">
      <img
        src={PEOPLE.collageMain}
        alt="Apartamento verificado en Bogotá"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <VerifiedBadge size="sm" />
      </div>
    </div>
  );
}

export default function HeroSection({ onStartQuiz }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />

      <HeroMobileImage />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-6 sm:py-12 lg:py-16 order-1">
          <h1 className="font-extrabold leading-[1.08] mb-3 tracking-tight text-[clamp(1.85rem,7vw,3.25rem)]">
            Arrienda fácil.
            <br />
            <span className="text-gradient">Sin scroll infinito.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-md leading-relaxed">
            {HERO_SUBTITLE}
          </p>
          <VerifiedBadge size="sm" className="mb-5 hidden lg:inline-flex" />

          <InlineMatchBar variant="hero" />

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3.5 rounded-2xl sm:rounded-full hover:opacity-95 transition-opacity text-sm w-full sm:w-auto"
            >
              Match inteligente
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/explorar")}
              className="inline-flex items-center justify-center text-sm font-bold text-brand-violet border-2 border-brand-violet/20 bg-brand-violet/5 px-6 py-3.5 rounded-2xl sm:rounded-full sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:underline w-full sm:w-auto"
            >
              Ver todos los arriendos
            </button>
            <Link
              to="/publicar"
              className="hidden sm:inline text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Publicar inmueble
            </Link>
          </div>
        </div>

        <div className="order-2 hidden lg:block">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}
