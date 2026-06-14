import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PipelineBoard from "@/components/panels/PipelineBoard";
import StatusBadge from "@/components/panels/StatusBadge";

const STAGES = [
  { key: "nuevo", label: "Nuevo lead" },
  { key: "visita_agendada", label: "Visita agendada" },
  { key: "en_negociacion", label: "En negociación" },
  { key: "cerrado", label: "Cerrado" },
];

export default function AdminLeads() {
  const qc = useQueryClient();
  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const move = useMutation({
    mutationFn: ({ id, stage }) => base44.entities.Inquiry.update(id, { pipeline_stage: stage, status: stage === "cerrado" ? "cerrado" : "contactado" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Leads & mensajería</h2>
        <p className="text-sm text-muted-foreground">Pipeline CRM. Arrastra leads entre etapas con los botones.</p>
      </div>
      <PipelineBoard
        stages={STAGES}
        items={inquiries.map((i) => ({ ...i, pipeline_stage: i.pipeline_stage || (i.status === "nueva" ? "nuevo" : i.status) }))}
        onMove={(id, stage) => move.mutate({ id, stage })}
        renderCard={(item) => (
          <>
            <p className="font-bold text-sm">{item.name}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{item.message}</p>
            <p className="text-[10px] text-muted-foreground mt-2 truncate">{propTitle(item.property_id)}</p>
            <div className="mt-2"><StatusBadge status={item.pipeline_stage || item.status} /></div>
          </>
        )}
      />
    </div>
  );
}
