import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  ARRIENDOS_BOGOTA_SECTIONS,
  arriendosBogotaLinkGrid,
} from "@/lib/arriendosBogotaCopy";
import { BRAND } from "@/lib/brand";

export default function ArriendosBogota() {
  const { types, zones, compra } = arriendosBogotaLinkGrid();

  return (
    <div className="bg-background min-h-full">
      <div className="site-container section-pad max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-3">
          Arriendos en Bogotá
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Arriendos en Bogotá: apartamentos, casas y alquiler verificado
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Encuentra apartamento en Bogotá, alquiler de apartamento verificado y casas en arriendo con{" "}
          {BRAND.name}. Alternativa clara a inmobiliarias en Bogotá: listados revisados, visitas
          coordinadas y Match inteligente.
        </p>

        <Link
          to="/explorar"
          className="inline-flex items-center gap-2 gradient-cta text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity mb-10"
        >
          Explorar arriendos en Bogotá
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>

        <div className="space-y-10">
          {ARRIENDOS_BOGOTA_SECTIONS.map((section) => (
            <article key={section.id} id={section.id}>
              <h2 className="text-lg font-bold text-foreground tracking-tight mb-3">{section.title}</h2>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              {section.cta && (
                <Link
                  to={section.cta.to}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-brand-violet hover:underline"
                >
                  {section.cta.label}
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
            </article>
          ))}
        </div>

        <section className="mt-12 pt-8 border-t border-border/50" aria-labelledby="tipos-inmueble">
          <h2 id="tipos-inmueble" className="text-base font-bold text-foreground mb-3">
            Buscar por tipo de inmueble
          </h2>
          <div className="flex flex-wrap gap-2">
            {types.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3.5 py-2 rounded-full text-xs font-bold border border-border/60 bg-white text-foreground/80 hover:border-brand-violet/35 hover:text-brand-violet transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={compra.to}
              className="px-3.5 py-2 rounded-full text-xs font-bold border border-border/60 bg-white text-foreground/80 hover:border-brand-violet/35 hover:text-brand-violet transition-colors"
            >
              {compra.label}
            </Link>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="barrios-arriendo">
          <h2 id="barrios-arriendo" className="text-base font-bold text-foreground mb-3">
            Arriendo por barrio en Bogotá
          </h2>
          <div className="flex flex-wrap gap-2">
            {zones.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3.5 py-2 rounded-full text-xs font-bold border border-border/60 bg-white text-foreground/80 hover:border-brand-violet/35 hover:text-brand-violet transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-muted-foreground">
          <Link to="/" className="font-semibold text-brand-violet hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
