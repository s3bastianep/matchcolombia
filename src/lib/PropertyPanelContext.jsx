import React, { createContext, useCallback, useContext, useState, lazy, Suspense } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const PropertyDetailModal = lazy(() => import("@/components/property/PropertyDetailModal"));

function ModalFallback() {
  return <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[1px]" aria-hidden />;
}

const PropertyPanelContext = createContext(null);

export function PropertyPanelProvider({ children }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [focusBooking, setFocusBooking] = useState(false);

  const syncExploreUrl = useCallback((prop, focus, mode = "set") => {
    if (location.pathname !== "/explorar") return;
    const next = new URLSearchParams(searchParams);
    if (mode === "set" && prop) {
      next.set("inmueble", prop.id);
      if (focus) next.set("visita", "1");
      else next.delete("visita");
    } else {
      next.delete("inmueble");
      next.delete("visita");
    }
    setSearchParams(next, { replace: true });
  }, [location.pathname, searchParams, setSearchParams]);

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
      {property ? (
        <Suspense fallback={<ModalFallback />}>
          <PropertyDetailModal
            open
            property={property}
            focusBooking={focusBooking}
            onClose={closeProperty}
          />
        </Suspense>
      ) : null}
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
