import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function OwnerBanner() {
  return (
    <section className="py-10 border-t border-border/60 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-foreground font-medium text-center sm:text-left">
          ¿Tienes un inmueble para arrendar? <span className="text-muted-foreground">Publícalo gratis.</span>
        </p>
        <Link to="/publicar">
          <button className="flex items-center gap-2 bg-foreground text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors">
            <Plus className="w-4 h-4" />
            Publicar inmueble
          </button>
        </Link>
      </div>
    </section>
  );
}
