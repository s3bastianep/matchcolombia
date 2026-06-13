import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import InteractiveMap from "@/components/map/InteractiveMap";
import { getPropertyLatLng, getPropertyPin, getCityLabel, getMapCenter } from "@/lib/zoneMap";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function ExploreMap({ properties, activeCity }) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const hovered = properties.find((p) => p.id === hoveredId);

  const cityLabel = activeCity || (properties[0] ? getCityLabel(properties[0].city) : "Bogotá y Barranquilla");
  const mapCenter = getMapCenter(activeCity || properties[0]?.city);

  const markers = useMemo(
    () =>
      properties.map((property, i) => {
        const coords = getPropertyLatLng(property, i);
        const pin = getPropertyPin(property, i);
        return {
          id: property.id,
          lat: coords.lat,
          lng: coords.lng,
          label: formatCOP(property.monthly_rent),
          sublabel: property.neighborhood,
          color: pin.hex,
          href: `/propiedad/${property.id}`,
        };
      }),
    [properties]
  );

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border/40 shadow-lg min-h-[420px] sm:min-h-[520px]">
      <InteractiveMap
        markers={markers}
        center={mapCenter}
        zoom={mapCenter.zoom}
        className="absolute inset-0 w-full h-full"
        onMarkerClick={(marker) => marker.href && navigate(marker.href)}
        onMarkerEnter={(marker) => setHoveredId(marker.id)}
        onMarkerLeave={() => setHoveredId(null)}
        activeMarkerId={hoveredId}
      />

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-[1000] flex flex-col sm:flex-row gap-3 pointer-events-none">
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-foreground truncate">{cityLabel}</p>
            <p className="text-xs text-muted-foreground">
              {properties.length} inmueble{properties.length !== 1 ? "s" : ""} en el mapa
            </p>
          </div>
        </div>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:w-72 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-white shadow-lg pointer-events-auto"
          >
            <p className="font-bold text-sm truncate">{hovered.title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {hovered.neighborhood}, {hovered.city}
            </p>
            <p className="text-sm font-extrabold text-[hsl(340,82%,52%)] mt-1">{formatCOP(hovered.monthly_rent)}/mes</p>
            <Link to={`/propiedad/${hovered.id}`} className="text-xs font-bold text-[hsl(265,75%,50%)] mt-2 inline-block hover:underline">
              Ver detalle →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
