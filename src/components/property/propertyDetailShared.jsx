import React, { useState } from "react";
import { toast } from "sonner";
import { Phone, Check, Copy, MessageCircle, Shield, ChevronUp, DoorOpen, Trees, ClipboardList, UserRound, Search, MapPin, Camera } from "lucide-react";
import VerifiedBadge from "@/components/brand/VerifiedBadge";
import { getPropertyImages } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { getPropertyReferenceCode } from "@/lib/propertyReference";
import { getTotalMonthly } from "@/lib/propertyCardUtils";
import {
  getInteriorCharacteristics,
  getExteriorCharacteristics,
  hasPropertyCharacteristics,
} from "@/lib/propertyBuildingInfo";
import { getParkingSpots, hasElevator } from "@/lib/propertyFilters";
import { Bed, Bath, Maximize, Building, Car, PawPrint, ArrowUpDown } from "lucide-react";
import ProcessStepper from "./ProcessStepper";

export const formatCOP = (v) =>
  v ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v) : "$0";

export const furnishedLabels = { amoblado: "Amoblado", semi_amoblado: "Semi-amoblado", sin_amoblar: "Sin amoblar" };
export const typeLabel = { apartamento: "Apartamento", casa: "Casa", estudio: "Estudio", habitacion: "Habitación", penthouse: "Penthouse", duplex: "Dúplex" };

export const ICON_STROKE = 2;

const COMPACT_SPEC_TONES = [
  { tile: "bg-brand-magenta/[0.09] border-brand-magenta/20", icon: "text-brand-magenta" },
  { tile: "bg-brand-violet/[0.09] border-brand-violet/20", icon: "text-brand-violet" },
  { tile: "bg-[hsl(330,85%,55%,0.08)] border-brand-magenta/15", icon: "text-brand-magenta" },
  { tile: "bg-brand-violet/[0.07] border-brand-violet/15", icon: "text-brand-violet" },
];

export function SpecTile({ icon: Icon, label, value, tone = "pink" }) {
  const tileTone = tone === "violet"
    ? "bg-[hsl(var(--brand-violet)/0.09)]"
    : "bg-[hsl(var(--brand-magenta)/0.08)]";
  const iconTone = tone === "violet" ? "text-brand-violet" : "text-brand-magenta";

  return (
    <div className={cn("flex items-center gap-3 p-4 rounded-xl transition-all duration-200", tileTone)}>
      <Icon className={cn("w-5 h-5 shrink-0", iconTone)} strokeWidth={ICON_STROKE} />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-subtle">{label}</p>
        <p className="text-base font-extrabold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}

export function PropertyEssentialsSection({ property, compact = false }) {
  const parkingSpots = getParkingSpots(property);

  const specs = [
    property.bedrooms != null && { icon: Bed, label: "Habitaciones", value: property.bedrooms },
    property.bathrooms != null && { icon: Bath, label: "Baños", value: property.bathrooms },
    property.area_sqm && { icon: Maximize, label: "Área", value: `${property.area_sqm} m²` },
    property.parking != null && {
      icon: Car,
      label: "Parqueadero",
      value: parkingSpots > 0 ? parkingSpots : "No",
    },
    { icon: ArrowUpDown, label: "Ascensor", value: hasElevator(property) ? "Sí" : "No" },
    property.pets_allowed != null && {
      icon: PawPrint,
      label: "Mascotas",
      value: property.pets_allowed ? "Sí" : "No",
    },
    property.estrato && { icon: Building, label: "Estrato", value: property.estrato },
  ].filter(Boolean);

  if (!specs.length) return null;

  if (compact) {
    return (
      <section>
        <div className="grid grid-cols-3 gap-2">
          {specs.map((s, i) => {
            const tone = COMPACT_SPEC_TONES[i % COMPACT_SPEC_TONES.length];
            return (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border py-3 px-1 text-center min-h-[76px] shadow-sm",
                  tone.tile
                )}
              >
                <s.icon className={cn("w-4 h-4 mb-1.5", tone.icon)} strokeWidth={ICON_STROKE} />
                <p className="text-sm font-extrabold leading-none text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground mt-1 leading-tight">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="detail-section">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-subtle mb-4">Lo esencial</p>
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map((s, i) => (
          <SpecTile key={s.label} icon={s.icon} label={s.label} value={s.value} tone={i % 2 === 0 ? "pink" : "violet"} />
        ))}
      </div>
    </section>
  );
}

export function PropertyReferenceBadge({ property, className }) {
  const code = getPropertyReferenceCode(property);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado");
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,98%)] text-xs font-medium text-foreground/70 hover:border-[hsl(var(--brand-violet)/0.35)] hover:bg-[hsl(var(--brand-violet)/0.04)] hover:text-foreground transition-smooth group",
        className
      )}
      title="Copiar código de referencia"
    >
      <span>
        Ref. <span className="font-bold text-foreground/85 tabular-nums">{code}</span>
      </span>
      <Copy className="w-3.5 h-3.5 text-foreground/45 group-hover:text-brand-violet" strokeWidth={2} />
    </button>
  );
}

