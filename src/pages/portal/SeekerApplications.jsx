import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/panels/StatusBadge";
import { EmptyState } from "@/components/panels/PipelineBoard";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";

const STEPS = ["interesado", "documentos_enviados", "en_revision", "aprobado"];

export default function SeekerApplications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: applications = [] } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: () => base44.entities.Application.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const uploadDoc = useMutation({
    mutationFn: async ({ appId, file }) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const app = applications.find((a) => a.id === appId);
      const docs = [...(app?.documents || []), { type: "documento", name: file.name, url: file_url, uploaded_at: new Date().toISOString() }];
      return base44.entities.Application.update(appId, { documents: docs, status: "documentos_enviados" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-applications"] }),
  });

  if (!applications.length) {
    return (
      <EmptyState
        title="Sin procesos activos"
        description="Explora propiedades y solicita visita para iniciar tu aplicación."
        action={<Link to="/explorar" className="inline-block gradient-cta text-white font-bold px-5 py-2.5 rounded-xl text-sm">Explorar propiedades</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Mis procesos</h2>
        <p className="text-sm text-muted-foreground">Sigue cada etapa: documentos, revisión y aprobación.</p>
      </div>
      {applications.map((app) => {
        const stepIdx = STEPS.indexOf(app.status);
        return (
          <div key={app.id} className="bg-white rounded-2xl border border-border/40 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="font-extrabold">Propiedad {app.property_id?.slice(-8)}</p>
              <StatusBadge status={app.status} />
            </div>
            <div className="flex gap-1 mb-4">
              {STEPS.map((s, i) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? "bg-brand-violet" : "bg-secondary"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {app.status === "interesado" && "Envía tus documentos para continuar."}
              {app.status === "documentos_enviados" && "Estamos revisando tu información."}
              {app.status === "en_revision" && `En revisión por el equipo ${BRAND.name}.`}
              {app.status === "aprobado" && "¡Aprobado! Te contactaremos para firmar."}
            </p>
            {app.documents?.length > 0 && (
              <ul className="text-xs space-y-1 mb-4">
                {app.documents.map((d, i) => (
                  <li key={i} className="text-muted-foreground">✓ {d.name}</li>
                ))}
              </ul>
            )}
            <label className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border cursor-pointer hover:bg-secondary">
              <Upload className="w-3.5 h-3.5" />
              Subir documento
              <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadDoc.mutate({ appId: app.id, file: e.target.files[0] })} />
            </label>
          </div>
        );
      })}
    </div>
  );
}
