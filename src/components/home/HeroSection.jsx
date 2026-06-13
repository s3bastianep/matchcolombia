import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InlineMatchBar from "../search/InlineMatchBar";
import { PEOPLE } from "@/lib/colombiaImages";
import { CITIES } from "@/lib/colombia";
import { cn } from "@/lib/utils";

const CITY_STYLE = {
  bogota: "from-[hsl(340,82%,52%)]/12 to-[hsl(265,75%,58%)]/8 border-[hsl(340,82%,52%)]/25 text-[hsl(340,72%,42%)]",
  barranquilla: "from-[hsl(200,90%,50%)]/12 to-[hsl(168,72%,40%)]/8 border-[hsl(200,80%,45%)]/30 text-[hsl(200,80%,38%)]",
};

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
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,75%,58%)]/6 via-white to-[hsl(340,82%,52%)]/5 pointer-events-none" />
      <div className="absolute top-[12%] right-[12%] w-52 h-52 rounded-full gradient-cta opacity-12 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-square mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="absolute inset-[6%] z-10"
        >
          <CollagePhoto src={PEOPLE.collageMain} alt="Sala moderna de apartamento" className="w-full h-full shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -12, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="absolute bottom-0 left-[-2%] w-[44%] aspect-[4/5] z-20"
        >
          <CollagePhoto src={PEOPLE.collageBedroom} alt="Habitación de apartamento" className="w-full h-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: 8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-0 right-[-2%] w-[40%] aspect-square z-20"
        >
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
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-20 order-1">
          <div className="flex flex-wrap gap-2 mb-6">
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => navigate(`/explorar?city=${encodeURIComponent(city.name)}`)}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-full text-xs font-extrabold bg-gradient-to-r border transition-all hover:scale-[1.03] hover:shadow-sm",
                  CITY_STYLE[city.id]
                )}
              >
                {city.name}
              </button>
            ))}
          </div>

          <h1 className="font-extrabold leading-[1.06] mb-4 tracking-tight text-[clamp(1.85rem,5.5vw,3.2rem)]">
            Inmuebles en arriendo.
            <br />
            <span className="text-gradient">Sin scroll infinito.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-8 max-w-md leading-relaxed">
            Te hacemos match con casas, apartamentos y más en Bogotá y Barranquilla.
            Solo los que encajan con lo que buscas.
          </p>

          <InlineMatchBar variant="hero" />

          <p className="mt-4 text-xs text-muted-foreground">
            ¿Quieres más precisión?{" "}
            <button type="button" onClick={onStartQuiz} className="font-bold text-[hsl(265,75%,50%)] hover:underline">
              Haz el quiz completo
            </button>
          </p>
        </div>

        <div className="order-2">
          <HeroCollage />
        </div>
      </div>
    </section>
  );
}
