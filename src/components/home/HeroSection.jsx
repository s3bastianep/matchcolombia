import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import InlineMatchBar from "../search/InlineMatchBar";
import VerifiedBadge from "../brand/VerifiedBadge";
import { PEOPLE } from "@/lib/colombiaImages";
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
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="absolute inset-[6%] z-10">
          <CollagePhoto src={PEOPLE.collageMain} alt="Sala moderna de apartamento" className="w-full h-full shadow-2xl" priority />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -12, rotate: -6 }} animate={{ opacity: 1, x: 0, rotate: -6 }} transition={{ duration: 0.5, delay: 0.12 }} className="absolute bottom-0 left-[-2%] w-[44%] aspect-[4/5] z-20">
          <CollagePhoto src={PEOPLE.collageBedroom} alt="Habitación de apartamento" className="w-full h-full" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12, rotate: 8 }} animate={{ opacity: 1, x: 0, rotate: 8 }} transition={{ duration: 0.5, delay: 0.2 }} className="absolute top-0 right-[-2%] w-[40%] aspect-square z-20">
          <CollagePhoto src={PEOPLE.collageKitchen} alt="Cocina de apartamento" className="w-full h-full" />
        </motion.div>
      </div>
    </div>
  );
}

export default function HeroSection({ onStartQuiz }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 order-1">
          <h1 className="font-extrabold leading-[1.05] mb-3 tracking-tight text-[clamp(2rem,6vw,3.25rem)]">
            Arrienda fácil.
            <br />
            <span className="text-gradient">Sin scroll infinito.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-3 max-w-md leading-relaxed">
            Match inteligente con inmuebles revisados por nuestro equipo.
          </p>
          <VerifiedBadge size="sm" className="mb-7" />

          <InlineMatchBar variant="hero" />

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3 rounded-full hover:opacity-95 transition-opacity text-sm"
            >
              Match inteligente
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/explorar")}
              className="text-sm font-bold text-brand-violet hover:underline"
            >
              Ver todos los arriendos
            </button>
            <span className="hidden sm:inline text-border">|</span>
            <Link to="/publicar" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Publicar inmueble
            </Link>
          </div>
        </div>

        <div className="order-2">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}
