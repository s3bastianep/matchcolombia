import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveMap from "@/components/map/InteractiveMap";
import { clusterMarkers } from "@/lib/mapClusters";
import { getPropertyLatLng, getPropertyPin, getCityLabel, getMapCenter } from "@/lib/zoneMap";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function ExploreMap({
  properties,
  activeCity,
  className,
  sticky = false,
  pane = false,
  highlightedId,
  onHighlight,
}) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const cityLabel = activeCity || (properties[0] ? getCityLabel(properties[0].city) : "Bogotá y Barranquilla");
  const mapCenter = getMapCenter(activeCity || properties[0]?.city);

  const rawMarkers = useMemo(
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
          property,
        };
      }),
    [properties]
  );

  const mapMarkers = useMemo(() => clusterMarkers(rawMarkers), [rawMarkers]);
  const activeId = hoveredId || highlightedId;
  const hovered = properties.find((p) => p.id === activeId);

  const handleMarkerClick = (marker) => {
    if (marker.type === "cluster") {
      setSelectedCluster(marker);
      return;
    }
    if (marker.href) navigate(marker.href);
  };

  const handleMarkerEnter = (marker) => {
    if (marker.type === "cluster") return;
    setHoveredId(marker.id);
    onHighlight?.(marker.id);
  };

  const handleMarkerLeave = () => {
    setHoveredId(null);
    onHighlight?.(null);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white",
        pane ? "h-full rounded-none border-0 shadow-none" : "rounded-[1.35rem] border border-border/30 shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
        sticky && !pane && "xl:sticky xl:top-[210px]",
        pane && "h-full",
        className
      )}
    >
      {!pane && (
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-foreground border border-border/40 shadow-sm">
          <Layers className="w-3 h-3 text-brand-violet" />
          {mapMarkers.filter((m) => m.type === "cluster").length > 0
            ? `${mapMarkers.length} zonas · ${properties.length} inmuebles`
            : `${properties.length} en el mapa`}
        </span>
      </div>
      )}

      {pane && (
        <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-foreground border border-[hsl(0,0%,88%)] shadow-sm">
            <MapPin className="w-3 h-3 text-brand-magenta" />
            {properties.length} en el mapa
          </span>
        </div>
      )}

      <InteractiveMap
        markers={mapMarkers}
        center={mapCenter}
        zoom={mapCenter.zoom}
        markerVariant={pane ? "houm" : "default"}
        className={cn(
          "w-full",
          pane ? "h-full min-h-0" : "min-h-[360px] sm:min-h-[440px] xl:min-h-[calc(100vh-240px)]"
        )}
        onMarkerClick={handleMarkerClick}
        onMarkerEnter={handleMarkerEnter}
        onMarkerLeave={handleMarkerLeave}
        activeMarkerId={activeId}
      />

      <div className={cn("absolute bottom-4 left-4 right-4 z-[1000] flex flex-col gap-3 pointer-events-none", pane && "bottom-3 left-3 right-3")}>
        {!pane && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/80 shadow-lg flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-foreground truncate">{cityLabel}</p>
            <p className="text-xs text-muted-foreground">Toca un pin o grupo para ver detalle</p>
          </div>
        </div>
        )}

        <AnimatePresence>
          {hovered && !selectedCluster && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={cn(
                "bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-3 border border-white/80 shadow-lg pointer-events-auto",
                pane && "text-left"
              )}
            >
              <p className="font-bold text-sm truncate">{hovered.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {hovered.neighborhood}, {hovered.city}
              </p>
              <p className="text-sm font-extrabold text-brand-magenta mt-1">{formatCOP(hovered.monthly_rent)}/mes</p>
              <Link to={`/propiedad/${hovered.id}`} className="text-xs font-bold text-brand-violet mt-2 inline-block hover:underline">
                Ver detalle →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCluster && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-lg pointer-events-auto max-h-52 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-extrabold">{selectedCluster.count} inmuebles en esta zona</p>
                <button
                  type="button"
                  onClick={() => setSelectedCluster(null)}
                  className="p-1 rounded-lg hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {selectedCluster.markers.map((marker) => (
                  <Link
                    key={marker.id}
                    to={marker.href}
                    onClick={() => setSelectedCluster(null)}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{marker.property?.title || marker.sublabel}</p>
                      <p className="text-[10px] text-muted-foreground">{marker.sublabel}</p>
                    </div>
                    <span className="text-xs font-extrabold text-brand-magenta shrink-0">{marker.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
