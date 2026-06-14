import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar,
  Car, PawPrint, Building, Phone, Mail, Check, Send,
  Layers, Shield, Clock, Share2, Heart, Sparkles, Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PropertyGallery from "../components/property/PropertyGallery";
import PropertyLocationMap from "../components/property/PropertyLocationMap";
import SimilarProperties from "../components/property/SimilarProperties";
import SmartImage from "@/components/ui/SmartImage";
import { getPropertyImages, ROOM_LABELS } from "@/lib/colombiaImages";
import { getParkingSpots } from "@/lib/propertyFilters";
import { isInShortlist, toggleShortlist } from "@/lib/shortlist";
import { useAuth } from "@/lib/AuthContext";
import { BRAND } from "@/lib/brand";
import VerifiedBadge from "@/components/brand/VerifiedBadge";

const formatCOP = (v) =>
  v ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v) : "$0";

const furnishedLabels = { amoblado: "Amoblado", semi_amoblado: "Semi-amoblado", sin_amoblar: "Sin amoblar" };
const typeLabel = { apartamento: "Apartamento", casa: "Casa", estudio: "Estudio", habitacion: "Habitación", penthouse: "Penthouse", duplex: "Dúplex" };

const SPEC_COLORS = [
  { bg: "bg-brand-magenta/10", icon: "text-brand-magenta" },
  { bg: "bg-brand-violet/10", icon: "text-brand-violet" },
  { bg: "bg-brand-magenta/10", icon: "text-brand-magenta" },
  { bg: "bg-brand-violet/10", icon: "text-brand-violet" },
  { bg: "bg-secondary", icon: "text-foreground/70" },
];

