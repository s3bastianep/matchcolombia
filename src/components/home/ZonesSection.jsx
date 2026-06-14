import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CITIES, getCityImage } from "@/lib/colombia";
import { INTERIORS } from "@/lib/colombiaImages";
import SectionHeader from "../ui/SectionHeader";

const CITY_IMAGES = {
  bogota: INTERIORS.sala,
  barranquilla: INTERIORS.sala2,
  skyline: INTERIORS.cocina,
};

function CityCard({ city, delay }) {
  const navigate = useNavigate();
  const imgKey = getCityImage(city.id);
  const image = CITY_IMAGES[imgKey] || INTERIORS.dormitorio;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
      onClick={() => navigate(`/explorar?city=${encodeURIComponent(city.name)}`)}
      className="relative overflow-hidden rounded-3xl group text-left w-full cursor-pointer min-h-[300px] sm:min-h-[360px] shadow-lg"
    >
      <img src={image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 group-hover:from-black/80 transition-colors" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="text-white/65 text-xs font-semibold uppercase tracking-wider mb-1">{city.region}</p>
          <h3 className="font-extrabold text-white text-2xl sm:text-3xl mb-1">{city.name}</h3>
        <p className="text-white/55 text-sm mb-4">{city.count} arriendos activos</p>
        <span className="inline-flex items-center gap-1.5 text-white text-sm font-bold group-hover:gap-2.5 transition-all">
          Explorar <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.button>
  );
}

export default function ZonesSection() {
  const navigate = useNavigate();

  return (
    <section className="section-pad bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <SectionHeader
          align="center"
          eyebrow="Ciudades"
          title="Dos ciudades, un solo match"
          subtitle="Por ahora en Bogotá y Barranquilla. Muy pronto más ciudades."
          className="mb-10"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CITIES.map((city, i) => (
            <CityCard key={city.id} city={city} delay={i * 0.08} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={() => navigate("/explorar")} className="text-sm font-bold text-brand-violet hover:underline">
            Ver arriendos en ambas ciudades
          </button>
        </div>
      </div>
    </section>
  );
}
