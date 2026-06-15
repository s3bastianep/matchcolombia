import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { isInShortlist } from "@/lib/shortlist";
import { useAuth } from "@/lib/AuthContext";
import { PROPERTY_DETAIL_QUERY } from "@/lib/queryOptions";
import { lockBodyScroll } from "@/lib/scrollLock";
import PropertyDetailView from "./PropertyDetailView";

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

  const needsFetch = open && !propertyProp && !!propertyId;

  const { data: fetchedProperty, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const list = await base44.entities.Property.filter({ id: propertyId });
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
    document.getElementById("agenda-visita")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={property?.title || "Detalle del inmueble"}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Cerrar"
          />

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full bg-white flex flex-col overflow-hidden shadow-2xl",
              "h-[100dvh] sm:h-[min(92vh,920px)] sm:max-w-6xl sm:rounded-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-6 h-14 pt-safe border-b border-border/50 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand-violet transition-colors min-h-11 px-1"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span className="sm:hidden">Volver</span>
                <span className="hidden sm:inline">Volver a explorar</span>
              </button>

              <div className="flex items-center gap-0.5">
                {property && (
                  <>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="touch-target rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Compartir"
                    >
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

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-2 sm:pb-0">
              {isLoading && !property ? (
                <div className="p-6 space-y-6">
                  <div className="h-48 sm:h-64 shimmer rounded-2xl" />
                  <div className="h-6 w-2/3 shimmer rounded-lg" />
                  <div className="h-4 w-1/3 shimmer rounded-lg" />
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    <div className="h-72 shimmer rounded-2xl" />
                    <div className="hidden lg:block h-96 shimmer rounded-2xl" />
                  </div>
                </div>
              ) : property ? (
                <PropertyDetailView
                  property={property}
                  variant="modal"
                  focusBooking={focusBooking}
                  showSimilar
                />
              ) : (
                <div className="p-12 text-center">
                  <p className="text-lg font-bold text-foreground mb-2">Inmueble no encontrado</p>
                  <button type="button" onClick={onClose} className="text-sm font-semibold text-brand-violet">
                    Volver a explorar
                  </button>
                </div>
              )}
            </div>

            {property && (
              <div className="lg:hidden shrink-0 border-t border-border/50 bg-white px-4 py-3 pb-safe shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
                <button
                  type="button"
                  onClick={scrollToBooking}
                  className="w-full flex items-center justify-center gap-2 gradient-cta text-white text-sm font-bold py-3.5 rounded-xl hover:opacity-95 transition-opacity"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Agendar visita
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
