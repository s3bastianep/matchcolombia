import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";

export default function OwnerLeads() {
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => api.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Leads por propiedad</h2>
      <div className="space-y-3">
        {inquiries.map((i) => (
          <div key={i.id} className="bg-white rounded-xl border border-border/40 p-4">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-bold">{i.name}</p>
                <p className="text-xs text-muted-foreground">{propTitle(i.property_id)}</p>
              </div>
              <StatusBadge status={i.pipeline_stage || i.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{i.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