export function PropertyDetailHeader({ property, compact = false }) {
  const images = getPropertyImages(property);
  const type = typeLabel[property.property_type] || property.property_type;
  const furnished = furnishedLabels[property.furnished];
  const isAvailable = !property.status || property.status === "disponible";
  const total = getTotalMonthly(property);

  if (compact) {
    const meta = [type, furnished, isAvailable && "Disponible"].filter(Boolean).join(" · ");

    return (
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <VerifiedBadge property={property} size="xs" />
          {meta && (
            <span className="text-xs font-medium text-muted-foreground truncate">{meta}</span>
          )}
        </div>
        <h1 className="text-xl font-bold leading-snug tracking-tight text-foreground">{property.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-magenta" strokeWidth={2} />
          <span className="truncate">
            {property.neighborhood} · {property.city}
            {property.floor != null && property.floor !== "" ? ` · Piso ${property.floor}` : ""}
          </span>
        </p>
        <p className="text-2xl font-extrabold leading-none tabular-nums text-foreground mt-4">
          {formatCOP(total || property.monthly_rent)}
          <span className="text-base font-medium text-muted-foreground ml-1">/mes</span>
        </p>
        {(property.admin_fee || 0) > 0 && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Arriendo {formatCOP(property.monthly_rent)} + admin {formatCOP(property.admin_fee)}
          </p>
        )}
        <PropertyReferenceBadge property={property} className="mt-3 !text-[11px] !py-1.5" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <VerifiedBadge property={property} size="sm" />
        {isAvailable && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[hsl(var(--brand-violet)/0.09)] text-[11px] font-semibold text-brand-violet">
            Disponible
          </span>
        )}
        {type && (
          <span className="inline-flex items-center px-3 py-1 rounded-full gradient-cta text-[11px] font-bold text-white shadow-sm">
            {type}
          </span>
        )}
        {furnished && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/55 text-[11px] font-semibold text-foreground/75">
            {furnished}
          </span>
        )}
        {images.length > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--brand-violet)/0.09)] text-[11px] font-semibold text-brand-violet">
            <Camera className="w-3 h-3 shrink-0" strokeWidth={2.25} />
            {images.length} fotos
          </span>
        )}
      </div>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
        {property.title}
      </h1>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--brand-violet)/0.06)] border border-[hsl(var(--brand-violet)/0.14)] text-sm">
          <MapPin className="w-3.5 h-3.5 text-brand-violet shrink-0" strokeWidth={2} />
          <span className="font-semibold text-foreground">{property.neighborhood}</span>
          <span className="text-foreground/35">·</span>
          <span className="text-foreground/70">{property.city || property.locality}</span>
          {property.floor != null && property.floor !== "" && (
            <>
              <span className="text-foreground/35">·</span>
              <span className="font-semibold text-brand-magenta">Piso {property.floor}</span>
            </>
          )}
        </span>
      </div>

      <PropertyReferenceBadge property={property} className="mt-3" />
    </div>
  );
}

