import React, { useMemo, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { api } from "@/api/apiClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  MAINTENANCE_PROBLEM_TYPES,
  VISIT_TIME_SLOTS,
  minVisitDateInput,
} from "@/lib/maintenanceForm";

export default function MaintenanceRequestForm({ onSubmit, isSubmitting = false }) {
  const [problemType, setProblemType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTimeSlot, setVisitTimeSlot] = useState("flexible");
  const [visitNote, setVisitNote] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedType = useMemo(
    () => MAINTENANCE_PROBLEM_TYPES.find((t) => t.id === problemType),
    [problemType]
  );

  const pickProblem = (type) => {
    setProblemType(type.id);
    setTitle(type.title);
    setError("");
  };

  const handlePhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of files.slice(0, 4 - images.length)) {
        const { file_url } = await api.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      }
      setImages((prev) => [...prev, ...urls].slice(0, 4));
    } catch {
      setError("No pudimos subir una foto. Intenta de nuevo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (url) => setImages((prev) => prev.filter((item) => item !== url));

  const handleSubmit = () => {
    const finalTitle = title.trim() || selectedType?.title || "";
    if (!finalTitle) {
      setError("Elige qué está dañado o escribe un título.");
      return;
    }
    if (!description.trim()) {
      setError("Cuéntanos brevemente qué pasa.");
      return;
    }
    if (!visitDate) {
      setError("Indica qué día puedes recibir al técnico.");
      return;
    }

    onSubmit({
      title: finalTitle,
      description: description.trim(),
      problem_type: problemType || "otro",
      visit_date: visitDate,
      visit_time_slot: visitTimeSlot,
      visit_note: visitNote.trim(),
      images,
    });
  };

  const reset = () => {
    setProblemType("");
    setTitle("");
    setDescription("");
    setVisitDate("");
    setVisitTimeSlot("flexible");
    setVisitNote("");
    setImages([]);
    setError("");
  };

  return (
    <div className="bg-white rounded-2xl border border-border/40 p-5 space-y-5">
      <div>
        <h3 className="font-bold text-sm">Nueva solicitud</h3>
        <p className="text-xs text-muted-foreground mt-1">
          3 pasos: qué falla → fotos → día para la visita del técnico.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-foreground">1. ¿Qué está dañado?</p>
        <div className="flex flex-wrap gap-2">
          {MAINTENANCE_PROBLEM_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => pickProblem(type)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold border transition-colors",
                problemType === type.id
                  ? "border-brand-violet bg-brand-violet/10 text-brand-violet"
                  : "border-border/60 bg-white text-foreground/80 hover:border-brand-violet/30"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
        <Input
          placeholder="O escribe el problema con tus palabras"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />
        <Textarea
          placeholder="Ej: La llave no gira y hoy dejó de abrir la puerta principal."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-foreground">2. Adjunta fotos del daño</p>
        <p className="text-[11px] text-muted-foreground">Hasta 4 fotos. Ayudan al técnico a preparar la visita.</p>
        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/50">
              <img src={url} alt="Evidencia" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 size-6 rounded-full bg-black/55 text-white flex items-center justify-center"
                aria-label="Quitar foto"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-violet/40 hover:bg-brand-violet/[0.03] transition-colors">
              {uploading ? (
                <Loader2 className="size-5 text-brand-violet animate-spin" />
              ) : (
                <>
                  <Camera className="size-5 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground">Foto</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-foreground">3. ¿Cuándo puedes recibir al técnico?</p>
        <Input
          type="date"
          min={minVisitDateInput()}
          value={visitDate}
          onChange={(e) => {
            setVisitDate(e.target.value);
            setError("");
          }}
        />
        <div className="flex flex-wrap gap-2">
          {VISIT_TIME_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setVisitTimeSlot(slot.id)}
              className={cn(
                "px-3 py-2 rounded-xl text-left border min-w-[7rem]",
                visitTimeSlot === slot.id
                  ? "border-brand-violet bg-brand-violet/10"
                  : "border-border/60 hover:border-brand-violet/30"
              )}
            >
              <span className="block text-xs font-bold">{slot.label}</span>
              <span className="block text-[10px] text-muted-foreground">{slot.hint}</span>
            </button>
          ))}
        </div>
        <Input
          placeholder="Nota opcional: ej. solo después de las 3 p. m."
          value={visitNote}
          onChange={(e) => setVisitNote(e.target.value)}
        />
      </div>

      {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || uploading}
          className="gradient-cta text-white font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-60"
        >
          {isSubmitting ? "Enviando…" : "Enviar solicitud"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
