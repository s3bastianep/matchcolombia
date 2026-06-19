import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { ArrowLeft, Share2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/apiClient";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { isInShortlist } from "@/lib/shortlist";
import { useAuth } from "@/lib/AuthContext";
import { PROPERTY_DETAIL_QUERY } from "@/lib/queryOptions";
import { lockBodyScroll } from "@/lib/scrollLock";
import { formatCOP } from "./propertyDetailShared";
import { getTotalMonthly } from "@/lib/propertyCardUtils";
import { hapticLight } from "@/lib/haptics";
import { useIsApp } from "@/hooks/use-mobile";
import PropertyDetailView from "./PropertyDetailView";

const SPRING = { type: "spring", damping: 32, stiffness: 340 };

export default function PropertyDetailModal({
  open,
  onClose,
  property: propertyProp,
  propertyId,
  focusBooking = false,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const dragControls = useDragControls();
  const isApp = useIsApp();

  const needsFetch = open && !propertyProp && !!propertyId;

  const { data: fetchedProperty, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const list = await api.entities.Property.filter({ id: propertyId });
      return list[0];
    },
    enabled: needsFetch,
    ...PROPERTY_DETAIL_QUERY,
  });

  const property = propertyProp || fetchedProperty;

  useEffect(() => {
    if (property) setLiked(isInShortlist(property.id));
  }, [property]);

  useEffect(() => {
    if (!open) return undefined;
    return lockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const scrollToBooking = () => {
    hapticLight();
    document.getElementById("agenda-visita")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClose = () => {
    hapticLight();
    onClose?.();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/explorar?inmueble=${property?.id}`;
    if (navigator.share) {
      navigator.share({ title: property?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  };

  const monthlyTotal = property ? getTotalMonthly(property) : 0;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="property-detail-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={property?.title || "Detalle del inmueble"}
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 sm:bg-black/45 backdrop-blur-[3px]"
            onClick={handleClose}
            aria-label="Cerrar"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING}
            drag={isApp ? "y" : false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) handleClose();
            }}
            className={cn(
              "relative w-full bg-white flex flex-col overflow-hidden shadow-2xl",
              isApp && "touch-pan-y",
              "h-[100dvh] sm:h-[min(92vh,920px)] sm:max-w-6xl sm:rounded-2xl sm:!y-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {isApp && (
              <div
                className="lg:hidden shrink-0 flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-10 h-1 rounded-full bg-border/80" aria-hidden />
              </div>
            )}

            <div className="hidden sm:flex shrink-0 items-center justify-between gap-2 px-3 sm:px-6 h-14 border-b border-border/50 bg-white">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand-violet transition-colors min-h-11 px-1"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span>Volver a explorar</span>
              </button>
              <div className="flex items-center gap-0.5">
                {property && (
                  <>
                    <button type="button" onClick={handleShare} className="touch-target rounded-lg hover:bg-secondary transition-colors" aria-label="Compartir">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <FavoriteButton
                      propertyId={property.id}
                      liked={liked}
                      onToggle={setLiked}
                      requireAuth={!isAuthenticated}
                      onRequireAuth={() => navigate("/login", { state: { from: `/explorar` } })}
                      className={cn(!liked && "hover:bg-secondary text-foreground/50")}
                      size="sm"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="lg:hidden absolute top-[max(0.5rem,env(safe-area-inset-top))] left-0 right-0 z-20 flex items-center justify-between px-3 pointer-events-none">
              <button
                type="button"
                onClick={handleClose}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center backdrop-blur-sm"
                aria-label="Cerrar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {property && (
                <div className="pointer-events-auto flex items-center gap-1.5">
                  <button type="button" onClick={handleShare} className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center backdrop-blur-sm" aria-label="Compartir">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <FavoriteButton
                    propertyId={property.id}
                    liked={liked}
                    onToggle={setLiked}
                    requireAuth={!isAuthenticated}
                    onRequireAuth={() => navigate("/login", { state: { from: `/explorar` } })}
                    className="!w-10 !h-10 rounded-full bg-white/95 shadow-md backdrop-blur-sm"
                    size="sm"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain native-scroll-y">
              {isLoading && !property ? (
                <div className="pb-28">
                  <div className="h-[52vh] shimmer" />
                  <div className="px-4 pt-6 space-y-3">
                    <div className="h-7 w-4/5 shimmer rounded-lg" />
                    <div className="h-5 w-1/2 shimmer rounded-lg" />
                    <div className="h-8 w-1/3 shimmer rounded-lg mt-4" />
                  </div>
                  <div className="px-4 pt-6 grid grid-cols-3 gap-2">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="h-[72px] shimmer rounded-xl" />
                    ))}
                  </div>
                </div>
              ) : property ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.25 }}
                >
                  <PropertyDetailView
                    property={property}
                    variant="modal"
                    focusBooking={focusBooking}
                    showSimilar
                  />
                </motion.div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-lg font-bold text-foreground mb-2">Inmueble no encontrado</p>
                  <button type="button" onClick={handleClose} className="text-sm font-semibold text-brand-violet">
                    Volver a explorar
                  </button>
                </div>
              )}
            </div>

            {property && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12, ...SPRING }}
                className="lg:hidden shrink-0 bg-white border-t border-border/40 px-4 pt-3 pb-safe shadow-[0_-4px_20px_rgba(15,23,42,0.06)]"
              >
                <button
                  type="button"
                  onClick={scrollToBooking}
                  className="app-btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm font-bold"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Agendar visita · {formatCOP(monthlyTotal || property.monthly_rent)}/mes
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
