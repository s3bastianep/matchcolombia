import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import InteractiveMap from "@/components/map/InteractiveMap";
import { HOME_ZONE_MARKERS, getZoneLatLng, CITY_CENTERS } from "@/lib/zoneMap";

export default function MapExploreSection() {
  const navigate = useNavigate();

  const markers = useMemo(
    () =>
      HOME_ZONE_MARKERS.map((zone) => {
        const coords = getZoneLatLng(zone.zone, zone.city);
        return {
          id: zone.id,
          lat: coords.lat,
          lng: coords.lng,
          label: zone.label,
          sublabel: `${zone.count}+ inmuebles`,
          color: zone.color,
          href: `/explorar?q=${encodeURIComponent(zone.label)}`,
        };
      }),
    []
  );

  const handleMarkerClick = (marker) => {
    if (marker.href) navigate(marker.href);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 text-brand-violet text-xs font-bold uppercase tracking-wider mb-4">
              <Navigation className="w-3.5 h-3.5" />
              Mapa interactivo
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Navega Colombia
              <br />
              <span className="text-gradient">zona por zona</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Explora Bogotá y Barranquilla zona por zona. Toca un sector y ve solo los inmuebles que encajan contigo.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {HOME_ZONE_MARKERS.slice(0, 4).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => navigate(`/explorar?q=${encodeURIComponent(zone.label)}`)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border/50 transition-all text-left group"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                  <div>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{zone.label}</p>
                    <p className="text-xs text-muted-foreground">{zone.count}+ inmuebles</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/explorar")}
              className="inline-flex items-center gap-2 gradient-cta text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-primary/25 hover:opacity-95 transition-all"
            >
              Ver todos en el mapa
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square max-w-lg mx-auto lg:ml-auto rounded-3xl overflow-hidden border border-border/50 shadow-xl"
          >
            <InteractiveMap
              markers={markers}
              center={CITY_CENTERS.Bogotá}
              zoom={CITY_CENTERS.Bogotá.zoom}
              className="absolute inset-0 w-full h-full"
              onMarkerClick={handleMarkerClick}
            />

            <div className="absolute bottom-6 left-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg border border-white pointer-events-none">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Bogotá y Barranquilla</p>
                <p className="text-[10px] text-muted-foreground">Toca un pin para explorar la zona</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
