import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";
import { APPLICATION_STATUSES, APPLICATION_DOC_TYPES } from "@/lib/adminConstants";
import { pushAdminNotification } from "@/lib/adminNotifications";
import { FileText, Check, X } from "lucide-react";

export default function AdminApplications() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => base44.entities.Application.filter({}, "-created_date", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const updateApp = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Application.update(id, { status }),
    onSuccess: (_, { status, id }) => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      if (status === "aprobado") {
        pushAdminNotification({ type: "application", title: "Aplicación aprobada", message: "Una aplicación fue aprobada.", link: "/admin/aplicaciones", entityId: id });
      }
    },
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;
  const docLabel = (type) => APPLICATION_DOC_TYPES.find((d) => d.key === type)?.label || type;

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Aplicaciones</h2>
          <p className="text-sm text-muted-foreground">Revisa documentos y aprueba o rechaza candidatos.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm border rounded-xl px-3 py-2 bg-white">
          <option value="all">Todas ({applications.length})</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay aplicaciones con este filtro.</p>
        ) : (
          filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-border/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold">{app.user_name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{propTitle(app.property_id)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solicitud · {new Date(app.created_date).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.documents?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {app.documents.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary">
                      <FileText className="w-3.5 h-3.5" />
                      {docLabel(doc.type)} — {doc.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {["en_revision", "aprobado", "rechazado"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={app.status === status}
                    onClick={() => updateApp.mutate({ id: app.id, status })}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary hover:bg-brand-violet/10 disabled:opacity-40"
                  >
                    {status === "aprobado" && <Check className="w-3.5 h-3.5" />}
                    {status === "rechazado" && <X className="w-3.5 h-3.5" />}
                    {APPLICATION_STATUSES.find((s) => s.key === status)?.label || status}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
