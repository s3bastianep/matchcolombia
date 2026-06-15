import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import MaintenanceTicketCard from "@/components/tickets/MaintenanceTicketCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TenantTickets() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: tickets = [] } = useQuery({
    queryKey: ["tenant-tickets", user?.id],
    queryFn: () => api.entities.Ticket.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });
  const { data: leases = [] } = useQuery({
    queryKey: ["tenant-leases", user?.id],
    queryFn: () => api.entities.Lease.filter({ tenant_user_id: user?.id }),
    enabled: !!user?.id,
  });

  const create = useMutation({
    mutationFn: () =>
      api.entities.Ticket.create({
        property_id: leases[0]?.property_id,
        lease_id: leases[0]?.id,
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        priority: "media",
        status: "abierto",
        owner_approval: null,
        estimated_cost: 0,
        images: [],
        timeline: [
          {
            at: new Date().toISOString(),
            text: "Solicitud enviada por el inquilino.",
            by: "inquilino",
          },
        ],
      }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["tenant-tickets"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Soporte y mantenimiento</h2>
        <p className="text-sm text-muted-foreground">
          Reporta problemas y sigue el estado, fotos y costos de cada reparación.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border/40 p-5 space-y-3">
        <h3 className="font-bold text-sm">Nuevo ticket</h3>
        <Input placeholder="Ej: Nevera no enfría" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Describe el problema…" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <button
          type="button"
          onClick={() => title.trim() && create.mutate()}
          className="gradient-cta text-white font-bold text-sm px-4 py-2.5 rounded-xl"
        >
          Enviar solicitud
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <MaintenanceTicketCard key={t.id} ticket={t} showOwnerActions={false} />
        ))}
      </div>
    </div>
  );
}
