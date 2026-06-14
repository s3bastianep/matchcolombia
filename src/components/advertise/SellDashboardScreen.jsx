import React from "react";
import { cn } from "@/lib/utils";

function Field({ label, value, valueClass }) {
  return (
    <div>
      <p className="text-[14px] text-[hsl(0,0%,40%)]">{label}:</p>
      <p className={cn("text-[15px] sm:text-[16px] font-semibold text-[hsl(0,0%,8%)] mt-0.5 tabular-nums leading-snug", valueClass)}>
        {value}
      </p>
    </div>
  );
}

export default function SellDashboardScreen({ className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-lg border border-[hsl(0,0%,88%)] bg-[hsl(0,0%,97%)] p-3 sm:p-4 max-w-sm mx-auto lg:max-w-[340px] lg:mx-0">
        <div className="rounded-md bg-white border border-[hsl(0,0%,90%)] px-4 py-5 sm:px-5 sm:py-6 font-[system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
          <p className="text-[16px] sm:text-[17px] font-bold text-[hsl(0,0%,8%)] leading-tight">Apartamento Quinta Camacho</p>
          <p className="text-[14px] text-[hsl(0,0%,42%)] mt-1">Chapinero · Bogotá</p>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5">
            <Field label="Visualizaciones" value="543" />
            <Field label="Interesados" value="17" />
            <Field label="Visitas agendadas" value="8" />
            <Field label="Ofertas recibidas" value="2" />
          </div>

          <div className="my-5 h-px bg-[hsl(0,0%,91%)]" />

          <Field label="Estado" value="Negociación activa" valueClass="text-[hsl(152,45%,32%)]" />
        </div>
      </div>
    </div>
  );
}
