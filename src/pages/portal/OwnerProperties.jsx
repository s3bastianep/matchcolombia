import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";
import { Link } from "react-router-dom";

const formatCOP = (v) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v || 0);

export default function OwnerProperties() {
  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Mis propiedades</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {properties.map((p) => {
          const leads = inquiries.filter((i) => i.property_id === p.id).length;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-border/40 p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-extrabold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.neighborhood}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="font-bold mt-3">{formatCOP(p.monthly_rent)}/mes</p>
              <p className="text-xs text-muted-foreground mt-2">{leads} lead{leads !== 1 ? "s" : ""} recibidos</p>
              <Link to={`/propiedad/${p.id}`} className="text-xs font-bold text-brand-magenta mt-3 inline-block hover:underline">Ver publicación →</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
