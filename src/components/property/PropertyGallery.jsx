import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Grid3X3, Maximize2, Camera } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { ROOM_LABELS } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

function GalleryTile({ src, alt, onClick, className, showOverlay, index, lightboxOpen, activeIdx }) {
  const hideForTransition = lightboxOpen && index === activeIdx;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("relative overflow-hidden bg-muted group", className)}
    >
      {!hideForTransition && (
        <motion.div
          layoutId={`gallery-photo-${index}`}
          className="absolute inset-0"
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
        >
          <SmartImage
            src={src}
            alt={alt}
            className="absolute inset-0"
            imgClassName="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] property-photo-unify"
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      {showOverlay}
    </button>
  );
}

function RoomLabel({ index, compact = false }) {
  const label = ROOM_LABELS[index] || `Foto ${index + 1}`;
  return (
    <div
      className={cn(
        "absolute bottom-2 left-2 rounded-md bg-black/55 text-white font-semibold pointer-events-none z-[2]",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
      )}
    >
      {label}
    </div>
  );
}

function CarouselControls({ onPrev, onNext, show, size = "md" }) {
  if (!show) return null;
  const btn = size === "sm" ? "touch-target rounded-full" : "touch-target rounded-full";
  const icon = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10",
          btn,
          size === "sm" ? "left-2" : "left-3"
        )}
      >
        <ChevronLeft className={icon} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10",
          btn,
          size === "sm" ? "right-2" : "right-3"
        )}
      >
        <ChevronRight className={icon} />
      </button>
    </>
  );
}

function PhotoCounter({ current, total, className }) {
  return (
    <div className={cn("absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-semibold z-10", className)}>
      <Camera className="w-3.5 h-3.5" />
      {current}/{total}
    </div>
  );
}

