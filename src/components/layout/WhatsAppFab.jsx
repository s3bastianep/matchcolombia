import React from "react";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export default function WhatsAppFab() {
  const location = useLocation();
  const isExplore = location.pathname === "/explorar";
  const href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hola, tengo una consulta sobre un inmueble en ${BRAND.name}`)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className={cn(
        "fixed z-[45] flex items-center gap-2 gradient-cta text-white font-bold text-sm pl-4 pr-5 py-3.5 rounded-full shadow-lg shadow-brand-magenta/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all",
        isExplore
          ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 lg:bottom-8 lg:right-8"
          : "bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 lg:bottom-5 lg:right-5"
      )}
    >
      <MessageCircle className="w-5 h-5 shrink-0" strokeWidth={2.25} />
      <span className="hidden sm:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
