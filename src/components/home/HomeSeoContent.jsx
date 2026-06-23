import React from "react";
import { Link } from "react-router-dom";
import { HOME_SEO_SECTIONS } from "@/lib/homeSeoCopy";
import { EXPLORE_COMPRA_PATH } from "@/lib/explorePaths";

export default function HomeSeoContent() {
  return (
    <section
      className="border-t border-border/50 bg-secondary/30"
      aria-label="Información sobre arriendos verificados en Bogotá"
    >
      <div className="site-container section-pad max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-violet mb-3">
          Arriendos verificados en Bogotá
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          El lugar que buscas existe y está aquí. En Habibar encontrarás apartamentos y casas verificados,
          con visitas coordinadas y Match inteligente según lo que buscas.{" "}
          <Link to="/explorar" className="text-brand-violet font-medium hover:underline">
            Explorar inmuebles
          </Link>{" "}
          o{" "}
          <Link to={EXPLORE_COMPRA_PATH} className="text-brand-violet font-medium hover:underline">
            ver opciones en compra
          </Link>
          .
        </p>

        <div className="space-y-8">
          {HOME_SEO_SECTIONS.map((section) => (
            <article key={section.id} id={section.id}>
              <h2 className="text-lg font-bold text-foreground tracking-tight mb-3">{section.title}</h2>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
