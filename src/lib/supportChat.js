/** Hilo único de chat usuario ↔ equipo administrativo HABIBAR */
export const SUPPORT_THREAD_ID = "support";

export const SUPPORT_THREAD_LABEL = "Equipo HABIBAR";

const SUPPORT_ROLE_LABELS = {
  owner: "Propietario",
  tenant: "Inquilino",
  seeker: "Buscador",
  admin: "Administrador",
};

export function formatSupportUserRoleLabel(role) {
  if (!role) return null;
  return SUPPORT_ROLE_LABELS[role] || role.replace(/_/g, " ");
}

export function supportRoleBadgeClass(role) {
  if (role === "owner") return "bg-brand-magenta/10 text-brand-magenta border-brand-magenta/25";
  if (role === "tenant") return "bg-brand-violet/10 text-brand-violet border-brand-violet/25";
  if (role === "seeker") return "bg-emerald-500/10 text-emerald-800 border-emerald-500/25";
  return "bg-secondary text-muted-foreground border-border/40";
}

export function isSupportThread(message) {
  return message?.property_id === SUPPORT_THREAD_ID;
}

export function isStaffSender(role) {
  return role === "admin" || role === "team";
}

export function isUserSender(role) {
  return role === "user" || role === "seeker" || role === "tenant" || role === "owner";
}

export function sortMessagesChronologically(messages = []) {
  return [...messages].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
}

export function filterSupportMessages(messages = [], userId) {
  return messages.filter((m) => isSupportThread(m) && (!userId || m.user_id === userId));
}

export function countPendingUserMessages(messages = []) {
  return messages.filter((m) => isSupportThread(m) && m.sender_role === "user" && !m.read).length;
}

/** Etiqueta de lectura para mensajes propios del chat de soporte. */
export function messageReadLabel(message, { viewerIsUser }) {
  const fromStaff = isStaffSender(message?.sender_role);
  const fromUser = message?.sender_role === "user";
  const isOwn = (viewerIsUser && fromUser) || (!viewerIsUser && fromStaff);
  if (!isOwn) return null;
  return message?.read ? "Visto" : "Enviado";
}

export function buildSupportThreads(messages = [], usersById = {}) {
  const byUser = new Map();

  for (const message of messages.filter(isSupportThread)) {
    const uid = message.user_id;
    if (!uid) continue;
    if (!byUser.has(uid)) {
      byUser.set(uid, {
        userId: uid,
        userName: usersById[uid]?.name || message.user_name || usersById[uid]?.username || "Usuario",
        userRole: usersById[uid]?.role || null,
        messages: [],
        pending: 0,
        lastAt: null,
      });
    }
    const thread = byUser.get(uid);
    if (message.user_name) thread.userName = message.user_name;
    if (message.user_role) thread.userRole = message.user_role;
    const profileRole = usersById[uid]?.role;
    if (profileRole) thread.userRole = profileRole;
    thread.messages.push(message);
    if (message.sender_role === "user" && !message.read) thread.pending += 1;
    const at = new Date(message.created_date).getTime();
    if (!thread.lastAt || at > thread.lastAt) thread.lastAt = at;
  }

  return [...byUser.values()]
    .map((thread) => ({
      ...thread,
      messages: sortMessagesChronologically(thread.messages),
      lastMessage: sortMessagesChronologically(thread.messages).at(-1),
    }))
    .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0));
}
