import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import {
  INVENTORY_KINDS,
  buildEmptyInventory,
  buildInventoryRooms,
} from "@/lib/ownerInventory";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

function PhotoThumb({ photo, onRemove }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-secondary/30 aspect-[4/3]">
      <img src={photo.url} alt={photo.caption || "Foto inventario"} className="w-full h-full object-cover" />
      {photo.caption && (
        <p className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-[10px] px-2 py-1 truncate">
          {photo.caption}
        </p>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Quitar foto"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function OwnerInventoryEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNew = !id || id === "nuevo";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [draft, setDraft] = useState(null);
  const [propertyId, setPropertyId] = useState(searchParams.get("propiedad") || "");
  const [kind, setKind] = useState(searchParams.get("tipo") || "entrega");
  const [uploadingRoom, setUploadingRoom] = useState(null);

  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: () => api.entities.Property.filter({}, "-created_date", 200),
  });

  const mine = useMemo(
    () => properties.filter((p) => p.owner_user_id === user?.id),
    [properties, user?.id]
  );

  const { data: existing, isLoading } = useQuery({
    queryKey: ["owner-inventory", id],
    queryFn: () => api.entities.PropertyInventory.get(id),
    enabled: !isNew,
  });

  useEffect(() => {
    if (!isNew && existing) {
      setDraft(existing);
      setPropertyId(existing.property_id);
      setKind(existing.kind);
    }
  }, [isNew, existing]);

  useEffect(() => {
    if (!isNew || !draft || !propertyId) return;
    const property = mine.find((p) => p.id === propertyId);
    if (!property) return;
    const kindLabel = INVENTORY_KINDS.find((k) => k.id === kind)?.label || "Inventario";
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            kind,
            property_id: propertyId,
            title: `${kindLabel} — ${property.title}`,
          }
        : prev
    );
  }, [kind, isNew, propertyId, mine]);

  useEffect(() => {
    if (!isNew || draft || !mine.length) return;
    const property = mine.find((p) => p.id === propertyId) || mine[0];
    if (!property) return;
    if (!propertyId) setPropertyId(property.id);
    setDraft(
      buildEmptyInventory({
        propertyId: property.id,
        ownerUserId: user?.id,
        kind,
        propertyTitle: property.title,
      })
    );
  }, [isNew, draft, propertyId, kind, mine, user?.id]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isNew) {
        return api.entities.PropertyInventory.create({
          ...payload,
          owner_user_id: user?.id,
        });
      }
      return api.entities.PropertyInventory.update(id, payload);
    },
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["owner-inventories"] });
      toast.success(isNew ? "Inventario creado" : "Inventario guardado");
      if (isNew) navigate(`/propietario/inventario/${row.id}`, { replace: true });
    },
    onError: (err) => toast.error(err.message || "No se pudo guardar"),
  });

  const updateRoom = (roomId, patch) => {
    setDraft((prev) => ({
      ...prev,
      rooms: (prev.rooms || []).map((room) => (room.id === roomId ? { ...room, ...patch } : room)),
    }));
  };

  const addRoom = () => {
    const name = window.prompt("Nombre del espacio (ej. Baño auxiliar)");
    if (!name?.trim()) return;
    setDraft((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), ...buildInventoryRooms([name.trim()])],
    }));
  };

  const removeRoom = (roomId) => {
    setDraft((prev) => ({
      ...prev,
      rooms: (prev.rooms || []).filter((room) => room.id !== roomId),
    }));
  };

  const uploadPhotos = async (roomId, files) => {
    if (!files?.length) return;
    setUploadingRoom(roomId);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const { file_url } = await api.integrations.Core.UploadFile({ file });
        uploaded.push({
          url: file_url,
          caption: file.name.replace(/\.[^.]+$/, ""),
          created_at: new Date().toISOString(),
        });
      }
      setDraft((prev) => ({
        ...prev,
        rooms: (prev.rooms || []).map((room) =>
          room.id === roomId ? { ...room, photos: [...(room.photos || []), ...uploaded] } : room
        ),
      }));
      toast.success(`${uploaded.length} foto${uploaded.length > 1 ? "s" : ""} agregada${uploaded.length > 1 ? "s" : ""}`);
    } catch (err) {
      toast.error(err.message || "Error al subir foto");
    } finally {
      setUploadingRoom(null);
    }
  };

  const handleSave = (status = "borrador") => {
    if (!draft) return;
    if (!propertyId) {
      toast.error("Selecciona un inmueble");
      return;
    }
    const property = mine.find((p) => p.id === propertyId);
    saveMutation.mutate({
      ...draft,
      property_id: propertyId,
      owner_user_id: user?.id,
      kind,
      title:
        draft.title ||
        `${INVENTORY_KINDS.find((k) => k.id === kind)?.label || "Inventario"} — ${property?.title || ""}`,
      status,
    });
  };

  if (!isNew && isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-brand-magenta border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!draft && isNew && mine.length === 0) {
    return (
      <div className="space-y-4">
        <Link to="/propietario/inventario" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <p className="text-sm text-muted-foreground">No tienes inmuebles asignados para crear un inventario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to="/propietario/inventario"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Inventarios
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSave("borrador")}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold bg-white hover:bg-secondary/50"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => handleSave("completado")}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-magenta text-white px-4 py-2 text-sm font-bold"
          >
            <Check className="w-4 h-4" /> Marcar completado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/40 p-5 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold">{isNew ? "Nuevo inventario" : "Editar inventario"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Toma fotos de cada espacio y deja notas claras del estado del inmueble.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inmueble</span>
            <select
              value={propertyId}
              disabled={!isNew}
              onChange={(e) => {
                const nextId = e.target.value;
                setPropertyId(nextId);
                const property = mine.find((p) => p.id === nextId);
                if (property && draft) {
                  setDraft((prev) => ({
                    ...prev,
                    property_id: nextId,
                    title: `${INVENTORY_KINDS.find((k) => k.id === kind)?.label} — ${property.title}`,
                  }));
                }
              }}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-white"
            >
              <option value="">Seleccionar…</option>
              {mine.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-white"
            >
              {INVENTORY_KINDS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notas generales</span>
          <textarea
            value={draft?.general_notes || ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, general_notes: e.target.value }))}
            rows={3}
            placeholder="Ej. Entrega con pintura reciente, electrodomésticos nuevos, llaves y controles entregados…"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm resize-y min-h-[88px]"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-extrabold">Espacios y fotos</h3>
          <button
            type="button"
            onClick={addRoom}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar espacio
          </button>
        </div>

        {(draft?.rooms || []).map((room) => (
          <section key={room.id} className="bg-white rounded-2xl border border-border/40 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <input
                value={room.name}
                onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                className="font-extrabold text-base bg-transparent border-b border-transparent focus:border-brand-violet outline-none flex-1"
              />
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                className="text-muted-foreground hover:text-red-600 p-1"
                aria-label="Eliminar espacio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={room.notes || ""}
              onChange={(e) => updateRoom(room.id, { notes: e.target.value })}
              rows={2}
              placeholder="Estado de paredes, pisos, grifería, muebles, daños previos, etc."
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm resize-y"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(room.photos || []).map((photo, index) => (
                <PhotoThumb
                  key={`${photo.url}-${index}`}
                  photo={photo}
                  onRemove={() =>
                    updateRoom(room.id, {
                      photos: room.photos.filter((_, i) => i !== index),
                    })
                  }
                />
              ))}

              <label
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 aspect-[4/3] cursor-pointer hover:border-brand-magenta/40 hover:bg-brand-magenta/5 transition-colors",
                  uploadingRoom === room.id && "opacity-60 pointer-events-none"
                )}
              >
                {uploadingRoom === room.id ? (
                  <Loader2 className="w-6 h-6 animate-spin text-brand-magenta" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-brand-magenta" />
                    <span className="text-[11px] font-bold text-muted-foreground text-center px-2">
                      Tomar o subir foto
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    uploadPhotos(room.id, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-violet/15 bg-brand-violet/5 p-4 text-sm text-muted-foreground flex gap-3">
        <ImagePlus className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
        <p>
          Usa la cámara del celular para documentar cada habitación. Las fotos y notas quedan guardadas en tu panel
          para respaldar entregas y recepciones del inmueble.
        </p>
      </div>
    </div>
  );
}
