import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Building2, Sparkles } from "lucide-react";
import { PEOPLE } from "@/lib/colombiaImages";
import { HERO_EYEBROW, HERO_QUIZ_DESC, HERO_QUIZ_TITLE, HERO_SUBTITLE, HERO_TITLE_LINE1, HERO_TITLE_LINE2 } from "@/lib/siteCopy";
import { cn } from "@/lib/utils";
import HomeSearchBar from "@/components/search/HomeSearchBar";
import HumanSupportBanner from "@/components/brand/HumanSupportBanner";
import DeferredMount from "@/components/ui/DeferredMount";

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
    <div className="relative w-full flex items-center justify-center py-6 sm:py-10 lg:py-12 min-h-[200px] sm:min-h-[300px] lg:min-h-[360px]">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/6 via-white to-brand-magenta/4 pointer-events-none" />

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-square mx-auto scale-[0.92] sm:scale-100">
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
  if (!onStartQuiz) return null;
  return (
    <button
      type="button"
      onClick={onStartQuiz}
      className="mb-5 w-full text-left group flex items-center gap-3 rounded-xl border border-brand-violet/15 bg-gradient-to-r from-brand-violet/[0.06] to-brand-magenta/[0.03] px-4 py-2.5 transition-all hover:border-brand-violet/30 hover:shadow-sm active:scale-[0.99]"
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-brand-violet/10">
        <Sparkles className="size-4 text-brand-violet" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1 flex items-baseline flex-wrap gap-x-1.5">
        <span className="text-sm font-extrabold text-foreground">{HERO_QUIZ_TITLE}</span>
        <span className="text-xs text-muted-foreground">{HERO_QUIZ_DESC}</span>
      </span>
      <ArrowRight className="size-4 text-brand-violet shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </button>
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
            {HERO_EYEBROW}
          </p>
          <h1 className="font-extrabold leading-[1.08] mb-3 tracking-tight text-[clamp(1.85rem,5vw,3rem)]">
            {HERO_TITLE_LINE1}
            <br />
            <span className="text-gradient">{HERO_TITLE_LINE2}</span>
            <span className="text-foreground">.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-md leading-relaxed">
            {HERO_SUBTITLE}
          </p>

          <div className="mb-6">
            <HomeSearchBar />
          </div>

          <HeroMatchBlock onStartQuiz={onStartQuiz} />

          <div className="grid sm:grid-cols-2 gap-3">
            <HeroPathLink to="/explorar" icon={Search} variant="renter" title="Busco inmueble" cta="Explorar" />
            <HeroPathLink to="/anunciar" icon={Building2} variant="owner" title="Tengo inmueble" cta="Anunciar" />
          </div>

          <div className="mt-5">
            <HumanSupportBanner />
          </div>
        </div>

        <div className="order-2">
          <DeferredMount
            rootMargin="120px 0px"
            minHeight="200px"
            className="lg:contents"
            fallback={<div className="min-h-[200px] sm:min-h-[300px] lg:min-h-[360px]" aria-hidden="true" />}
          >
            <HeroCollage />
          </DeferredMount>
        </div>
        </div>
      </div>
    </section>
  );
}
