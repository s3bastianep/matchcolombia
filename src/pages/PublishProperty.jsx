import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Upload, X, Home, ArrowRight, ArrowLeft, Bed, Bath, Car,
  Building2, DollarSign, Camera, Sparkles, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { CITIES, getZonesForCity } from "@/lib/colombia";
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, PARKING_OPTIONS, ESTRATO_OPTIONS } from "@/lib/propertyFilters";

const STEPS = [
  { id: "basic", label: "Básico", icon: Home },
  { id: "details", label: "Detalles", icon: Bed },
  { id: "price", label: "Precio", icon: DollarSign },
  { id: "publish", label: "Fotos", icon: Camera },
];

const MANAGEMENT_PERKS = [
  "Atendemos a los interesados por ti",
  "Coordinamos visitas y consultas",
  "Te avisamos cuando alguien quiera ver tu inmueble",
];

const amenitiesList = [
  "Gimnasio", "Piscina", "Terraza", "BBQ", "Salón comunal", "Seguridad 24h",
  "Ascensor", "Lavandería", "Depósito", "Zona verde", "Portería", "Citófono",
];

const TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "estudio", label: "Estudio" },
  { value: "habitacion", label: "Habitación" },
];

function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-[2.75rem] px-4 py-2.5 rounded-full border text-sm font-semibold transition-all",
        active
          ? "border-foreground bg-foreground text-white"
          : "border-border/80 bg-white hover:border-foreground/25"
      )}
    >
      {label}
    </button>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="surface-card p-6 sm:p-8">
      <h2 className="font-extrabold text-xl mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">{children}</label>;
}

