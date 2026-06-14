import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/panels/StatusBadge";
import { OWNER_VERIFICATION } from "@/lib/adminConstants";
import { pushAdminNotification } from "@/lib/adminNotifications";
import { FileText, ShieldCheck, ShieldX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminOwners() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => base44.entities.Owner.filter({}, "-created_date", 100),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });

  const updateOwner = useMutation({
    mutationFn: ({ id, patch }) => base44.entities.Owner.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-owners"] }),
  });

  const propsByOwner = (userId) => properties.filter((p) => p.owner_user_id === userId).length;

  const openDetail = (owner) => {
    setSelected(owner);
    setNotes(owner.internal_notes || "");
  };

  const verify = (status) => {
    if (!selected) return;
    updateOwner.mutate({ id: selected.id, patch: { verification_status: status, internal_notes: notes } });
    pushAdminNotification({
      type: "owner",
      title: status === "verificado" ? "Propietario verificado" : "Verificación actualizada",
      message: `${selected.name} — ${status}`,
      link: "/admin/propietarios",
      entityId: selected.id,
    });
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Verificación de propietarios</h2>
        <p className="text-sm text-muted-foreground">Revisa documentos antes de publicar inmuebles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {owners.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => openDetail(o)}
            className="text-left bg-white rounded-2xl border border-border/40 p-5 hover:border-brand-violet/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold">{o.name}</p>
                <p className="text-sm text-muted-foreground">{o.email}</p>
                <p className="text-xs text-muted-foreground mt-1">{o.phone}</p>
              </div>
              <StatusBadge status={o.verification_status} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {o.documents?.length || 0} documentos · {propsByOwner(o.user_id)} inmuebles
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-lg">{selected.name}</h3>
                <StatusBadge status={selected.verification_status} className="mt-2" />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">Documentos</p>
              <div className="space-y-2">
                {(selected.documents || []).map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-lg bg-secondary">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{doc.type}: {doc.name}</span>
                  </div>
                ))}
                {(!selected.documents || selected.documents.length === 0) && (
                  <p className="text-sm text-muted-foreground">Sin documentos cargados.</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground">Notas internas</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {OWNER_VERIFICATION.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => verify(s.key)}
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-secondary hover:bg-brand-violet/10"
                >
                  {s.label}
                </button>
              ))}
              <button type="button" onClick={() => verify("verificado")} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl gradient-cta text-white ml-auto">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificar
              </button>
              <button type="button" onClick={() => verify("rechazado")} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-600">
                <ShieldX className="w-3.5 h-3.5" /> Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
