import React, { createContext, useCallback, useContext, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import PropertyDetailModal from "@/components/property/PropertyDetailModal";

const PropertyPanelContext = createContext(null);

export function PropertyPanelProvider({ children }) {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [focusBooking, setFocusBooking] = useState(false);

  const syncExploreUrl = useCallback((prop, focus, mode = "set") => {
    if (location.pathname !== "/explorar") return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (mode === "set" && prop) {
        next.set("inmueble", prop.id);
        if (focus) next.set("visita", "1");
        else next.delete("visita");
      } else {
        next.delete("inmueble");
        next.delete("visita");
      }
      return next;
    }, { replace: true });
  }, [location.pathname, setSearchParams]);

  const openProperty = useCallback((prop, options = {}) => {
    if (!prop) return;
    const { focusBooking: focus = false, fromUrl = false } = options;
    setProperty(prop);
    setFocusBooking(focus);
    if (!fromUrl) syncExploreUrl(prop, focus, "set");
  }, [syncExploreUrl]);

  const closeProperty = useCallback(() => {
    setProperty(null);
    setFocusBooking(false);
    syncExploreUrl(null, false, "clear");
  }, [syncExploreUrl]);

  return (
    <PropertyPanelContext.Provider value={{ property, isOpen: !!property, focusBooking, openProperty, closeProperty }}>
      {children}
      <PropertyDetailModal
        open={!!property}
        property={property}
        focusBooking={focusBooking}
        onClose={closeProperty}
      />
    </PropertyPanelContext.Provider>
  );
}

export function usePropertyPanel() {
  const ctx = useContext(PropertyPanelContext);
  if (!ctx) {
    throw new Error("usePropertyPanel debe usarse dentro de PropertyPanelProvider");
  }
  return ctx;
}
