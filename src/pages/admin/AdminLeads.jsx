import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PipelineBoard from "@/components/panels/PipelineBoard";
import StatusBadge from "@/components/panels/StatusBadge";
import { LEAD_PIPELINE } from "@/lib/adminConstants";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, Mail } from "lucide-react";

export default function AdminLeads() {
  const qc = useQueryClient();
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => base44.entities.Inquiry.filter({}, "-created_date", 200),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.filter({}, "-created_date", 200),
  });
  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => base44.entities.AdminSettings.get(),
  });

  const move = useMutation({
    mutationFn: ({ id, stage }) => base44.entities.Inquiry.update(id, {
      pipeline_stage: stage,
      status: stage === "cerrado" ? "cerrado" : stage === "perdido" ? "perdido" : "contactado",
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  const updateLead = useMutation({
    mutationFn: ({ id, patch }) => base44.entities.Inquiry.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;
  const filtered = propertyFilter === "all" ? inquiries : inquiries.filter((i) => i.property_id === propertyFilter);

  const openLead = (item) => {
    setSelected(item);
    setNotes(item.internal_notes || "");
  };

  const saveNotes = () => {
    if (!selected) return;
    updateLead.mutate({ id: selected.id, patch: { internal_notes: notes } });
    setSelected((s) => ({ ...s, internal_notes: notes }));
  };

  const markReplied = () => {
    if (!selected) return;
    updateLead.mutate({
      id: selected.id,
      patch: { needs_reply: false, last_reply_at: new Date().toISOString() },
    });
    setSelected((s) => ({ ...s, needs_reply: false }));
  };

  const copyTemplate = (tpl) => {
    if (!selected || !tpl) return;
    const body = tpl.body
      .replace("{{nombre}}", selected.name || "")
      .replace("{{fecha}}", selected.move_in_date || "");
    navigator.clipboard?.writeText(body);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">CRM — Leads</h2>
          <p className="text-sm text-muted-foreground">Pipeline completo con notas, tags y plantillas WhatsApp.</p>
        </div>
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="text-sm border rounded-xl px-3 py-2 bg-white">
          <option value="all">Todas las propiedades</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <PipelineBoard
        stages={LEAD_PIPELINE}
        items={filtered.map((i) => ({
          ...i,
          pipeline_stage: i.pipeline_stage || (i.status === "nueva" ? "nuevo" : i.status),
        }))}
        onMove={(id, stage) => move.mutate({ id, stage })}
        renderCard={(item) => (
          <button type="button" onClick={() => openLead(item)} className="w-full text-left">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-sm">{item.name}</p>
              {item.needs_reply && <span className="w-2 h-2 rounded-full bg-brand-magenta shrink-0 mt-1" />}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{item.message}</p>
            <p className="text-[10px] text-muted-foreground mt-2 truncate">{propTitle(item.property_id)}</p>
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={item.pipeline_stage || item.status} />
              {item.source && <span className="text-[9px] text-muted-foreground">{item.source}</span>}
            </div>
          </button>
        )}
      />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl border max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-extrabold text-lg">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">{propTitle(selected.property_id)}</p>
              <StatusBadge status={selected.pipeline_stage} className="mt-2" />
            </div>

            <p className="text-sm bg-secondary rounded-xl p-3">{selected.message}</p>

            <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
              {selected.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selected.phone}</span>}
              {selected.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</span>}
              {selected.move_in_date && <span>Mudanza: {selected.move_in_date}</span>}
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground">Notas internas</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1" />
              <button type="button" onClick={saveNotes} className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg bg-secondary">Guardar notas</button>
            </div>

            {settings?.whatsapp_templates?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Plantillas WhatsApp</p>
                <div className="flex flex-wrap gap-2">
                  {settings.whatsapp_templates.map((tpl) => (
                    <button key={tpl.id} type="button" onClick={() => copyTemplate(tpl)} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-brand-violet/10 text-brand-violet">
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {selected.needs_reply && (
                <button type="button" onClick={markReplied} className="text-xs font-bold px-3 py-2 rounded-xl gradient-cta text-white">
                  Marcar respondido
                </button>
              )}
              <button type="button" onClick={() => setSelected(null)} className="text-xs font-bold px-3 py-2 rounded-xl bg-secondary ml-auto">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