export default function PropertyGallery({ images, title, immersive = false, variant }) {
  const galleryVariant = variant || (immersive ? "immersive" : "default");
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [gridView, setGridView] = useState(false);
  const [direction, setDirection] = useState(1);

  const go = useCallback((next) => {
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
  }, [idx]);

  const prev = useCallback(() => go(idx > 0 ? idx - 1 : images.length - 1), [go, idx, images.length]);
  const next = useCallback(() => go(idx < images.length - 1 ? idx + 1 : 0), [go, idx, images.length]);

  const openLightbox = useCallback((imageIdx) => {
    setIdx(imageIdx);
    setLightbox(true);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
  };

  if (galleryVariant === "modal" && images.length >= 1) {
    const [main, ...rest] = images;
    const side = rest.slice(0, 4);
    const hasGrid = images.length >= 2;

    return (
      <>
        <div className="relative w-full bg-[hsl(0,0%,96%)] border-b border-border/40">
          {hasGrid ? (
            <>
              <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-0.5 h-[min(34vh,340px)] min-h-[220px] sm:min-h-[280px] overflow-hidden">
                <GalleryTile
                  src={main}
                  alt={title}
                  index={0}
                  lightboxOpen={lightbox}
                  activeIdx={idx}
                  onClick={() => openLightbox(0)}
                  className="col-span-2 row-span-2"
                  showOverlay={<RoomLabel index={0} />}
                />
                {side.map((img, i) => (
                  <GalleryTile
                    key={i}
                    src={img}
                    alt=""
                    index={i + 1}
                    lightboxOpen={lightbox}
                    activeIdx={idx}
                    onClick={() => openLightbox(i + 1)}
                    className="min-h-0"
                    showOverlay={
                      <>
                        <RoomLabel index={i + 1} compact />
                        {i === 3 && images.length > 5 ? (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-[3]">
                            <span className="text-white font-bold text-sm">+{images.length - 5}</span>
                          </div>
                        ) : null}
                      </>
                    }
                  />
                ))}
              </div>

              <div className="sm:hidden">
                <div className="relative aspect-[4/3] max-h-[min(42dvh,360px)] min-h-[220px] bg-muted overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.button
                      key={idx}
                      type="button"
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="absolute inset-0"
                      onClick={() => openLightbox(idx)}
                    >
                      <SmartImage src={images[idx]} alt={title} className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
                      <RoomLabel index={idx} />
                    </motion.button>
                  </AnimatePresence>
                  <CarouselControls onPrev={prev} onNext={next} show={images.length > 1} size="sm" />
                  <PhotoCounter current={idx + 1} total={images.length} />
                </div>

                <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-none">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(i)}
                      className={cn(
                        "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200",
                        i === idx ? "border-brand-violet ring-2 ring-[hsl(var(--brand-violet)/0.25)]" : "border-white/80 opacity-80 hover:opacity-100"
                      )}
                    >
                      <SmartImage src={img} alt="" className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="relative block w-full aspect-[16/10] max-h-[300px] bg-muted overflow-hidden"
            >
              <SmartImage src={main} alt={title} className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
              <RoomLabel index={0} />
            </button>
          )}

          {hasGrid && (
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/95 shadow-lg border border-border/40 text-xs sm:text-sm font-semibold hover:bg-white transition-colors z-10"
            >
              <Grid3X3 className="w-4 h-4" />
              Ver las {images.length} fotos
            </button>
          )}
        </div>

        <Lightbox
          images={images}
          title={title}
          idx={idx}
          setIdx={go}
          lightbox={lightbox}
          setLightbox={setLightbox}
          gridView={gridView}
          setGridView={setGridView}
          prev={prev}
          next={next}
          direction={direction}
          variants={variants}
          elevated
        />
      </>
    );
  }

  if (galleryVariant === "immersive" && images.length >= 2) {
    const [main, ...rest] = images;
    const side = rest.slice(0, 4);

    return (
      <>
        <div className="relative w-full">
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-1 h-[min(56vh,520px)] rounded-2xl overflow-hidden bg-muted">
            <GalleryTile
              src={main}
              alt={title}
              index={0}
              lightboxOpen={lightbox}
              activeIdx={idx}
              onClick={() => openLightbox(0)}
              className="col-span-2 row-span-2"
            />
            {side.map((img, i) => (
              <GalleryTile
                key={i}
                src={img}
                alt=""
                index={i + 1}
                lightboxOpen={lightbox}
                activeIdx={idx}
                onClick={() => openLightbox(i + 1)}
                showOverlay={
                  i === 3 && images.length > 5 ? (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                      <span className="text-white font-semibold text-sm">+{images.length - 5} fotos</span>
                    </div>
                  ) : null
                }
              />
            ))}
          </div>

          <div className="md:hidden relative h-[50vh] min-h-[300px] rounded-2xl overflow-hidden bg-muted">
            <AnimatePresence custom={direction} mode="wait">
              <motion.button
                key={idx}
                type="button"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="absolute inset-0"
                onClick={() => openLightbox(idx)}
              >
                <SmartImage src={images[idx]} alt={title} className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
              </motion.button>
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              {idx + 1}/{images.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="hidden md:flex absolute bottom-4 right-4 items-center gap-2 px-4 py-2 rounded-xl bg-white/95 shadow-lg border border-border/40 text-sm font-semibold hover:bg-white transition-colors z-10"
          >
            <Grid3X3 className="w-4 h-4" />
            Ver las {images.length} fotos
          </button>
        </div>

        <Lightbox
          images={images}
          title={title}
          idx={idx}
          setIdx={go}
          lightbox={lightbox}
          setLightbox={setLightbox}
          gridView={gridView}
          setGridView={setGridView}
          prev={prev}
          next={next}
          direction={direction}
          variants={variants}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="relative w-full cursor-zoom-in bg-muted" style={{ height: "clamp(340px, 55vw, 600px)" }} onClick={() => openLightbox(idx)}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div key={idx} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }} className="absolute inset-0">
              <SmartImage src={images[idx]} alt={title} className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
            </motion.div>
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); openLightbox(idx); }} className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
            <Maximize2 className="w-3.5 h-3.5" />
            {images.length} fotos
          </button>
        </div>
      </div>
      <Lightbox images={images} title={title} idx={idx} setIdx={go} lightbox={lightbox} setLightbox={setLightbox} gridView={gridView} setGridView={setGridView} prev={prev} next={next} direction={direction} variants={variants} />
    </>
  );
}

function Lightbox({ images, title, idx, setIdx, lightbox, setLightbox, gridView, setGridView, prev, next, direction, variants, elevated = false }) {
  return (
    <AnimatePresence>
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className={cn("fixed inset-0 bg-black flex flex-col", elevated ? "z-[250]" : "z-[200]")}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10"
          >
            <div>
              <p className="text-white font-semibold text-sm truncate max-w-[60vw]">{title}</p>
              <p className="text-white/50 text-xs">{idx + 1} de {images.length} · {ROOM_LABELS[idx] || "Foto"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setGridView(!gridView)} className={cn("px-3 py-2 rounded-xl text-xs font-semibold transition-colors", gridView ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10")}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setLightbox(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {gridView ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto p-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-w-5xl mx-auto rounded-xl overflow-hidden">
                {images.map((img, i) => (
                  <button key={i} type="button" onClick={() => { setIdx(i); setGridView(false); }} className={cn("relative aspect-[4/3] overflow-hidden group bg-muted", i === idx && "ring-2 ring-primary ring-inset")}>
                    <SmartImage src={img} alt="" className="absolute inset-0" imgClassName="object-cover object-center property-photo-unify" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center relative px-14 min-h-0">
              <motion.div
                layoutId={`gallery-photo-${idx}`}
                className="max-w-full max-h-full flex items-center justify-center"
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <img src={images[idx]} alt="" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
              </motion.div>
              <button type="button" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-6 h-6 text-white" /></button>
              <button type="button" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-6 h-6 text-white" /></button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
