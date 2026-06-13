import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";
import InlineMatchBar from "../search/InlineMatchBar";
import { PEOPLE } from "@/lib/colombiaImages";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "rent", label: "Arriendo" },
  { id: "publish", label: "Publicar propiedad" },
];

function CollagePhoto({ src, alt, className }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border-[3px] sm:border-4 border-white shadow-xl shadow-black/10 bg-muted",
        className
      )}
    >
      <img src={src} alt={alt} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
    </div>
  );
}

function HeroCollage() {
  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-8 py-10 sm:py-12 lg:py-14 min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,75%,58%)]/8 via-white to-[hsl(340,82%,52%)]/6 pointer-events-none" />
      <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full gradient-cta opacity-[0.14] blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-square mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="absolute inset-[6%] z-10">
          <CollagePhoto src={PEOPLE.collageMain} alt="Sala moderna de apartamento" className="w-full h-full shadow-2xl" />
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
  const [mode, setMode] = useState("rent");

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
      <div className="absolute top-20 left-[5%] w-2 h-2 rounded-full bg-[hsl(340,82%,52%)] opacity-60 hidden lg:block" />
      <div className="absolute top-32 left-[8%] w-1.5 h-1.5 rounded-full bg-[hsl(265,75%,58%)] opacity-50 hidden lg:block" />
      <div className="absolute bottom-24 right-[12%] w-2.5 h-2.5 rounded-full bg-[hsl(168,72%,40%)] opacity-40 hidden lg:block" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-20 order-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[hsl(168,72%,40%)]/10 border border-[hsl(168,72%,40%)]/20 text-[hsl(168,55%,32%)] text-xs font-bold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Nos encargamos de todo el proceso
          </motion.div>

          <h1 className="font-extrabold leading-[1.02] mb-4 tracking-tight text-[clamp(2rem,6vw,3.5rem)]">
            Arrienda fácil.
            <br />
            <span className="text-gradient">Sin papeleo. Sin scroll.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-8 max-w-lg leading-relaxed">
            Publica, postula o agenda visitas. Todo online, con un equipo real que gestiona cada paso y un match inteligente que solo te muestra lo que encaja.
          </p>

          <div className="inline-flex p-1 rounded-full bg-[hsl(240,40%,96%)] border border-border/50 mb-6 w-full sm:w-auto">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                  mode === m.id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "rent" ? (
            <motion.div key="rent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <InlineMatchBar variant="hero" />
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3.5 rounded-full hover:opacity-95 transition-opacity"
                >
                  Empieza tu match
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/explorar")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold border-2 border-border/60 bg-white hover:bg-secondary/50 transition-colors"
                >
                  Buscar propiedad
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                ¿Quieres más precisión?{" "}
                <button type="button" onClick={onStartQuiz} className="font-bold text-[hsl(265,75%,50%)] hover:underline">
                  Haz el quiz completo
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div key="publish" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[hsl(265,75%,58%)]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[hsl(265,75%,50%)]" />
                </div>
                <div>
                  <p className="font-extrabold text-sm">Publica con MatchColombia</p>
                  <p className="text-xs text-muted-foreground">Nosotros atendemos a los interesados</p>
                </div>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 mb-5">
                <li>· Gestión de visitas y consultas</li>
                <li>· Alta visibilidad en Bogotá y Barranquilla</li>
                <li>· Publicación gratuita</li>
              </ul>
              <Link to="/publicar">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 transition-opacity">
                  Publicar mi propiedad
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2 mt-8">
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => navigate(`/explorar?city=${encodeURIComponent(city.name)}`)}
                className="text-xs font-bold text-muted-foreground hover:text-[hsl(265,75%,50%)] transition-colors"
              >
                {city.name} →
              </button>
            ))}
          </div>
        </div>

        <div className="order-2">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}