export function DirectContactOptions({ property, className }) {
  const ref = getPropertyReferenceCode(property);
  const waText = `Hola! Me interesa este inmueble (${ref}): ${property.title}`;

  return (
    <div className={cn("pt-1", className)}>
      <p className="text-center text-[11px] font-medium text-subtle mb-2.5">
        Escríbenos: te responde alguien del equipo, no un bot
      </p>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-[#25D366]/50 bg-[#25D366]/8 text-[#128C7E] text-[11px] font-semibold transition-all duration-200 ease-out hover:bg-[#25D366]/15"
        >
          <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
          WhatsApp
        </a>
        <a
          href={`tel:${BRAND.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl btn-violet-outline text-[11px] transition-smooth"
        >
          <Phone className="w-3.5 h-3.5 text-brand-violet" strokeWidth={2} />
          Llamar
        </a>
      </div>
    </div>
  );
}

export function BrandCallout() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--brand-violet)/0.06)]">
      <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center shrink-0 shadow-sm">
        <span className="text-sm font-extrabold text-white leading-none">M</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">{BRAND.contactRole}</p>
        <p className="text-xs text-foreground/60 mt-0.5 leading-snug">{BRAND.contactTagline}</p>
      </div>
    </div>
  );
}

export function CharacteristicChip({ label }) {
  return (
    <span className="characteristics-chip">
      <Check className="w-3.5 h-3.5 text-brand-violet shrink-0" strokeWidth={2.5} />
      {label}
    </span>
  );
}

function CharacteristicPanel({ icon: Icon, title, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!items?.length) return null;

  return (
    <div className="characteristics-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="characteristics-panel-header"
        aria-expanded={open}
      >
        <Icon className="w-4 h-4 text-foreground/55 shrink-0" strokeWidth={2} />
        <span className="flex-1 text-sm font-bold text-foreground">{title}</span>
        <ChevronUp className={cn("w-4 h-4 text-foreground/45 shrink-0 transition-transform duration-200", !open && "rotate-180")} strokeWidth={2} />
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <CharacteristicChip key={item} label={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PropertyCharacteristicsSection({ property }) {
  if (!hasPropertyCharacteristics(property)) return null;

  const interior = getInteriorCharacteristics(property);
  const exterior = getExteriorCharacteristics(property);

  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold tracking-tight text-foreground lg:text-lg lg:font-extrabold">Características del inmueble</h2>
      <div className="space-y-3">
        <CharacteristicPanel icon={DoorOpen} title="Interiores" items={interior} />
        <CharacteristicPanel icon={Trees} title="Zonas comunes y exteriores" items={exterior} />
      </div>
    </section>
  );
}

export function AmenityChips({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((a) => (
        <span
          key={a}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-secondary/40 text-sm font-medium text-foreground/75 transition-smooth hover:bg-secondary/60"
        >
          <Check className="w-3.5 h-3.5 text-brand-violet" strokeWidth={2} />
          {a}
        </span>
      ))}
    </div>
  );
}

export function PersonalSearchSection() {
  const openQuiz = () => window.dispatchEvent(new CustomEvent("open-habibar-quiz"));

  const steps = [
    {
      icon: ClipboardList,
      text: "Cuéntanos zona, habitaciones, presupuesto y lo que necesitas en tu próximo hogar.",
    },
    {
      icon: UserRound,
      text: "Déjanos tu nombre y WhatsApp para que un asesor te contacte.",
    },
    {
      icon: MessageCircle,
      text: `${BRAND.name} te propone inmuebles que encajan contigo y coordina todo el proceso.`,
    },
  ];

  return (
    <section className="detail-section">
      <div className="space-y-2 mb-6">
        <h2 className="detail-section-title">¿Quieres que te busquemos un inmueble?</h2>
        <p className="detail-body">
          Si lo que ves no es exactamente lo tuyo, hacemos la búsqueda por ti y te conectamos con quien te lo consiga.
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={step.text}
            className="flex items-start gap-3.5 rounded-xl border border-[hsl(0,0%,90%)] bg-white px-4 py-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[hsl(var(--brand-violet)/0.08)] border border-[hsl(var(--brand-violet)/0.2)] flex items-center justify-center shrink-0">
              <step.icon className="w-4 h-4 text-brand-violet" strokeWidth={2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-violet mb-1">
                Paso {i + 1}
              </p>
              <p className="text-sm font-medium text-foreground/85 leading-snug">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={openQuiz}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-cta text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md shadow-brand-magenta/20 hover:opacity-95 transition-opacity"
      >
        <Search className="w-4 h-4" strokeWidth={2.5} />
        Solicitar búsqueda personalizada
      </button>
    </section>
  );
}

export function ProcessStepperCard() {
  return (
    <div className="detail-card-soft p-5">
      <p className="text-sm font-bold text-foreground">Tu proceso con {BRAND.name}</p>
      <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
        Todo gestionado. Tú no coordinas nada, nosotros sí.
      </p>
      <p className="text-xs font-semibold text-brand-violet mt-4 mb-2">
        Así se verá tu proceso al agendar
      </p>
      <ProcessStepper preview prominent />
      <p className="text-xs text-foreground/75 mt-4 leading-relaxed">
        Con tu nombre y WhatsApp creamos tu cuenta al confirmar. Sin formularios extra.
      </p>
    </div>
  );
}

export function ExpertCredibility({ property }) {
  if (!property.team_visit_date && !property.photos_by_team) return null;

  const visitLabel = property.team_visit_date
    ? new Date(property.team_visit_date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/25 mb-5">
      <Shield className="detail-icon mt-0.5" strokeWidth={2} />
      <div>
        <p className="text-sm font-semibold text-foreground">Revisado por {BRAND.name}</p>
        <p className="detail-body mt-0.5">
          {visitLabel && <>Nuestro equipo visitó este inmueble el {visitLabel}. </>}
          {property.photos_by_team && "Fotos tomadas por nuestro equipo, no del anunciante."}
        </p>
      </div>
    </div>
  );
}

export function PriceBlock({ property, compact = false }) {
  const total = getTotalMonthly(property);
  const hasAdmin = (property.admin_fee || 0) > 0;

  return (
    <div>
      <p className={cn("font-bold text-foreground tracking-tight", compact ? "text-2xl" : "text-3xl")}>
        {formatCOP(total)}
        <span className={cn("font-semibold text-subtle", compact ? "text-sm" : "text-base")}>/mes</span>
      </p>
      {hasAdmin && (
        <p className="text-sm text-subtle mt-1">
          Arriendo {formatCOP(property.monthly_rent)} + admin {formatCOP(property.admin_fee)}
        </p>
      )}
      {!hasAdmin && (
        <p className="text-sm text-subtle mt-1">Canon de arriendo mensual</p>
      )}
    </div>
  );
}
