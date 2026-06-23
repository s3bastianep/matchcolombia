import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

function MapResizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    const t = window.setTimeout(() => map.invalidateSize(), 100);
    return () => {
      window.clearTimeout(t);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function buildHoumIcon(marker, isActive) {
  const isCluster = marker.type === "cluster";
  const html = isCluster
    ? `<div class="leaflet-houm-cluster${isActive ? " is-active" : ""}">${marker.count}</div>`
    : `<div class="leaflet-houm-price${isActive ? " is-active" : ""}">${marker.label || ""}</div>`;

  return L.divIcon({
    html,
    className: "leaflet-houm-marker",
    iconSize: isCluster ? [34, 34] : undefined,
    iconAnchor: isCluster ? [17, 17] : undefined,
  });
}

function buildDefaultIcon(marker, isActive) {
  const isCluster = marker.type === "cluster";
  const size = isCluster ? 36 : 28;
  const color = marker.color || (isCluster ? "#7c3aed" : "#e11d6f");

  const html = isCluster
    ? `<div class="leaflet-dot-cluster${isActive ? " is-active" : ""}" style="background:${color}">${marker.count}</div>`
    : `<div class="leaflet-dot-pin${isActive ? " is-active" : ""}" style="background:${color}"></div>`;

  return L.divIcon({
    html,
    className: "leaflet-dot-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapMarker({ marker, isActive, variant, onMarkerClick, onMarkerEnter, onMarkerLeave }) {
  const icon = useMemo(
    () => (variant === "houm" ? buildHoumIcon(marker, isActive) : buildDefaultIcon(marker, isActive)),
    [marker, isActive, variant]
  );

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={icon}
      zIndexOffset={isActive ? 1000 : marker.type === "cluster" ? 2 : 1}
      eventHandlers={{
        click: () => onMarkerClick?.(marker),
        mouseover: () => onMarkerEnter?.(marker),
        mouseout: () => onMarkerLeave?.(marker),
      }}
    />
  );
}

export default function LeafletInteractiveMap({
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
  const mapCenter = useMemo(() => [center.lat, center.lng], [center.lat, center.lng]);

  return (
    <div className={cn("relative z-0 h-full min-h-0", className)}>
      {markerVariant !== "houm" && (
        <div className="absolute top-3 right-3 z-[500] bg-white/95 backdrop-blur-sm text-[10px] font-bold text-muted-foreground px-2.5 py-1 rounded-full border border-border/50 shadow-sm pointer-events-none">
          OpenStreetMap
        </div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full z-0"
        scrollWheelZoom
        dragging
        touchZoom
        doubleClickZoom
        zoomControl
        attributionControl
      >
        <MapResizeObserver />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            marker={marker}
            isActive={activeMarkerId === marker.id}
            variant={markerVariant}
            onMarkerClick={onMarkerClick}
            onMarkerEnter={onMarkerEnter}
            onMarkerLeave={onMarkerLeave}
          />
        ))}
      </MapContainer>
    </div>
  );
}