export default function PublishProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", property_type: "apartamento", city: "Bogotá",
    neighborhood: "", locality: "", address: "",
    bedrooms: "", bathrooms: "", area_sqm: "", floor: "",
    parking: false, parking_spots: 0, furnished: "sin_amoblar", pets_allowed: false,
    amenities: [], images: [], available_from: "",
    monthly_rent: "", deposit: "", admin_fee: "",
    min_contract_months: "", estrato: "",
    contact_name: user?.name || "",
    contact_phone: "", contact_email: user?.email || "",
    status: "disponible",
  });
  const [uploading, setUploading] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const zones = getZonesForCity(form.city);

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const result = await base44.integrations.Core.UploadFile({ file });
      urls.push(result.file_url);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  };

  const createProperty = useMutation({
    mutationFn: (data) => {
      const cleaned = { ...data };
      ["monthly_rent", "deposit", "admin_fee", "bedrooms", "bathrooms", "area_sqm", "floor", "min_contract_months", "parking_spots"].forEach((k) => {
        if (cleaned[k] === "" || cleaned[k] == null) delete cleaned[k];
        else cleaned[k] = Number(cleaned[k]);
      });
      if (cleaned.estrato === "" || cleaned.estrato == null) delete cleaned.estrato;
      else if (!isNaN(cleaned.estrato)) cleaned.estrato = Number(cleaned.estrato);
      cleaned.parking = (cleaned.parking_spots || 0) > 0;
      return base44.entities.Property.create(cleaned);
    },
    onSuccess: () => {
      toast.success("¡Inmueble publicado! Nuestro equipo gestionará las consultas por ti.");
      navigate("/explorar");
    },
  });

  const validateStep = () => {
    if (step === 0) {
      if (!form.title || !form.neighborhood || !form.city) {
        toast.error("Completa título, ciudad y barrio");
        return false;
      }
    }
    if (step === 1) {
      if (!form.bedrooms || !form.bathrooms) {
        toast.error("Indica habitaciones y baños");
        return false;
      }
    }
    if (step === 2) {
      if (!form.monthly_rent) {
        toast.error("Indica el arriendo mensual");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      if (!form.contact_name) {
        toast.error("Agrega tu nombre para que podamos contactarte");
        return;
      }
      createProperty.mutate(form);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[hsl(240,40%,98%)]">
      <div className="bg-white border-b border-border/50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(340,82%,52%)]/10 text-[hsl(340,82%,45%)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Publicar gratis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Publica tu inmueble en <span className="text-gradient">minutos</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Nosotros gestionamos las consultas · Visible en Bogotá y Barranquilla
          </p>

          <div className="mt-8 flex items-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <React.Fragment key={s.id}>
                  <div className={cn("flex items-center gap-2 shrink-0", i > 0 && "hidden sm:flex")}>
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                        done && "gradient-cta text-white",
                        active && !done && "bg-[hsl(265,75%,58%)]/15 text-[hsl(265,75%,50%)] ring-2 ring-[hsl(265,75%,58%)]/30",
                        !done && !active && "bg-secondary text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={cn("text-xs font-bold hidden md:inline", active ? "text-foreground" : "text-muted-foreground")}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-border/60 rounded hidden sm:block" />}
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div className="h-full gradient-cta" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
          <p className="text-xs font-semibold text-muted-foreground mt-2">Paso {step + 1} de {STEPS.length}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <SectionCard title="Información básica" subtitle="Cuéntanos qué inmueble vas a arrendar">
                <div className="space-y-5">
                  <div>
                    <FieldLabel>Título del anuncio *</FieldLabel>
                    <Input placeholder="Ej: Apartamento luminoso en Chapinero" value={form.title} onChange={(e) => update("title", e.target.value)} className="h-12 rounded-xl border-border/60" />
                  </div>
                  <div>
                    <FieldLabel>Descripción</FieldLabel>
                    <Textarea placeholder="Describe lo mejor de tu inmueble..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="rounded-xl border-border/60 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Tipo *</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map((t) => (
                          <Pill key={t.value} label={t.label} active={form.property_type === t.value} onClick={() => update("property_type", t.value)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Ciudad *</FieldLabel>
                      <Select value={form.city} onValueChange={(v) => update("city", v)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CITIES.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Barrio *</FieldLabel>
                      <Input placeholder="Ej: Quinta Camacho" value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Localidad</FieldLabel>
                      <Select value={form.locality || ""} onValueChange={(v) => update("locality", v)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                        <SelectContent>
                          {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Dirección</FieldLabel>
                    <Input placeholder="Cra 7 #72-15" value={form.address} onChange={(e) => update("address", e.target.value)} className="h-12 rounded-xl" />
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 1 && (
              <SectionCard title="Características" subtitle="Lo que los arrendatarios más filtran">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Bed className="w-5 h-5" /><span className="font-extrabold">Habitaciones *</span></div>
                    <div className="flex flex-wrap gap-2">
                      {BEDROOM_OPTIONS.map((v) => (
                        <Pill key={v} label={v === "5" ? "5+" : v} active={String(form.bedrooms) === v} onClick={() => update("bedrooms", v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Bath className="w-5 h-5" /><span className="font-extrabold">Baños *</span></div>
                    <div className="flex flex-wrap gap-2">
                      {BATHROOM_OPTIONS.map((v) => (
                        <Pill key={v} label={v === "5" ? "5+" : v} active={String(form.bathrooms) === v} onClick={() => update("bathrooms", v)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Car className="w-5 h-5" /><span className="font-extrabold">Parqueaderos</span></div>
                    <div className="flex flex-wrap gap-2">
                      <Pill label="0" active={form.parking_spots === 0} onClick={() => update("parking_spots", 0)} />
                      {PARKING_OPTIONS.map((v) => (
                        <Pill key={v} label={v === "5" ? "5+" : v} active={String(form.parking_spots) === v} onClick={() => update("parking_spots", Number(v))} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Building2 className="w-5 h-5" /><span className="font-extrabold">Estrato</span></div>
                    <div className="flex flex-wrap gap-2">
                      {ESTRATO_OPTIONS.map((e) => (
                        <Pill key={e.value} label={e.label} active={String(form.estrato) === e.value} onClick={() => update("estrato", e.value)} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Área (m²)</FieldLabel>
                      <Input type="number" min="0" value={form.area_sqm} onChange={(e) => update("area_sqm", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Piso</FieldLabel>
                      <Input type="number" min="0" value={form.floor} onChange={(e) => update("floor", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "pets_allowed", label: "Mascotas 🐾" },
                      { key: "furnished", label: "Amoblado", toggle: () => update("furnished", form.furnished === "amoblado" ? "sin_amoblar" : "amoblado"), active: form.furnished === "amoblado" },
                    ].map((item) => (
                      <Pill
                        key={item.label}
                        label={item.label}
                        active={item.toggle ? item.active : form[item.key]}
                        onClick={item.toggle || (() => update(item.key, !form[item.key]))}
                      />
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 2 && (
              <SectionCard title="Precio y amenidades" subtitle="Sé transparente con los costos">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <FieldLabel>Arriendo / mes *</FieldLabel>
                      <Input type="number" placeholder="2800000" value={form.monthly_rent} onChange={(e) => update("monthly_rent", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Administración</FieldLabel>
                      <Input type="number" placeholder="320000" value={form.admin_fee} onChange={(e) => update("admin_fee", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Depósito</FieldLabel>
                      <Input type="number" placeholder="2800000" value={form.deposit} onChange={(e) => update("deposit", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Disponible desde</FieldLabel>
                      <Input type="date" value={form.available_from} onChange={(e) => update("available_from", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Contrato mínimo (meses)</FieldLabel>
                      <Input type="number" min="1" placeholder="12" value={form.min_contract_months} onChange={(e) => update("min_contract_months", e.target.value)} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Amenidades</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map((a) => (
                        <Pill key={a} label={a} active={form.amenities.includes(a)} onClick={() => toggleAmenity(a)} />
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 3 && (
              <SectionCard title="Fotos y datos del propietario" subtitle="Sube fotos y déjanos tus datos. Nosotros gestionamos todo con los interesados.">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[hsl(265,75%,58%)]/20 bg-[hsl(265,75%,58%)]/5 p-5">
                    <p className="font-extrabold text-sm mb-3">¿Cómo funciona con {BRAND.name}?</p>
                    <ul className="space-y-2">
                      {MANAGEMENT_PERKS.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(265,75%,50%)] shrink-0 mt-0.5" strokeWidth={3} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                      Los arrendatarios contactan a {BRAND.name}. Tu teléfono y email no se muestran en el anuncio.
                    </p>
                  </div>

                  <div>
                    <FieldLabel>Fotos del inmueble</FieldLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {form.images.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => update("images", form.images.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-[hsl(265,75%,58%)]/30 hover:border-[hsl(265,75%,58%)]/60 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-[hsl(265,75%,58%)] mb-1" />
                            <span className="text-xs font-semibold text-muted-foreground">Subir</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Tus datos (solo para nuestro equipo)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <FieldLabel>Tu nombre *</FieldLabel>
                        <Input placeholder="Nombre del propietario" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="h-12 rounded-xl" />
                      </div>
                      <div>
                        <FieldLabel>Tu WhatsApp</FieldLabel>
                        <Input type="tel" placeholder="+57 301..." value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} className="h-12 rounded-xl" />
                        <p className="text-[11px] text-muted-foreground mt-1.5">Para avisarte cuando haya interesados</p>
                      </div>
                      <div>
                        <FieldLabel>Tu email</FieldLabel>
                        <Input type="email" placeholder="tu@email.com" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} className="h-12 rounded-xl" />
                        <p className="text-[11px] text-muted-foreground mt-1.5">Confirmaciones y seguimiento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Cancelar" : "Atrás"}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={createProperty.isPending}
            className="flex items-center gap-2 gradient-cta btn-glow text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-60"
          >
            {step === STEPS.length - 1
              ? (createProperty.isPending ? "Publicando..." : "Publicar inmueble")
              : "Continuar"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
