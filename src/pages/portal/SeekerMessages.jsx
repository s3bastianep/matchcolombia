import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { EmptyState } from "@/components/panels/PipelineBoard";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

export default function SeekerMessages() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [text, setText] = useState("");

  const { data: messages = [] } = useQuery({
    queryKey: ["my-messages", user?.id],
    queryFn: () => api.entities.Message.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["msg-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const threads = [...new Set(messages.map((m) => m.property_id))];
  const activeProperty = selectedProperty || threads[0];
  const threadMessages = messages.filter((m) => m.property_id === activeProperty).sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const send = useMutation({
    mutationFn: () =>
      api.entities.Message.create({
        property_id: activeProperty,
        user_id: user.id,
        sender_role: "user",
        body: text.trim(),
        read: false,
      }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["my-messages"] });
    },
  });

  if (!threads.length) {
    return (
      <EmptyState
        title="Sin conversaciones"
        description="Escribe desde el detalle de una propiedad o solicita visita para abrir un hilo."
        action={<Link to="/explorar" className="inline-block gradient-cta text-white font-bold px-5 py-2.5 rounded-xl text-sm">Explorar</Link>}
      />
    );
  }

  const propTitle = (id) => properties.find((p) => p.id === id)?.title || id;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold">Mensajes por propiedad</h2>
      <div className="flex flex-wrap gap-2">
        {threads.map((pid) => (
          <button
            key={pid}
            type="button"
            onClick={() => setSelectedProperty(pid)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border ${activeProperty === pid ? "bg-foreground text-white border-foreground" : "bg-white"}`}
          >
            {propTitle(pid).slice(0, 30)}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border/40 min-h-[360px] flex flex-col">
        <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
          {threadMessages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.sender_role === "user" ? "bg-brand-violet text-white" : "bg-secondary"}`}>
                {m.body}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && text.trim() && send.mutate()}
            placeholder="Escribe un mensaje…"
            className="flex-1 h-10 px-4 rounded-xl border text-sm"
          />
          <button type="button" onClick={() => text.trim() && send.mutate()} className="h-10 w-10 rounded-xl gradient-cta text-white flex items-center justify-center">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
