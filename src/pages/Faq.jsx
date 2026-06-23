import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";
import { HOME_SEO_SECTIONS } from "@/lib/homeSeoCopy";
import { ARRIENDOS_BOGOTA_PATH, EXPLORE_COMPRA_PATH, exploreTypePath } from "@/lib/explorePaths";

function FaqAnswer({ text }) {
  if (!text.startsWith("¿")) {
    return <p>{text}</p>;
  }
  const split = text.indexOf("? ");
  if (split === -1) return <p>{text}</p>;
  const question = text.slice(0, split + 1);
  const answer = text.slice(split + 2);
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 px-4 py-3.5">
      <h3 className="text-sm font-bold text-foreground mb-1.5">{question}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  );
}

export default function Faq() {
  return (
    <div className="bg-background min-h-full">
      <div className="site-container section-pad max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-violet mb-3">Ayuda</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Preguntas frecuentes sobre arriendos en Bogotá
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Todo lo que necesitas saber sobre arriendos verificados, alquiler de apartamentos y cómo funciona{" "}
          {BRAND.name} en Bogotá.{" "}
          <Link to="/explorar" className="text-brand-violet font-medium hover:underline">
            Explorar inmuebles
          </Link>
          ,{" "}
          <Link to={exploreTypePath("apartamento")} className="text-brand-violet font-medium hover:underline">
            ver apartamentos
          </Link>
          ,{" "}
          <Link to={ARRIENDOS_BOGOTA_PATH} className="text-brand-violet font-medium hover:underline">
            guía de arriendos
          </Link>{" "}
          o{" "}
          <Link to={EXPLORE_COMPRA_PATH} className="text-brand-violet font-medium hover:underline">
            opciones en compra
          </Link>
          .
        </p>

        <div className="space-y-10">
          {HOME_SEO_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`faq-${section.id}`}>
              <h2 id={`faq-${section.id}`} className="text-lg font-bold text-foreground tracking-tight mb-4">
                {section.title}
              </h2>
              <div
                className={
                  section.id === "preguntas-frecuentes"
                    ? "space-y-3"
                    : "space-y-3 text-sm text-muted-foreground leading-relaxed"
                }
              >
                {section.paragraphs.map((paragraph) =>
                  section.id === "preguntas-frecuentes" ? (
                    <FaqAnswer key={paragraph.slice(0, 48)} text={paragraph} />
                  ) : (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          ¿Tienes otra duda?{" "}
          <a href={`mailto:${BRAND.email}`} className="font-semibold text-brand-violet hover:underline">
            Escríbenos
          </a>
          {" · "}
          <Link to="/" className="font-semibold text-brand-violet hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
