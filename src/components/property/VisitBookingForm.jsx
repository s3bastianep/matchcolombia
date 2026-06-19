import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, MessageCircle, ArrowRight, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/api/apiClient";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { getCurrentUserId } from "@/lib/authUser";
import { pushProcessUpdate } from "@/lib/processNotifications";
import {
  buildScheduledAt,
  formatVisitSummary,
  getSlotById,
} from "@/lib/visitSlots";
import VisitScheduler from "./VisitScheduler";
import ProcessStepper from "./ProcessStepper";
import { getTotalMonthly } from "@/lib/propertyCardUtils";
import { getPropertyReferenceCode } from "@/lib/propertyReference";
import { useAuth } from "@/lib/AuthContext";

const formatCOP = (v) =>
  v ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v) : "$0";

export default function VisitBookingForm({ property, propertyId, propertyTitle, onConfirmed, variant = "default" }) {
  const id = propertyId || property?.id;
  const title = propertyTitle || property?.title;
  const refCode = property ? getPropertyReferenceCode(property) : null;
  const { user, isAuthenticated, checkUserAuth } = useAuth();

  const { data: propertyVisits = [] } = useQuery({
    queryKey: ["property-visits", id],
    queryFn: () => api.entities.Visit.filter({ property_id: id }, "scheduled_at", 200),
    enabled: !!id,
  });

  const [form, setForm] = useState({ name: "", phone: "" });
  const [visitType, setVisitType] = useState("presencial");
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const sendBooking = useMutation({
    mutationFn: async (payload) => {
      let createdAccount = false;

      if (!getCurrentUserId()) {
        const result = await api.auth.registerFromBooking({
          name: payload.name,
          phone: payload.phone,
        });
        createdAccount = result.isNew;
        await checkUserAuth();
      }

      const userId = getCurrentUserId();
      const portalUrl = `${window.location.origin}/portal/visitas`;

      const inquiry = await api.entities.Inquiry.create({
        property_id: id,
        user_id: userId || undefined,
        name: payload.name,
        phone: payload.phone,
        visit_type: payload.visitType,
        visit_date: payload.visitDate,
        visit_slot: payload.visitSlot,
        scheduled_at: payload.scheduledAt,
        move_in_date: payload.visitDate,
        reference_code: refCode,
        pipeline_stage: "visita_agendada",
        status: "contactado",
      });

      await api.entities.Visit.create({
        property_id: id,
        user_id: userId || undefined,
        user_name: payload.name,
        scheduled_at: payload.scheduledAt,
        status: "pendiente",
        visit_type: payload.visitType,
        notes: `${payload.visitType === "virtual" ? "Virtual" : "Presencial"} · ${getSlotById(payload.visitSlot, payload.visitType)?.label}`,
      });

      const summary = formatVisitSummary(payload.visitDate, payload.visitSlot, payload.visitType);
      const teamMsg = createdAccount
        ? `¡Hola ${payload.name}! Tu visita quedó agendada: ${summary.typeLabel.toLowerCase()} el ${summary.dayLabel} a las ${summary.slotLabel} (${refCode}). Ya tienes cuenta en ${BRAND.name}. Revisa el estado aquí: ${portalUrl}`
        : `¡Hola ${payload.name}! Recibimos tu ${summary.typeLabel.toLowerCase()} para el ${summary.dayLabel} a las ${summary.slotLabel} (${refCode}). Revisa el estado de tu visita: ${portalUrl}`;

      if (userId) {
        await api.entities.Message.create({
          property_id: id,
          user_id: userId,
          sender_role: "team",
          body: teamMsg,
          read: false,
        });
      }

      pushProcessUpdate({ propertyId: id, propertyTitle: title, type: "visit", message: teamMsg });
      return { inquiry, summary, createdAccount, portalUrl };
    },
    onSuccess: ({ summary, createdAccount }) => {
      setAccountCreated(createdAccount);
      setConfirmed(summary);
      onConfirmed?.(summary);
    },
    onError: (err) => toast.error(err?.message || "No pudimos enviar tu solicitud. Intenta de nuevo."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitDate || !visitSlot) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    if (!form.name?.trim() || !form.phone?.trim()) {
      setShowContact(true);
      toast.error("Ingresa tu nombre y WhatsApp");
      return;
    }
    sendBooking.mutate({
      ...form,
      visitType,
      visitDate,
      visitSlot,
      scheduledAt: buildScheduledAt(visitDate, visitSlot, visitType),
    });
  };

  if (confirmed) {
    const portalUrl = `${window.location.origin}/portal/visitas`;
    const waText = accountCreated
      ? `Hola! Acabo de agendar visita (${refCode}): ${title}. Ya tengo cuenta, quiero ver el estado: ${portalUrl}`
      : `Hola! Acabo de agendar visita (${refCode}): ${title}. Ver estado: ${portalUrl}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border/40 shadow-[0_4px_24px_rgba(15,23,42,0.08)] p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
        </motion.div>
        <h3 className="text-lg font-bold text-foreground mb-1">¡Listo!</h3>
        <p className="text-sm text-foreground/80 mb-1">
          {confirmed.typeLabel}: <strong>{confirmed.dayLabel}</strong>
        </p>
        <p className="text-sm text-subtle mb-3">{confirmed.slotLabel}</p>
        <p className="text-xs text-foreground/70 leading-relaxed mb-1">
          {accountCreated
            ? "Creamos tu cuenta con tu WhatsApp. Ya puedes ver el estado de tu visita."
            : "Te escribiremos por WhatsApp para confirmar."}
        </p>
        <ProcessStepper currentStep="visita" prominent />
        <Link
          to="/portal/visitas"
          className="mt-5 flex items-center justify-center gap-2 w-full h-11 rounded-full gradient-cta text-white text-sm font-bold hover:opacity-95 transition-opacity"
        >
          Ver mi proceso
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full h-11 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 text-[#128C7E] text-sm font-semibold hover:bg-[#25D366]/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Abrir WhatsApp
        </a>
      </motion.div>
    );
  }

  const hasAdmin = (property?.admin_fee || 0) > 0;
  const totalMonthly = property ? getTotalMonthly(property) : 0;
  const showContactFields = showContact || (visitDate && visitSlot);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-1",
        variant === "mobile" ? "native-card-flat p-4" : "bg-white/90 rounded-2xl detail-card-soft p-5 sm:p-6"
      )}
    >
      <VisitScheduler
        visitType={visitType}
        onVisitTypeChange={setVisitType}
        selectedDate={visitDate}
        selectedSlot={visitSlot}
        onDateChange={(d) => {
          setVisitDate(d);
          setVisitSlot("");
        }}
        onSlotChange={setVisitSlot}
        propertyId={id}
        existingVisits={propertyVisits}
      />

      {property && (
        <div className="mt-6 rounded-xl bg-[hsl(var(--brand-violet)/0.05)] border border-[hsl(var(--brand-violet)/0.14)] overflow-hidden">
          <div className="px-4 py-3.5 flex items-center gap-2 border-b border-[hsl(var(--brand-violet)/0.1)] bg-white/60">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--brand-violet)/0.1)] flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4 text-brand-violet" strokeWidth={2} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-violet">Costo mensual</p>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-foreground/75">Total mensual</span>
              <span className="text-2xl font-extrabold text-foreground tabular-nums tracking-tight">
                {formatCOP(totalMonthly)}
              </span>
            </div>

            {hasAdmin ? (
              <div className="mt-3 pt-3 border-t border-[hsl(var(--brand-violet)/0.1)] space-y-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-foreground/55">Arriendo</span>
                  <span className="font-semibold text-foreground/85 tabular-nums">{formatCOP(property.monthly_rent)}</span>
                </div>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-foreground/55">Administración</span>
                  <span className="font-semibold text-foreground/85 tabular-nums">{formatCOP(property.admin_fee)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/55 mt-2">Canon de arriendo mensual</p>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showContactFields && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-foreground/75">
                {isAuthenticated ? "Tus datos de contacto" : "Nombre y WhatsApp"}
              </p>
              {!isAuthenticated && (
                <p className="text-[11px] text-foreground/55 leading-relaxed -mt-1">
                  Solo pedimos lo necesario para contactarte. Al confirmar, creamos tu cuenta automáticamente.
                </p>
              )}
              <Input
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-xl border-[#E0E0E0] bg-white text-sm"
                required
              />
              <Input
                type="tel"
                placeholder="WhatsApp o celular"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10 rounded-xl border-[#E0E0E0] bg-white text-sm"
                required
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={sendBooking.isPending}
        className={cn(
          "mt-6 w-full h-12 rounded-xl gradient-cta text-white font-bold text-sm",
          variant === "mobile" && "rounded-2xl h-14",
          "shadow-md shadow-brand-magenta/25 hover:opacity-95 hover:shadow-lg hover:shadow-brand-magenta/30",
          "transition-all duration-200 ease-out disabled:opacity-70",
          "flex items-center justify-center gap-2"
        )}
      >
        {sendBooking.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Agendando…
          </>
        ) : (
          "Agendar visita"
        )}
      </button>
    </form>
  );
}
