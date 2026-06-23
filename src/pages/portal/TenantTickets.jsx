import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import MaintenanceTicketCard from "@/components/tickets/MaintenanceTicketCard";
import MaintenanceRequestForm from "@/components/tickets/MaintenanceRequestForm";
import { formatVisitDate, visitSlotLabel } from "@/lib/maintenanceForm";

export default function TenantTickets() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const formKey = useRef(0);

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
    mutationFn: (payload) =>
      api.entities.Ticket.create({
        property_id: leases[0]?.property_id,
        lease_id: leases[0]?.id,
        user_id: user.id,
        title: payload.title,
        description: payload.description,
        problem_type: payload.problem_type,
        visit_date: payload.visit_date,
        visit_time_slot: payload.visit_time_slot,
        visit_note: payload.visit_note || "",
        category: "mantenimiento",
        priority: "media",
        status: "abierto",
        owner_approval: null,
        estimated_cost: 0,
        images: payload.images || [],
        timeline: [
          {
            at: new Date().toISOString(),
            text: `Solicitud de mantenimiento enviada. Visita preferida: ${formatVisitDate(payload.visit_date)} (${visitSlotLabel(payload.visit_time_slot)}).`,
            by: "inquilino",
          },
        ],
      }),
    onSuccess: () => {
      formKey.current += 1;
      qc.invalidateQueries({ queryKey: ["tenant-tickets"] });
    },
  });

  const maintenanceTickets = tickets.filter(
    (t) => t.category === "mantenimiento" || !/renovaci[oó]n/i.test(`${t.title} ${t.description}`)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">Mantenimiento</h2>
        <p className="text-sm text-muted-foreground">
          Reporta daños del inmueble con fotos y el día en que puedes recibir a nuestro técnico. Para otras consultas usa{" "}
          <Link to="/inquilino/mensajes" className="font-semibold text-brand-violet hover:underline">
            Chat con HABIBAR
          </Link>
          .
        </p>
      </div>

      <MaintenanceRequestForm
        key={formKey.current}
        onSubmit={(payload) => create.mutate(payload)}
        isSubmitting={create.isPending}
      />

      {maintenanceTickets.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground">Tus solicitudes</h3>
          {maintenanceTickets.map((t) => (
            <MaintenanceTicketCard key={t.id} ticket={t} showOwnerActions={false} />
          ))}
        </div>
      )}
    </div>
  );
}
