import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Shield, Zap, MessageCircleOff, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const VALUE_PILLARS = [
  { icon: Shield, label: "Verificación documental", desc: "Inmuebles y candidatos revisados antes de publicar." },
  { icon: MessageCircleOff, label: "Sin llamadas ni correos", desc: "Seguimiento centralizado, sin exponer tu teléfono." },
  { icon: Zap, label: "Seguimiento digital", desc: "Pagos, contratos y tickets en un solo lugar." },
];

const FAQ_ITEMS = [
  {
    q: "¿Por qué arrendar con MatchColombia y no por mi cuenta?",
    tag: "Propuesta de valor",
    a: `${BRAND.name} no es solo un portal de anuncios. Es administración completa: filtramos interesados, coordinamos visitas, evaluamos candidatos y te damos seguimiento digital sin que expongas tu número.`,
    points: [
      "Publicación premium con fotos y verificación documental",
      "Equipo real en Bogotá y Barranquilla, no un bot",
      "Panel con pagos, contratos, tickets y estado del inmueble",
    ],
  },
  {
    q: "¿Tengo que hablar con los interesados?",
    tag: "Sin estrés",
    a: "No. Nosotros respondemos consultas, aclaramos dudas, agendamos visitas y te enviamos resúmenes claros. Tú solo decides cuando hay un candidato serio.",
    points: [
      "Sin exponer tu WhatsApp ni recibir 50 mensajes al día",
      "Solo te contactamos cuando hay avance real",
      "Todo queda registrado en tu panel propietario",
    ],
  },
  {
    q: "¿Cuánto cuesta publicar y qué incluye?",
    tag: "Gratis para empezar",
    a: "Publicar tu inmueble es gratis en Bogotá y Barranquilla. La administración incluye publicación premium, gestión de visitas, estudio de arrendatarios, contratos digitales, cobro de cánones y mantenimiento.",
    points: [
      "Sin costo de publicación inicial",
      "Honorarios de gestión te los explicamos con transparencia",
      "Incluye fotografías profesionales y verificación documental",
    ],
  },
  {
    q: "¿Cómo funciona la gestión de visitas?",
    tag: "Visitas coordinadas",
    a: "Filtramos a quienes realmente encajan con tu inmueble, proponemos horarios, confirmamos asistencia y te avisamos. Presencial o virtual, siempre con seguimiento.",
    points: [
      "Solo visitas con interesados pre-calificados",
      "Confirmación y recordatorios automáticos",
      "Tú no coordinas horarios ni persigues a nadie",
    ],
  },
  {
    q: "¿Cómo elijo al arrendatario?",
    tag: "Decisión informada",
    a: "Cuando un candidato pasa nuestro estudio (documentos, referencias e ingresos), te enviamos su perfil completo. Tú apruebas o rechazas. Nosotros seguimos el proceso hasta la firma.",
    points: [
      "Evaluación documental antes de presentarte candidatos",
      "Tú tienes la última palabra en la decisión",
      "Contrato digital y cobro de cánones incluidos",
    ],
  },
  {
    q: "¿Qué significa gestión exclusiva?",
    tag: "Un solo equipo",
    a: "Significa que MatchColombia es tu único intermediario en el proceso. Centralizamos consultas, visitas, aplicaciones y seguimiento para que no tengas que repartir información entre varios canales.",
    points: [
      "Un flujo claro de principio a fin",
      "Contratos digitales y cobro de cánones centralizado",
      "Tickets de mantenimiento con trazabilidad",
    ],
  },
  {
    q: "¿En qué ciudades operan?",
    tag: "Cobertura",
    a: "Hoy operamos en Bogotá y Barranquilla, con cobertura en las principales zonas de arriendo. Si tu inmueble está en otra ciudad, contáctanos y te orientamos sobre disponibilidad.",
    points: [
      "Bogotá: Chapinero, Usaquén, Suba, Cedritos y más",
      "Barranquilla: Riomar, Alto Prado, Villa Carolina y más",
      "Expansión a nuevas ciudades en camino",
    ],
  },
];

function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("border-b border-border/30 last:border-0", isOpen && "bg-brand-violet/[0.03]")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-start justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
            >
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-1.5">
                  {item.tag}
                </span>
                <span className="block font-bold text-sm sm:text-base text-foreground leading-snug">{item.q}</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200",
                  isOpen && "rotate-180 text-brand-violet"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  {item.points?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-brand-violet shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-foreground/85 font-medium">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OwnerFaqSection({ publishLink = "/publicar/nuevo" }) {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[hsl(0,0%,98%)] border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.15fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-2">
                Propuesta de valor
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Preguntas frecuentes
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                Lo que nos diferencia de publicar solo en un portal: gestión real, candidatos filtrados y seguimiento digital.
              </p>
            </div>

            <div className="space-y-3">
              {VALUE_PILLARS.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex gap-3.5 p-4 rounded-xl bg-white border border-border/40"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-violet/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-violet" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl color-bar p-5 sm:p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Lo que sí puedes verificar</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  "Seguimiento digital",
                  "Contratos digitales",
                  "Verificación documental",
                  "Atención centralizada",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/90" strokeWidth={2.5} />
                    <p className="text-[11px] sm:text-xs font-semibold leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={publishLink}
              className="inline-flex items-center gap-2 gradient-cta text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md hover:opacity-95 transition-opacity"
            >
              Publicar mi inmueble
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
