import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { PEOPLE } from "@/lib/colombiaImages";
import { HERO_SUBTITLE } from "@/lib/siteCopy";
import { BRAND } from "@/lib/brand";
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
    <div className="relative w-full flex items-center justify-center py-8 sm:py-10 lg:py-12 min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/6 via-white to-brand-magenta/4 pointer-events-none" />

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

function HeroPathLink({ to, icon: Icon, title, cta, variant = "renter" }) {
  const isOwner = variant === "owner";

  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200",
        isOwner
          ? "gradient-cta text-white shadow-md shadow-brand-violet/20 hover:opacity-95"
          : "border-2 border-brand-violet/35 bg-white shadow-md shadow-brand-violet/10 hover:border-brand-violet/50 hover:shadow-lg hover:shadow-brand-violet/12"
      )}
    >
      <span
        className={cn(
          "inline-flex w-9 h-9 rounded-lg items-center justify-center shrink-0",
          isOwner ? "bg-white/15" : "bg-brand-violet/10 text-brand-violet ring-1 ring-brand-violet/20"
        )}
      >
        <Icon className="w-4 h-4" strokeWidth={2.25} />
      </span>
      <span className={cn("font-bold text-sm flex-1 min-w-0", !isOwner && "text-foreground")}>
        {title}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-bold shrink-0",
          isOwner ? "text-white/90" : "text-brand-violet"
        )}
      >
        {cta}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

function HeroMatchBlock({ onStartQuiz }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-brand-violet/15 bg-white shadow-lg shadow-brand-violet/8 mb-5">
      <div className="color-bar h-[3px] w-full" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5 mb-5">
          <span className="inline-flex w-11 h-11 rounded-xl gradient-cta items-center justify-center shrink-0 shadow-md shadow-brand-magenta/25">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-violet mb-1">
              HABIBAR
            </p>
            <h2 className="font-extrabold text-lg sm:text-xl leading-tight text-foreground">
              {BRAND.quizLabel}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Responde el cuestionario y te mostramos inmuebles verificados que encajan contigo.
            </p>
          </div>
        </div>

        {onStartQuiz && (
          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full h-12 sm:h-[52px] rounded-xl gradient-cta btn-glow text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-4 h-4 shrink-0" strokeWidth={2.25} />
            Iniciar cuestionario
          </button>
        )}

        <Link
          to="/explorar"
          className="mt-3 block text-center text-xs sm:text-sm font-semibold text-muted-foreground hover:text-brand-violet transition-colors"
        >
          o explorar todos los arriendos
        </Link>
      </div>
    </div>
  );
}

export default function HeroSection({ onStartQuiz }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 gradient-hero opacity-30 pointer-events-none" />

      <div className="relative site-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="flex flex-col justify-center py-8 sm:py-10 lg:py-12 order-1">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-3">
            Arriendos verificados · Bogotá
          </p>
          <h1 className="font-extrabold leading-[1.08] mb-3 tracking-tight text-[clamp(1.85rem,5vw,3rem)]">
            Encuentra tu inmueble.
            <br />
            <span className="text-gradient">O arriéndalo sin estrés.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md leading-relaxed">
            {HERO_SUBTITLE}
          </p>

          <HeroMatchBlock onStartQuiz={onStartQuiz} />

          <div className="grid sm:grid-cols-2 gap-3">
            <HeroPathLink to="/explorar" icon={Search} variant="renter" title="Busco inmueble" cta="Explorar" />
            <HeroPathLink to="/anunciar" icon={Building2} variant="owner" title="Tengo inmueble" cta="Anunciar" />
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-verified shrink-0" strokeWidth={2.25} />
            Verificados · Contrato digital · Equipo en Bogotá
          </p>
        </div>

        <div className="order-2 hidden lg:block">
          <HeroCollage />
        </div>
        </div>
      </div>
    </section>
  );
}
