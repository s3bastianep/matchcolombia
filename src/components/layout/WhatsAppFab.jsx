import React from "react";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function WhatsAppFab() {
  const href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, tengo una consulta sobre un inmueble en MatchColombia")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 gradient-cta text-white font-bold text-sm pl-4 pr-5 py-3.5 rounded-full shadow-lg shadow-brand-magenta/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all mb-[env(safe-area-inset-bottom,0px)]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" strokeWidth={2.25} />
      <span className="hidden sm:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
