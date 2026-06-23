import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import PropertyDetailModal from "@/components/property/PropertyDetailModal";
import { hapticLight } from "@/lib/haptics";

const PropertyPanelActionsContext = createContext(null);
const PropertyPanelStateContext = createContext(null);

export function PropertyPanelProvider({ children }) {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [focusBooking, setFocusBooking] = useState(false);

  const syncExploreUrl = useCallback(
    (prop, focus, mode = "set") => {
      if (location.pathname !== "/explorar") return;
      setSearchParams(
        (prev) => {
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
        },
        { replace: true }
      );
    },
    [location.pathname, setSearchParams]
  );

  const openProperty = useCallback(
    (prop, options = {}) => {
      if (!prop) return;
      hapticLight();
      const { focusBooking: focus = false, fromUrl = false } = options;
      setProperty(prop);
      setFocusBooking(focus);
      if (!fromUrl) syncExploreUrl(prop, focus, "set");
    },
    [syncExploreUrl]
  );

  const closeProperty = useCallback(() => {
    setProperty(null);
    setFocusBooking(false);
    syncExploreUrl(null, false, "clear");
  }, [syncExploreUrl]);

  const actions = useMemo(() => ({ openProperty, closeProperty }), [openProperty, closeProperty]);
  const state = useMemo(
    () => ({ property, isOpen: !!property, focusBooking }),
    [property, focusBooking]
  );

  return (
    <PropertyPanelActionsContext.Provider value={actions}>
      <PropertyPanelStateContext.Provider value={state}>
        {children}
        {property && (
          <PropertyDetailModal
            open
            property={property}
            focusBooking={focusBooking}
            onClose={closeProperty}
          />
        )}
      </PropertyPanelStateContext.Provider>
    </PropertyPanelActionsContext.Provider>
  );
}

export function usePropertyPanelActions() {
  const ctx = useContext(PropertyPanelActionsContext);
  if (!ctx) {
    throw new Error("usePropertyPanelActions debe usarse dentro de PropertyPanelProvider");
  }
  return ctx;
}

export function usePropertyPanel() {
  const actions = useContext(PropertyPanelActionsContext);
  const state = useContext(PropertyPanelStateContext);
  if (!actions || !state) {
    throw new Error("usePropertyPanel debe usarse dentro de PropertyPanelProvider");
  }
  return { ...actions, ...state };
}
