import React, { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { getVisibleBounds, latLngToPercent } from "@/lib/zoneMap";

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function markerSvg(color = "#e11d6f", size = 28) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.32}" fill="${color}" stroke="white" stroke-width="3"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function clusterSvg(color = "#7c3aed", count = 2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="14" fill="${color}" stroke="white" stroke-width="3"/>
    <text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="700" font-family="Arial,sans-serif">${count}</text>
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

function MapMarker({ marker, position, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId, variant = "default" }) {
  const isCluster = marker.type === "cluster";
  const isActive = activeMarkerId === marker.id;
  const isHoum = variant === "houm";

  if (isHoum) {
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
        {isCluster ? (
          <div
            className={cn(
              "min-w-[34px] h-[34px] px-1 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] border border-[hsl(0,0%,88%)] flex items-center justify-center text-foreground text-xs font-extrabold transition-transform",
              isActive ? "scale-110 ring-2 ring-brand-violet/40" : "group-hover:scale-105"
            )}
          >
            {marker.count}
          </div>
        ) : (
          <div
            className={cn(
              "whitespace-nowrap bg-white text-foreground text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-[hsl(0,0%,88%)] transition-transform",
              isActive ? "scale-105 ring-2 ring-brand-violet/40" : "group-hover:scale-[1.02]"
            )}
          >
            {marker.label}
          </div>
        )}
      </button>
    );
  }

  const size = isCluster ? "w-9 h-9" : "w-5 h-5";

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
      {isCluster ? (
        <div
          className={cn(
            "rounded-full shadow-lg ring-4 ring-white flex items-center justify-center text-white text-[11px] font-extrabold transition-transform",
            size,
            isActive ? "scale-110" : "group-hover:scale-105"
          )}
          style={{ backgroundColor: marker.color || "#7c3aed" }}
        >
          {marker.count}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "rounded-full shadow-lg ring-4 ring-white transition-transform",
              size,
              isActive ? "scale-150" : "group-hover:scale-125"
            )}
            style={{ backgroundColor: marker.color || "#e11d6f" }}
          />
          {marker.label && (
            <div
              className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity pointer-events-none",
                isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
              )}
            >
              <div className="bg-foreground text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                {marker.label}
              </div>
            </div>
          )}
        </>
      )}
      {isCluster && (
        <div
          className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity pointer-events-none",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="bg-foreground text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
            {marker.label}
          </div>
        </div>
      )}
    </button>
  );
}

/** Google Maps embebido — funciona sin API key */
function GoogleEmbedMap({ markers, center, zoom, className, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId, markerVariant }) {
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
      {markerVariant !== "houm" && <MapBadge />}
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
            variant={markerVariant}
          />
        ))}
      </div>
    </div>
  );
}

/** Google Maps JS API — requiere VITE_GOOGLE_MAPS_API_KEY */
function GoogleMapView({ markers, center, zoom, className, onMarkerClick, onMarkerEnter, onMarkerLeave, activeMarkerId, markerVariant }) {
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
        markerVariant={markerVariant}
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
      {markerVariant !== "houm" && <MapBadge />}
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
        {markers.map((marker) => {
          const isCluster = marker.type === "cluster";
          return (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.label}
              icon={{
                url: isCluster
                  ? clusterSvg(marker.color || "#7c3aed", marker.count)
                  : markerSvg(marker.color || "#e11d6f"),
                scaledSize: new window.google.maps.Size(isCluster ? 36 : 28, isCluster ? 36 : 28),
                anchor: new window.google.maps.Point(isCluster ? 18 : 14, isCluster ? 18 : 14),
              }}
              onClick={() => onMarkerClick?.(marker)}
              onMouseOver={() => onMarkerEnter?.(marker)}
              onMouseOut={() => onMarkerLeave?.(marker)}
              zIndex={activeMarkerId === marker.id ? 1000 : isCluster ? 2 : 1}
            />
          );
        })}
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
  markerVariant = "default",
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
    markerVariant,
  };

  if (GOOGLE_KEY) {
    return <GoogleMapView {...shared} />;
  }

  return <GoogleEmbedMap {...shared} />;
}
