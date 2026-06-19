import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import InteractiveMap from "@/components/map/InteractiveMap";
import MapPropertyPreview from "@/components/explore/MapPropertyPreview";
import { clusterMarkers } from "@/lib/mapClusters";
import { getPropertyLatLng, getPropertyPin, getCityLabel, getMapCenter } from "@/lib/zoneMap";
import { getTotalMonthly } from "@/lib/propertyFilters";
import { hapticLight } from "@/lib/haptics";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

const formatCompactCOP = (v) => {
  if (!v) return "";
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1).replace(".0", "")}M`;
  return formatCOP(v);
};

export default function ExploreMap({
  properties,
  activeCity,
  className,
  sticky = false,
  pane = false,
  highlightedId,
  onHighlight,
}) {
  const { openProperty } = usePropertyPanel();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);

  const cityLabel = activeCity || (properties[0] ? getCityLabel(properties[0].city) : "Bogotá y Barranquilla");
  const mapCenter = getMapCenter(activeCity || properties[0]?.city);

  const rawMarkers = useMemo(
    () =>
      properties.map((property, i) => {
        const coords = getPropertyLatLng(property, i);
        const pin = getPropertyPin(property, i);
        const total = getTotalMonthly(property);
        return {
          id: property.id,
          lat: coords.lat,
          lng: coords.lng,
          label: formatCompactCOP(total),
          sublabel: property.neighborhood,
          color: pin.hex,
          href: `/propiedad/${property.id}`,
          property,
        };
      }),
    [properties]
  );

  const mapMarkers = useMemo(() => clusterMarkers(rawMarkers), [rawMarkers]);
  const activeId = hoveredId || highlightedId || selectedId;
  const previewProperty = properties.find((p) => p.id === (selectedId || hoveredId || highlightedId));

  const handleMarkerClick = (marker) => {
    hapticLight();
    if (marker.type === "cluster") {
      setSelectedCluster(marker);
      setSelectedId(null);
      return;
    }
    setSelectedCluster(null);
    setSelectedId(marker.id);
    onHighlight?.(marker.id);
  };

  const handleMarkerEnter = (marker) => {
    if (marker.type === "cluster") return;
    setHoveredId(marker.id);
    onHighlight?.(marker.id);
  };

  const handleMarkerLeave = () => {
    setHoveredId(null);
    if (!selectedId) onHighlight?.(null);
  };

  const clearSelection = () => {
    setSelectedId(null);
    setSelectedCluster(null);
    onHighlight?.(null);
  };

  const openPreview = (prop) => {
    hapticLight();
    openProperty(prop);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white",
        pane ? "h-full border-0 shadow-none overflow-hidden" : "rounded-[1.35rem] border border-border/30 shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
        sticky && !pane && "xl:sticky xl:top-[210px]",
        pane && "h-full",
        className
      )}
    >
      {!pane && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-foreground border border-border/40 shadow-sm">
            <Layers className="w-3 h-3 text-brand-violet" />
            {mapMarkers.filter((m) => m.type === "cluster").length > 0
              ? `${mapMarkers.length} zonas · ${properties.length} inmuebles`
              : `${properties.length} en el mapa`}
          </span>
        </div>
      )}

      {pane && !selectedId && !selectedCluster && (
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-medium text-muted-foreground border border-border/40 shadow-sm">
            <MapPin className="w-3.5 h-3.5" />
            Toca un pin para ver el inmueble
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
        onMarkerEnter={pane ? undefined : handleMarkerEnter}
        onMarkerLeave={pane ? undefined : handleMarkerLeave}
        activeMarkerId={activeId}
      />

      <div className={cn(
        "absolute z-10 flex flex-col gap-3 pointer-events-none",
        pane ? "bottom-[4.5rem] left-3 right-3" : "bottom-4 left-4 right-4"
      )}>
        {!pane && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/80 shadow-lg flex items-center gap-3 pointer-events-auto">
            <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-foreground truncate">{cityLabel}</p>
              <p className="text-xs text-muted-foreground">Toca un pin para ver la miniatura</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {previewProperty && selectedId && !selectedCluster && (
            <MapPropertyPreview
              key={previewProperty.id}
              property={previewProperty}
              onOpen={() => openPreview(previewProperty)}
              onClose={clearSelection}
              className="pointer-events-auto max-w-[320px]"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCluster && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="bg-white rounded-2xl p-4 border border-border/50 shadow-xl pointer-events-auto max-h-52 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-extrabold">{selectedCluster.count} inmuebles en esta zona</p>
                <button type="button" onClick={() => setSelectedCluster(null)} className="p-1 rounded-lg hover:bg-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {selectedCluster.markers.map((marker) => (
                  <button
                    key={marker.id}
                    type="button"
                    onClick={() => {
                      setSelectedCluster(null);
                      setSelectedId(marker.id);
                      onHighlight?.(marker.id);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-secondary/80 transition-colors text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{marker.property?.neighborhood || marker.sublabel}</p>
                      <p className="text-[10px] text-muted-foreground">{marker.property?.city}</p>
                    </div>
                    <span className="text-xs font-extrabold text-foreground shrink-0">{marker.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
