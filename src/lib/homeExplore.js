import { ArrowRight, Home, KeyRound } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { INTERIORS } from "@/lib/colombiaImages";
import { EXPLORE_COMPRA_PATH, exploreZonePath, exploreTypePath } from "@/lib/explorePaths";

export const POPULAR_ZONES = [
  { label: "Chapinero", to: exploreZonePath("Chapinero") },
  { label: "Usaquén", to: exploreZonePath("Usaquén") },
  { label: "Suba", to: exploreZonePath("Suba") },
  { label: "La Candelaria", to: exploreZonePath("La Candelaria") },
];

export const EXPLORE_PATHS = [
  {
    to: exploreTypePath("apartamento"),
    title: "Apartamentos",
    subtitle: "Alquiler de apartamento en Bogotá verificado, con filtros por barrio y visitas coordinadas.",
    cta: "Ver apartamentos",
    icon: KeyRound,
    image: INTERIORS.sala2,
    accent: "from-brand-violet/90 via-brand-violet/55 to-brand-magenta/75",
    ring: "ring-brand-violet/25",
    iconBg: "bg-brand-violet/15 text-brand-violet",
  },
  {
    to: EXPLORE_COMPRA_PATH,
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
