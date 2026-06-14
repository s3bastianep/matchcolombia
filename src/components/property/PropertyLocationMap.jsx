import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, ZoomControl } from "react-leaflet";
import { MapPin } from "lucide-react";
import { getPropertyLatLng } from "@/lib/zoneMap";
import "leaflet/dist/leaflet.css";

const APPROX_RADIUS_M = 400;

export default function PropertyLocationMap({ property }) {
  const coords = getPropertyLatLng(property, 0);
  const [mapReady, setMapReady] = useState(false);

  return (
    <section className="detail-section">
      <h2 className="detail-section-title">Ubicación</h2>
      <p className="text-subtle text-sm mb-1 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-brand-violet shrink-0" />
        {property.neighborhood}, {property.locality || property.city}
      </p>
      <p className="text-xs text-subtle mb-5">
        Zona aproximada. La dirección exacta se comparte al confirmar tu visita.
      </p>
      <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden border border-border/40 z-0">
        {!mapReady && (
          <div className="absolute inset-0 shimmer flex items-center justify-center z-10 bg-secondary/30">
            <p className="text-xs font-medium text-subtle">Cargando mapa…</p>
          </div>
        )}
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={14}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
          className="h-full w-full property-map"
          whenReady={() => setMapReady(true)}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <Circle
            center={[coords.lat, coords.lng]}
            radius={APPROX_RADIUS_M}
            pathOptions={{
              color: "hsl(340 82% 52%)",
              fillColor: "hsl(340 82% 52%)",
              fillOpacity: 0.12,
              weight: 2,
            }}
          />
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>
      <Link
        to={`/explorar?city=${encodeURIComponent(property.city)}&q=${encodeURIComponent(property.neighborhood)}`}
        className="inline-block mt-5 text-sm font-semibold text-brand-violet hover:underline"
      >
        Ver más en {property.neighborhood} →
      </Link>
    </section>
  );
}
