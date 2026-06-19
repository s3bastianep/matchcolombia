import { useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { PROPERTY_LIST_QUERY } from "@/lib/queryOptions";
import { ArrowRight } from "lucide-react";

/**
 * URL canónica SEO (/propiedad/:id). Abre el panel del inmueble en la app
 * y muestra contenido legible mientras carga (útil también tras hidratación).
 */
export default function PropertyLanding() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { openProperty } = usePropertyPanel();
  const visita = searchParams.get("visita") === "1";

  const { data: property, isLoading } = useQuery({
    queryKey: ["property-landing", id],
    queryFn: () => api.entities.Property.get(id),
    enabled: !!id,
    ...PROPERTY_LIST_QUERY,
  });

  useEffect(() => {
    if (!property) return;
    openProperty(property, { focusBooking: visita });
  }, [property, visita, openProperty]);

  const formatCop = (value) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16">
        <div className="h-8 w-2/3 rounded-lg shimmer mb-4" />
        <div className="h-4 w-1/2 rounded shimmer mb-8" />
        <div className="h-24 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <h1 className="text-xl font-extrabold mb-2">Inmueble no encontrado</h1>
        <p className="text-muted-foreground text-sm mb-6">Este anuncio ya no está disponible o el enlace expiró.</p>
        <Link to="/explorar" className="app-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
          Explorar inmuebles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const price = formatCop(property.monthly_rent || property.sale_price);

  return (
    <article className="max-w-2xl mx-auto px-5 py-10 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-2">Inmueble verificado</p>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{property.title}</h1>
      <p className="text-muted-foreground mt-2">
        {property.city}
        {property.locality ? ` · ${property.locality}` : ""}
      </p>
      <p className="text-xl font-extrabold mt-4 tabular-nums">
        {price}
        {property.monthly_rent ? <span className="text-base font-semibold text-muted-foreground"> / mes</span> : null}
      </p>
      <ul className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
        {property.bedrooms != null && <li>{property.bedrooms} hab.</li>}
        {property.bathrooms != null && <li>{property.bathrooms} baños</li>}
        {property.area_sqm && <li>{property.area_sqm} m²</li>}
      </ul>
      {property.description && (
        <p className="mt-6 text-sm leading-relaxed text-foreground/85">{property.description}</p>
      )}
      <p className="mt-8 text-sm text-muted-foreground">Abriendo la ficha interactiva…</p>
    </article>
  );
}
