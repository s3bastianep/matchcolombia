import React from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize, ArrowRight } from "lucide-react";

const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function CompareStrip({ properties }) {
  if (properties.length < 2) return null;

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="surface-card p-4 sm:p-5 min-w-[600px]">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Comparar guardados</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `140px repeat(${properties.length}, minmax(0, 1fr))` }}>
          <div />
          {properties.map((p) => (
            <Link key={p.id} to={`/explorar?inmueble=${p.id}`} className="font-extrabold text-sm hover:text-brand-violet transition-colors line-clamp-2">
              {p.neighborhood}
            </Link>
          ))}

          {[
            { label: "Precio / mes", render: (p) => formatCOP(p.monthly_rent) },
            { label: "Habitaciones", icon: Bed, render: (p) => p.bedrooms },
            { label: "Baños", icon: Bath, render: (p) => p.bathrooms },
            { label: "Área", icon: Maximize, render: (p) => (p.area_sqm ? `${p.area_sqm} m²` : "N/D") },
          ].map((row) => (
            <React.Fragment key={row.label}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground py-2 border-t border-border/40">
                {row.icon && <row.icon className="w-3.5 h-3.5" />}
                {row.label}
              </div>
              {properties.map((p) => (
                <div key={p.id} className="text-sm font-bold py-2 border-t border-border/40">
                  {row.render(p)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <Link to="/explorar" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-brand-violet hover:underline">
          Agregar más a comparar <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
