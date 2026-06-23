import React from "react";
import { Play, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPropertyVideos, parseVideoUrl } from "@/lib/propertyVideo";

function VideoPlayer({ url, title, compact = false }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.type === "file") {
    return (
      <video
        src={parsed.src}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-cover bg-black"
        title={title}
      />
    );
  }

  return (
    <iframe
      src={parsed.embedUrl}
      title={title}
      className="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}

export default function PropertyVideoSection({ property, compact = false, className }) {
  const videos = getPropertyVideos(property);
  const primary = videos[0];
  if (!primary) return null;

  const title = `Video de ${property.title}`;

  if (compact) {
    return (
      <section className={cn("px-4 py-5 border-t border-border/30", className)}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-xl bg-brand-violet/10 flex items-center justify-center">
            <Video className="w-4 h-4 text-brand-violet" strokeWidth={2} />
          </span>
          <h2 className="text-base font-bold tracking-tight">Video del inmueble</h2>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-border/30">
          <VideoPlayer url={primary} title={title} compact />
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Recorrido en video revisado por {property.city ? `el equipo en ${property.city}` : "nuestro equipo"}.
        </p>
      </section>
    );
  }

  return (
    <section className={cn("detail-section", className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-10 h-10 rounded-xl bg-brand-magenta/10 flex items-center justify-center">
          <Play className="w-4 h-4 text-brand-magenta ml-0.5" strokeWidth={2.25} fill="currentColor" />
        </span>
        <div>
          <h2 className="detail-section-title !mb-0">Video del inmueble</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Conoce el espacio antes de agendar tu visita
          </p>
        </div>
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-border/20">
        <VideoPlayer url={primary} title={title} />
      </div>
    </section>
  );
}