function ContactForm({ id }) {
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", message: "", move_in_date: "" });

  const sendInquiry = useMutation({
    mutationFn: (data) => base44.entities.Inquiry.create({ ...data, property_id: id }),
    onSuccess: () => {
      toast.success("¡Solicitud enviada! Nuestro equipo te contactará pronto.");
      setInquiry({ name: "", email: "", phone: "", message: "", move_in_date: "" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!inquiry.name || !inquiry.email || !inquiry.message) {
          toast.error("Completa nombre, email y mensaje");
          return;
        }
        sendInquiry.mutate(inquiry);
      }}
      className="space-y-3"
    >
      <Input placeholder="Tu nombre *" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className="h-11 rounded-xl border-border/60 bg-white" />
      <Input type="email" placeholder="Tu email *" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} className="h-11 rounded-xl border-border/60 bg-white" />
      <Input type="tel" placeholder="Teléfono (opcional)" value={inquiry.phone} onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })} className="h-11 rounded-xl border-border/60 bg-white" />
      <Textarea placeholder="¿Cuándo quieres visitar? ¿Alguna pregunta? *" value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} rows={3} className="rounded-xl border-border/60 bg-white resize-none" />
      <button type="submit" disabled={sendInquiry.isPending} className="w-full h-12 rounded-xl gradient-cta btn-glow text-white font-bold text-sm hover:opacity-95 transition-opacity disabled:opacity-60">
        {sendInquiry.isPending ? "Enviando..." : "Solicitar visita"}
      </button>
    </form>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const list = await base44.entities.Property.filter({ id });
      return list[0];
    },
  });

  useEffect(() => {
    if (property) setLiked(isInShortlist(property.id));
  }, [property]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado");
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/propiedad/${id}` } });
      return;
    }
    if (property) setLiked(toggleShortlist(property.id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[55vh] shimmer" />
        <div className="max-w-6xl mx-auto px-5 py-8 space-y-4">
          <div className="h-8 shimmer rounded-xl w-2/3" />
          <div className="h-5 shimmer rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="aspect-square shimmer rounded-2xl" />)}</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-28 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-extrabold mb-4">Propiedad no encontrada</h2>
        <Link to="/explorar" className="inline-flex items-center gap-2 gradient-cta text-white font-bold px-6 py-3 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Volver a explorar
        </Link>
      </div>
    );
  }

  const images = getPropertyImages(property);

  const specs = [
    { icon: Bed, label: "Habitaciones", value: property.bedrooms },
    { icon: Bath, label: "Baños", value: property.bathrooms },
    property.area_sqm && { icon: Maximize, label: "Área", value: `${property.area_sqm} m²` },
    property.floor && { icon: Layers, label: "Piso", value: property.floor },
    property.parking != null && { icon: Car, label: "Parqueaderos", value: getParkingSpots(property) > 0 ? getParkingSpots(property) : "No" },
    property.pets_allowed != null && { icon: PawPrint, label: "Mascotas", value: property.pets_allowed ? "Sí" : "No" },
    property.estrato && { icon: Building, label: "Estrato", value: property.estrato },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-12">
      {/* Floating top bar */}
      <div className="fixed top-[61px] left-0 right-0 z-40 px-4 py-3 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link to="/explorar" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/60 text-sm font-bold text-foreground hover:bg-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleShare} className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/60 flex items-center justify-center hover:bg-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleLike} className={cn("w-10 h-10 rounded-xl shadow-lg border flex items-center justify-center transition-all", liked ? "bg-primary border-primary text-white" : "bg-white/90 backdrop-blur-md border-white/60 hover:bg-white")}>
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>

      {/* Immersive gallery — full bleed */}
      <div className="relative -mt-0">
        <PropertyGallery images={images} title={property.title} immersive />
      </div>

      {/* Title band */}
      <div className="relative -mt-2 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl shadow-black/8 border border-border/40 p-6 sm:p-8 -mt-8 sm:-mt-12 relative"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <VerifiedBadge size="sm" />
              <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-3 py-1.5 rounded-full border border-brand-violet/20">
                Disponible
              </span>
              <span className="text-xs font-bold text-white gradient-cta px-3 py-1.5 rounded-full">
                {typeLabel[property.property_type]}
              </span>
              {property.furnished && (
                <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                  {furnishedLabels[property.furnished]}
                </span>
              )}
              <span className="text-xs font-bold text-brand-violet bg-brand-violet/10 px-3 py-1.5 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" />
                {images.length} fotos
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight mb-3">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">{property.neighborhood}</span>
              <span>·</span>
              <span>{property.city || property.locality}</span>
              {property.address && <><span className="hidden sm:inline">·</span><span className="hidden sm:inline text-muted-foreground/80">{property.address}</span></>}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 pt-5 border-t border-border/50">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground">{formatCOP(property.monthly_rent)}</p>
                <p className="text-sm text-muted-foreground font-medium">/mes {property.admin_fee > 0 && `+ ${formatCOP(property.admin_fee)} admin`}</p>
              </div>
              <button type="button" onClick={() => setShowContact(true)} className="hidden lg:flex items-center gap-2 gradient-cta btn-glow text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-opacity">
                <Sparkles className="w-4 h-4" />
                Quiero visitarlo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          <div className="space-y-8">
            {/* Specs grid */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Lo esencial</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s, i) => {
                  const c = SPEC_COLORS[i % SPEC_COLORS.length];
                  return (
                    <div key={s.label} className={cn("flex items-center gap-3 p-4 rounded-2xl", c.bg)}>
                      <s.icon className={cn("w-5 h-5 shrink-0", c.icon)} />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{s.label}</p>
                        <p className="font-extrabold text-foreground">{s.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Photo tour */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold">Tour fotográfico</h2>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{images.length} espacios</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={cn("relative rounded-2xl overflow-hidden group", i === 0 && "sm:col-span-2 sm:aspect-[21/9] aspect-[4/3]", i !== 0 && "aspect-[4/3]")}
                  >
                    <SmartImage src={img} alt={ROOM_LABELS[i] || `Foto ${i + 1}`} className="absolute inset-0" imgClassName="group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
                      {ROOM_LABELS[i] || `Espacio ${i + 1}`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {property.description && (
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm">
                <h2 className="text-xl font-extrabold mb-4">Sobre este inmueble</h2>
                <p className="text-muted-foreground leading-relaxed text-[0.95rem]">{property.description}</p>
              </section>
            )}

            <PropertyLocationMap property={property} />

            {property.amenities?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm">
                <h2 className="text-xl font-extrabold mb-5">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border/50 text-sm font-semibold text-foreground/80">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Cost breakdown */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-border/40 shadow-sm">
              <h2 className="text-xl font-extrabold mb-5">Desglose de costos</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Arriendo mensual</span>
                  <span className="font-bold">{formatCOP(property.monthly_rent)}</span>
                </div>
                {property.admin_fee > 0 && (
                  <div className="flex justify-between text-sm py-2 border-b border-border/40">
                    <span className="text-muted-foreground">Administración</span>
                    <span className="font-bold">{formatCOP(property.admin_fee)}</span>
                  </div>
                )}
                {property.deposit > 0 && (
                  <div className="flex justify-between text-sm py-2 border-b border-border/40">
                    <span className="text-muted-foreground">Depósito (una vez)</span>
                    <span className="font-bold">{formatCOP(property.deposit)}</span>
                  </div>
                )}
                {property.available_from && (
                  <div className="flex items-center gap-3 pt-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Disponible desde</span>
                    <span className="font-bold ml-auto">{new Date(property.available_from).toLocaleDateString("es-CO", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sticky contact — desktop */}
          <div className="hidden lg:block">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sticky top-32 space-y-3">
              <div className="bg-white rounded-3xl border border-border/40 shadow-xl overflow-hidden">
                <div className="gradient-cta p-5 text-white">
                  <p className="text-3xl font-extrabold">{formatCOP(property.monthly_rent)}<span className="text-sm font-medium opacity-80">/mes</span></p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">M</div>
                    <div>
                      <p className="font-bold text-sm">{BRAND.contactRole}</p>
                      <p className="text-white/70 text-xs">{BRAND.contactTagline}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Agenda tu visita</p>
                  <ContactForm id={id} />
                </div>
              </div>

              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=Hola! Me interesa este inmueble: ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20c15e] text-white text-sm font-bold transition-colors shadow-lg"
              >
                WhatsApp con {BRAND.short}
              </a>

              <div className="bg-white rounded-2xl border border-border/40 p-4 space-y-2.5">
                {["Gestión completa", "Respuesta en 24h", "Inmueble verificado"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <SimilarProperties property={property} />
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-lg text-foreground truncate">{formatCOP(property.monthly_rent)}<span className="text-xs text-muted-foreground font-medium">/mes</span></p>
            <p className="text-xs text-muted-foreground truncate">{property.neighborhood}, {property.city}</p>
          </div>
          <button type="button" onClick={() => setShowContact(true)} className="gradient-cta text-white font-bold px-5 py-3.5 rounded-xl shrink-0">
            Visitar
          </button>
          <a href={`tel:${BRAND.phone}`} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </a>
        </div>
      </div>

      {/* Mobile contact sheet */}
      {showContact && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/50 flex items-end" onClick={() => setShowContact(false)}>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-6" />
            <h3 className="text-xl font-extrabold mb-1">Agenda tu visita</h3>
            <p className="text-sm text-muted-foreground mb-5">{property.title}</p>
            <ContactForm id={id} />
            <a href={`https://wa.me/${BRAND.whatsapp}?text=Hola! Me interesa este inmueble: ${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#25D366] text-white font-bold text-sm">
              WhatsApp con {BRAND.short}
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
}
