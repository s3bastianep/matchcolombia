import React from "react";
import { BRAND } from "@/lib/brand";

export default function AboutFounderSection() {
  return (
    <section className="py-10 sm:py-14 bg-[hsl(0,0%,98%)] border-y border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center">
          <div className="relative max-w-sm mx-auto lg:mx-0 w-full">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border/40 shadow-lg bg-muted">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop"
                alt="Fundador de MatchColombia"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>
          <div className="border-l-4 border-brand-magenta pl-4 sm:pl-5">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-magenta mb-2">
              ¿Quiénes somos?
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Personas detrás de {BRAND.name}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {BRAND.name} nació porque la administración inmobiliaria sigue operando de forma manual y poco transparente.
              Estamos construyendo una experiencia donde propietarios e inquilinos tienen visibilidad total de sus procesos.
            </p>
            <p className="mt-4 text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              No vendemos software. Vendemos tranquilidad: que recibas tu dinero sin preocupaciones y que el inquilino
              tenga un canal claro para pagar, reportar y renovar.
            </p>
            <p className="mt-6 text-sm font-bold text-foreground">Sebastian · Fundador</p>
            <p className="text-xs text-muted-foreground">Bogotá, Colombia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
