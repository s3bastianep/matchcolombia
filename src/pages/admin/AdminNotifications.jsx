import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead } from "@/lib/adminNotifications";
import { Bell, CheckCheck } from "lucide-react";

export default function AdminNotifications() {
  const [items, setItems] = React.useState([]);

  const refresh = () => setItems(getAdminNotifications());

  useEffect(() => {
    refresh();
    window.addEventListener("admin-notifications-updated", refresh);
    return () => window.removeEventListener("admin-notifications-updated", refresh);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Notificaciones</h2>
          <p className="text-sm text-muted-foreground">{unread} sin leer de {items.length} total</p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={() => { markAllAdminNotificationsRead(); refresh(); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-secondary"
          >
            <CheckCheck className="w-4 h-4" /> Marcar todas leídas
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border/40">
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-bold">Sin notificaciones</p>
          <p className="text-sm text-muted-foreground mt-1">Las alertas de leads, visitas y verificaciones aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${n.read ? "border-border/30 opacity-70" : "border-brand-violet/25"}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-transparent" : "bg-brand-violet"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {new Date(n.created_at).toLocaleString("es-CO")}
                </p>
                {n.link && (
                  <Link to={n.link} onClick={() => { markAdminNotificationRead(n.id); refresh(); }} className="text-xs font-bold text-brand-violet mt-2 inline-block">
                    Ver detalle →
                  </Link>
                )}
              </div>
              {!n.read && (
                <button type="button" onClick={() => { markAdminNotificationRead(n.id); refresh(); }} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-secondary shrink-0">
                  Leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
