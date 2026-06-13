import React, { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { getVisibleBounds, latLngToPercent } from "@/lib/zoneMap";

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function markerSvg(color = "#e11d6f") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="9" fill="${color}" stroke="white" stroke-width="3"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function googleEmbedUrl(center, zoom) {
  return `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=${zoom}&hl=es&output=embed`;
}

function MapBadge() {
  return (
    <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-muted-foreground px-2.5 py-1 rounded-full border border-border/50 shadow-sm pointer-events-none">
      Google Maps
    </div>
  );
}

function MapMarker({ marker, position, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId }) {
  const isActive = activeMarkerId === marker.id;
  return (
    <button
      type="button"
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
      style={{ top: `${position.top}%`, left: `${position.left}%` }}
      onClick={() => onMarkerClick?.(marker)}
      onMouseEnter={() => onMarkerEnter?.(marker)}
      onMouseLeave={() => onMarkerLeave?.(marker)}
      aria-label={marker.label || marker.sublabel || "Ver en mapa"}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full shadow-lg ring-4 ring-white transition-transform",
          isActive ? "scale-150" : "group-hover:scale-125"
        )}
        style={{ backgroundColor: marker.color || "#e11d6f" }}
      />
      {(marker.label || marker.sublabel) && (
        <div
          className={cn(
            "absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity pointer-events-none",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="bg-foreground text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
            {marker.label || marker.sublabel}
          </div>
        </div>
      )}
    </button>
  );
}

/** Google Maps embebido — funciona sin API key */
function GoogleEmbedMap({ markers, center, zoom, className, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId }) {
  const bounds = useMemo(() => getVisibleBounds(center, zoom), [center, zoom]);
  const embedSrc = useMemo(() => googleEmbedUrl(center, zoom), [center.lat, center.lng, zoom]);

  const markerPositions = useMemo(
    () =>
      markers.map((marker) => ({
        marker,
        position: latLngToPercent(marker.lat, marker.lng, bounds),
      })),
    [markers, bounds]
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <MapBadge />
      <iframe
        title="Mapa de Bogotá y Barranquilla"
        src={embedSrc}
        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="absolute inset-0 z-10">
        {markerPositions.map(({ marker, position }) => (
          <MapMarker
            key={marker.id}
            marker={marker}
            position={position}
            onMarkerClick={onMarkerClick}
            onMarkerEnter={onMarkerEnter}
            onMarkerLeave={onMarkerLeave}
            activeMarkerId={activeMarkerId}
          />
        ))}
      </div>
    </div>
  );
}

/** Google Maps JS API — requiere VITE_GOOGLE_MAPS_API_KEY */
function GoogleMapView({ markers, center, zoom, className, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "matchcolombia-google-map",
    googleMapsApiKey: GOOGLE_KEY,
  });

  const mapCenter = useMemo(() => ({ lat: center.lat, lng: center.lng }), [center.lat, center.lng]);

  if (loadError) {
    return (
      <GoogleEmbedMap
        markers={markers}
        center={center}
        zoom={zoom}
        className={className}
        onMarkerClick={onMarkerClick}
        onMarkerEnter={onMarkerEnter}
        onMarkerLeave={onMarkerLeave}
        activeMarkerId={activeMarkerId}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className={cn("bg-secondary/40 animate-pulse flex items-center justify-center text-sm text-muted-foreground", className)}>
        Cargando mapa…
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <MapBadge />
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.label}
            icon={{
              url: markerSvg(marker.color || "#e11d6f"),
              scaledSize: new window.google.maps.Size(28, 28),
              anchor: new window.google.maps.Point(14, 14),
            }}
            onClick={() => onMarkerClick?.(marker)}
            onMouseOver={() => onMarkerEnter?.(marker)}
            onMouseOut={() => onMarkerLeave?.(marker)}
            zIndex={activeMarkerId === marker.id ? 1000 : 1}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default function InteractiveMap({
  markers = [],
  center = { lat: 4.711, lng: -74.0721 },
  zoom = 11,
  className,
  onMarkerClick,
  onMarkerEnter,
  onMarkerLeave,
  activeMarkerId,
}) {
  const shared = {
    markers,
    center,
    zoom,
    className,
    onMarkerClick,
    onMarkerEnter,
    onMarkerLeave,
    activeMarkerId,
  };

  if (GOOGLE_KEY) {
    return <GoogleMapView {...shared} />;
  }

  return <GoogleEmbedMap {...shared} />;
}
