import { ArrowRight, Home, KeyRound } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { INTERIORS } from "@/lib/colombiaImages";

export const POPULAR_ZONES = [
  { label: "Chapinero", to: "/explorar?city=Bogotá&q=Chapinero" },
  { label: "Usaquén", to: "/explorar?city=Bogotá&q=Usaquén" },
  { label: "Suba", to: "/explorar?city=Bogotá&q=Suba" },
  { label: "La Candelaria", to: "/explorar?city=Bogotá&q=La Candelaria" },
];

export const EXPLORE_PATHS = [
  {
    to: "/explorar",
    title: "Arriendo",
    subtitle: "Apartamentos y casas verificados, con filtros claros y visitas coordinadas.",
    cta: "Explorar arriendos",
    icon: KeyRound,
    image: INTERIORS.sala2,
    accent: "from-brand-violet/90 via-brand-violet/55 to-brand-magenta/75",
    ring: "ring-brand-violet/25",
    iconBg: "bg-brand-violet/15 text-brand-violet",
  },
  {
    to: "/explorar?intent=compra",
    title: "Compra",
    subtitle: "Inmuebles en venta revisados por el equipo. Compara zonas y agenda visitas.",
    cta: "Explorar en venta",
    icon: Home,
    image: INTERIORS.casa,
    accent: "from-brand-magenta/90 via-brand-magenta/50 to-brand-violet/70",
    ring: "ring-brand-magenta/25",
    iconBg: "bg-brand-magenta/15 text-brand-magenta",
  },
];

export const MATCH_STEPS = [
  {
    num: "01",
    title: "Match inteligente",
    problem: "Sin perder horas en portales sin filtro.",
    desc: "Ciudad, presupuesto, habitaciones, baños, mascotas y más. Habibar filtra por ti.",
  },
  {
    num: "02",
    title: "Encuentra opciones",
    problem: "Sin anuncios dudosos ni precios inventados.",
    desc: "Solo ves inmuebles verificados por nuestro equipo que encajan con lo que buscas.",
    verified: true,
  },
  {
    num: "03",
    title: "Agenda tu visita",
    problem: "Sin perseguir dueños ni mensajes sueltos.",
    desc: `Reserva visita presencial o virtual. El equipo de ${BRAND.name} te acompaña.`,
  },
];
