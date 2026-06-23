import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import StatusBadge from "@/components/panels/StatusBadge";
import { OWNER_VERIFICATION } from "@/lib/adminConstants";
import { pushAdminNotification } from "@/lib/adminNotifications";
import { FileText, ShieldCheck, ShieldX, Image as ImageIcon, Building2, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STATUS_BORDER = {
  pendiente: "border-l-amber-400",
  en_revision: "border-l-brand-magenta",
  verificado: "border-l-emerald-500",
  rechazado: "border-l-red-400",
};

const STATUS_BG = {
  pendiente: "bg-amber-50/50",
  en_revision: "bg-brand-magenta/[0.04]",
  verificado: "bg-emerald-50/40",
  rechazado: "bg-red-50/40",
};

function isImageUrl(url) {
  if (!url || url === "#") return false;
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url) || url.startsWith("blob:") || url.startsWith("data:image");
}

function DocPreview({ doc }) {
  const canOpen = doc.url && doc.url !== "#";
  if (isImageUrl(doc.url)) {
    return (
      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border/40">
          <img src={doc.url} alt={doc.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
        </div>
        <p className="text-xs font-semibold mt-1.5 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" /> {doc.type}: {doc.name}
        </p>
      </a>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2 text-sm font-semibold p-3 rounded-xl bg-white border border-border/50">
      <span className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 shrink-0 text-brand-violet" />
        <span className="truncate">{doc.type}: {doc.name}</span>
      </span>
      {canOpen && (
        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-violet shrink-0 hover:underline inline-flex items-center gap-1">
          Ver <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

export default function AdminOwners() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => api.entities.Owner.filter({}, "-created_date", 100),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const updateOwner = useMutation({
    mutationFn: ({ id, patch }) => api.entities.Owner.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-owners"] }),
  });

  const ownerProperties = useMemo(() => {
    if (!selected) return [];
    return properties.filter((p) => p.owner_user_id === selected.user_id);
  }, [properties, selected]);

  const filtered = filter === "all"
    ? owners
    : owners.filter((o) => o.verification_status === filter);

  const propsByOwner = (userId) => properties.filter((p) => p.owner_user_id === userId);

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
      message: `${selected.name} · ${status}`,
      link: "/admin/propietarios",
      entityId: selected.id,
    });
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-violet/15 bg-gradient-to-r from-brand-violet/[0.06] to-brand-magenta/[0.04] p-5">
        <h2 className="text-xl font-extrabold">Solicitudes de publicación</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Revisa propietarios, fotos y documentos antes de dar el visto bueno para publicar inmuebles.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter("all")} className={cn("text-xs font-bold px-3 py-1.5 rounded-lg border", filter === "all" ? "bg-brand-violet/10 text-brand-violet border-brand-violet/20" : "bg-white border-border/50")}>
          Todos ({owners.length})
        </button>
        {OWNER_VERIFICATION.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(s.key)}
            className={cn("text-xs font-bold px-3 py-1.5 rounded-lg border", filter === s.key ? "bg-brand-violet/10 text-brand-violet border-brand-violet/20" : "bg-white border-border/50")}
          >
            {s.label} ({owners.filter((o) => o.verification_status === s.key).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((o) => {
          const status = o.verification_status || "pendiente";
          const pendingProps = propsByOwner(o.user_id).filter((p) => p.publication_status === "en_revision");
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => openDetail(o)}
              className={cn(
                "text-left rounded-2xl border border-border/40 border-l-4 p-5 hover:shadow-md transition-all",
                STATUS_BORDER[status] || STATUS_BORDER.pendiente,
                STATUS_BG[status] || "bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold">{o.name}</p>
                  <p className="text-sm text-muted-foreground">{o.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{o.phone}</p>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-semibold">
                <span className="px-2 py-1 rounded-md bg-white/80 border border-border/40">
                  {o.documents?.length || 0} archivos
                </span>
                <span className="px-2 py-1 rounded-md bg-white/80 border border-border/40">
                  {propsByOwner(o.user_id).length} inmuebles
                </span>
                {pendingProps.length > 0 && (
                  <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200/60">
                    {pendingProps.length} en revisión
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.email} · {selected.phone}</p>
                <StatusBadge status={selected.verification_status} className="mt-2" />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-3">Archivos cargados</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(selected.documents || []).map((doc, i) => (
                  <DocPreview key={i} doc={doc} />
                ))}
              </div>
              {(!selected.documents || selected.documents.length === 0) && (
                <p className="text-sm text-muted-foreground p-4 rounded-xl bg-secondary/50">Sin documentos cargados.</p>
              )}
            </div>

            {ownerProperties.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-magenta mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Inmuebles del propietario
                </p>
                <div className="space-y-2">
                  {ownerProperties.map((p) => (
                    <Link
                      key={p.id}
                      to={`/admin/propiedades/${p.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-[hsl(0,0%,99%)] hover:border-brand-violet/25"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.neighborhood} · {p.city}</p>
                      </div>
                      <StatusBadge status={p.publication_status || p.status} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-muted-foreground">Notas internas</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
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
              <button type="button" onClick={() => verify("verificado")} className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl gradient-cta text-white ml-auto">
                <ShieldCheck className="w-3.5 h-3.5" /> Dar visto bueno
              </button>
              <button type="button" onClick={() => verify("rechazado")} className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200/60">
                <ShieldX className="w-3.5 h-3.5" /> Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
