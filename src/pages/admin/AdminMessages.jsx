import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { api } from "@/api/apiClient";
import SupportChatPanel from "@/components/chat/SupportChatPanel";
import SupportUserRoleBadge from "@/components/chat/SupportUserRoleBadge";
import { cn } from "@/lib/utils";
import {
  SUPPORT_THREAD_ID,
  buildSupportThreads,
  countPendingUserMessages,
  sortMessagesChronologically,
} from "@/lib/supportChat";

function buildUsersById({ owners = [], leases = [], applications = [] }) {
  const map = {};

  owners.forEach((owner) => {
    if (!owner.user_id) return;
    map[owner.user_id] = { name: owner.name, role: "owner" };
  });

  leases.forEach((lease) => {
    if (!lease.tenant_user_id) return;
    map[lease.tenant_user_id] = {
      ...map[lease.tenant_user_id],
      role: "tenant",
    };
  });

  applications.forEach((app) => {
    if (!app.user_id || map[app.user_id]?.role) return;
    map[app.user_id] = { name: app.user_name, role: "seeker" };
  });

  return map;
}

function formatRelative(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function AdminMessages() {
  const qc = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [text, setText] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => api.entities.Message.filter({}, "-created_date", 500),
    refetchInterval: 10000,
  });
  const { data: owners = [] } = useQuery({
    queryKey: ["admin-owners"],
    queryFn: () => api.entities.Owner.filter({}, "-created_date", 100),
  });
  const { data: leases = [] } = useQuery({
    queryKey: ["admin-leases"],
    queryFn: () => api.entities.Lease.filter({}, "-created_date", 100),
  });
  const { data: applications = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => api.entities.Application.filter({}, "-created_date", 100),
  });

  const usersById = useMemo(
    () => buildUsersById({ owners, leases, applications }),
    [owners, leases, applications]
  );
  const threads = useMemo(() => buildSupportThreads(messages, usersById), [messages, usersById]);
  const pendingTotal = useMemo(() => countPendingUserMessages(messages), [messages]);
  const activeThread = threads.find((t) => t.userId === selectedUserId) || threads[0] || null;

  useEffect(() => {
    if (!selectedUserId && threads[0]) setSelectedUserId(threads[0].userId);
  }, [threads, selectedUserId]);

  useEffect(() => {
    if (!activeThread?.userId) return;
    const unread = messages.filter(
      (m) =>
        m.user_id === activeThread.userId &&
        m.property_id === SUPPORT_THREAD_ID &&
        m.sender_role === "user" &&
        !m.read
    );
    if (!unread.length) return;
    Promise.all(unread.map((m) => api.entities.Message.update(m.id, { read: true }))).then(() => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    });
  }, [activeThread?.userId, messages, qc]);

  const reply = useMutation({
    mutationFn: ({ body, attachments }) =>
      api.entities.Message.create({
        property_id: SUPPORT_THREAD_ID,
        user_id: activeThread.userId,
        sender_role: "admin",
        body: body || (attachments?.length ? "Archivo adjunto" : ""),
        attachments: attachments || [],
        read: false,
      }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      qc.invalidateQueries({ queryKey: ["support-messages"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Chats con usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conversaciones del equipo administrativo con inquilinos, buscadores y propietarios.
          </p>
        </div>
        {pendingTotal > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-4 py-2 text-sm font-bold">
            <MessageSquare className="w-4 h-4" />
            {pendingTotal} pendiente{pendingTotal !== 1 ? "s" : ""} por contestar
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4 min-h-[520px]">
        <aside className="bg-white rounded-2xl border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Conversaciones</p>
          </div>
          <div className="max-h-[480px] overflow-y-auto divide-y divide-border/30">
            {isLoading && <p className="p-4 text-sm text-muted-foreground">Cargando…</p>}
            {!isLoading && threads.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Aún no hay chats de soporte.</p>
            )}
            {threads.map((thread) => (
              <button
                key={thread.userId}
                type="button"
                onClick={() => setSelectedUserId(thread.userId)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-secondary/40 transition-colors",
                  activeThread?.userId === thread.userId && "bg-brand-violet/[0.06]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-sm truncate">{thread.userName}</p>
                      <SupportUserRoleBadge role={thread.userRole} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {thread.pending > 0 && (
                      <span className="inline-flex min-w-[1.25rem] h-5 px-1.5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                        {thread.pending}
                      </span>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatRelative(thread.lastAt)}</p>
                  </div>
                </div>
                {thread.lastMessage?.body && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{thread.lastMessage.body}</p>
                )}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-3">
          {activeThread ? (
            <>
              <div className="bg-white rounded-2xl border border-border/40 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{activeThread.userName}</p>
                  <SupportUserRoleBadge role={activeThread.userRole} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeThread.pending > 0
                    ? `${activeThread.pending} mensaje${activeThread.pending !== 1 ? "s" : ""} sin responder`
                    : "Sin mensajes pendientes"}
                </p>
              </div>
              <SupportChatPanel
                messages={sortMessagesChronologically(activeThread.messages)}
                value={text}
                onChange={setText}
                onSend={(payload) => reply.mutate(payload)}
                disabled={reply.isPending}
                viewerIsUser={false}
                placeholder="Responder como equipo HABIBAR…"
                emptyHint="Aún no hay mensajes en este chat."
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-border/40 min-h-[360px] flex items-center justify-center p-8 text-sm text-muted-foreground">
              Selecciona una conversación para responder.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
