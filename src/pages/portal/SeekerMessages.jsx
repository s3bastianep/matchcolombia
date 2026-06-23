import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import SupportChatPanel from "@/components/chat/SupportChatPanel";
import { BRAND } from "@/lib/brand";
import {
  SUPPORT_THREAD_ID,
  SUPPORT_THREAD_LABEL,
  filterSupportMessages,
  isStaffSender,
  isSupportThread,
  sortMessagesChronologically,
} from "@/lib/supportChat";

export default function SeekerMessages() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["support-messages", user?.id],
    queryFn: () => api.entities.Message.filter({ user_id: user?.id }),
    enabled: !!user?.id,
    refetchInterval: 15000,
  });

  const threadMessages = sortMessagesChronologically(filterSupportMessages(messages, user?.id));

  useEffect(() => {
    if (!user?.id) return;
    const unreadStaff = messages.filter(
      (m) => isSupportThread(m) && m.user_id === user.id && isStaffSender(m.sender_role) && !m.read
    );
    if (!unreadStaff.length) return;
    Promise.all(unreadStaff.map((m) => api.entities.Message.update(m.id, { read: true }))).then(() => {
      qc.invalidateQueries({ queryKey: ["support-messages"] });
    });
  }, [messages, user?.id, qc]);

  const send = useMutation({
    mutationFn: ({ body, attachments }) =>
      api.entities.Message.create({
        property_id: SUPPORT_THREAD_ID,
        user_id: user.id,
        user_name: user.name || user.username,
        user_role: user.role || "seeker",
        sender_role: "user",
        body: body || (attachments?.length ? "Archivo adjunto" : ""),
        attachments: attachments || [],
        read: false,
      }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["support-messages"] });
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold">Chat con {BRAND.name}</h2>
        <p className="text-sm text-muted-foreground">
          Habla con el equipo administrativo. Tus mensajes muestran si fueron vistos y puedes adjuntar fotos o archivos.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-violet/15 bg-brand-violet/[0.04] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-violet">{SUPPORT_THREAD_LABEL}</p>
        <p className="text-xs text-muted-foreground mt-1">
          1. Escribe tu consulta · 2. Adjunta fotos si aplica · 3. El equipo responde por aquí
        </p>
      </div>

      <SupportChatPanel
        messages={threadMessages}
        value={text}
        onChange={setText}
        onSend={(payload) => send.mutate(payload)}
        disabled={isLoading || send.isPending}
        viewerIsUser
        emptyHint={`Cuéntanos en qué podemos ayudarte. El equipo de ${BRAND.name} te responderá por aquí.`}
      />
    </div>
  );
}
