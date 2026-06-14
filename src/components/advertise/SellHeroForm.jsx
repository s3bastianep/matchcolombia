import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { CITIES } from "@/lib/colombia";

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "estudio", label: "Estudio" },
  { value: "local", label: "Local comercial" },
  { value: "lote", label: "Lote" },
];

export default function SellHeroForm({ className, dark = true }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", city: "Bogotá", propertyType: "apartamento" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.name) params.set("name", form.name);
    if (form.phone) params.set("phone", form.phone);
    if (form.city) params.set("city", form.city);
    if (form.propertyType) params.set("propertyType", form.propertyType);
    params.set("operation", "venta");
    navigate(`/publicar/nuevo${params.toString() ? `?${params}` : ""}`);
  };

  const inputClass = cn(
    "w-full px-3 py-2.5 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-magenta/30",
    dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : "bg-white border-border/50"
  );

  const labelClass = cn("text-[10px] font-bold uppercase tracking-wider mb-1 block", dark ? "text-white/60" : "text-muted-foreground");

  return (
    <form onSubmit={handleSubmit} className={cn("rounded-2xl border p-5 sm:p-6", dark ? "bg-white/5 border-white/15 backdrop-blur-sm" : "bg-white border-border/40 shadow-lg", className)}>
      <h3 className={cn("font-extrabold text-base sm:text-lg mb-1", dark ? "text-white" : "text-foreground")}>
        Publica tu inmueble gratis
      </h3>
      <p className={cn("text-xs mb-4", dark ? "text-white/60" : "text-muted-foreground")}>
        Bogotá y Barranquilla
      </p>
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Nombre</label>
          <div className="relative">
            <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", dark ? "text-white/50" : "text-brand-violet")} />
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={cn(inputClass, "pl-9")} placeholder="Tu nombre" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <div className="relative">
            <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", dark ? "text-white/50" : "text-brand-magenta")} />
            <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={cn(inputClass, "pl-9")} placeholder="+57 300 000 0000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Ciudad</label>
            <select value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputClass}>
              {CITIES.map((c) => (
                <option key={c.id} value={c.name} className="text-foreground">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tipo de inmueble</label>
            <select value={form.propertyType} onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))} className={inputClass}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="text-foreground">{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="w-full gradient-cta text-white font-bold py-3 rounded-xl hover:opacity-95 transition-opacity text-sm shadow-lg">
          Quiero vender con {BRAND.name}
        </button>
      </div>
    </form>
  );
}
