import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import InteractiveMap from "@/components/map/InteractiveMap";
import { getPropertyLatLng, getPropertyPin } from "@/lib/zoneMap";

export default function PropertyLocationMap({ property }) {
  const pin = getPropertyPin(property, 0);
  const coords = getPropertyLatLng(property, 0);

  const markers = useMemo(
    () => [
      {
        id: property.id,
        lat: coords.lat,
        lng: coords.lng,
        label: property.neighborhood,
        sublabel: property.address || `${property.neighborhood}, ${property.city}`,
        color: pin.hex,
      },
    ],
    [property, coords.lat, coords.lng, pin.hex]
  );

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm overflow-hidden">
      <h2 className="text-xl font-extrabold mb-1">Ubicación</h2>
      <p className="text-sm text-muted-foreground mb-5 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-brand-magenta" />
        {property.neighborhood}, {property.locality || property.city}
      </p>
      <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-border/30">
        <InteractiveMap markers={markers} center={coords} zoom={14} className="absolute inset-0 w-full h-full" />
      </div>
      <Link
        to={`/explorar?city=${encodeURIComponent(property.city)}&q=${encodeURIComponent(property.neighborhood)}`}
        className="inline-block mt-4 text-sm font-bold text-brand-violet hover:underline"
      >
        Ver más en {property.neighborhood} →
      </Link>
    </section>
  );
}
