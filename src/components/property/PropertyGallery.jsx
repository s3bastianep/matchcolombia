import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Grid3X3, Maximize2, Camera } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { ROOM_LABELS } from "@/lib/colombiaImages";
import { cn } from "@/lib/utils";

export default function PropertyGallery({ images, title, immersive = false, variant }) {
  const mode = variant || (immersive ? "immersive" : "default");
  const isModal = mode === "modal";
  const isImmersive = mode === "immersive";
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
    enter: (d) => ({ opacity: 0, scale: d > 0 ? 1.03 : 0.97 }),
    center: { opacity: 1, scale: 1 },
    exit: (d) => ({ opacity: 0, scale: d > 0 ? 0.97 : 1.03 }),
  };

  if (isImmersive && images.length >= 2) {
    const [main, ...rest] = images;
    const side = rest.slice(0, 4);

    return (
      <>
        <div className="relative w-full md:mb-0">
          {/* Airbnb-style grid */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[min(72vh,620px)] rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => { setIdx(0); setLightbox(true); }}
              className="col-span-2 row-span-2 relative overflow-hidden group"
            >
              <SmartImage src={main} alt={title} className="absolute inset-0" imgClassName="group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
            {side.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setIdx(i + 1); setLightbox(true); }}
                className="relative overflow-hidden group"
              >
                <SmartImage src={img} alt="" className="absolute inset-0" imgClassName="group-hover:scale-105 transition-transform duration-700" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+{images.length - 5} fotos</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile: full bleed swipe */}
          <div className="md:hidden relative h-[55vh] min-h-[320px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={idx}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
                onClick={() => setLightbox(true)}
              >
                <SmartImage src={images[idx]} alt={title} className="absolute inset-0" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold">
              <Camera className="w-3.5 h-3.5" />
              {idx + 1}/{images.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="hidden md:flex absolute bottom-5 right-5 items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-xl text-sm font-bold hover:scale-105 transition-transform z-10"
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
      <div className={cn(isModal ? "relative w-full" : "relative rounded-3xl overflow-hidden")}>
        <div
          className={cn(
            "relative w-full cursor-zoom-in overflow-hidden",
            isModal ? "h-[clamp(220px,42vh,420px)]" : ""
          )}
          style={isModal ? undefined : { height: "clamp(340px, 55vw, 600px)" }}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div key={idx} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="absolute inset-0">
              <SmartImage src={images[idx]} alt={title} className="absolute inset-0" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 shadow-xl flex items-center justify-center z-10 hover:scale-105 transition-transform">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 shadow-xl flex items-center justify-center z-10 hover:scale-105 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox(true); }} className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-bold">
            <Maximize2 className="w-3.5 h-3.5" />
            {images.length} fotos
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <div className={cn(isModal ? "px-4 sm:px-6 mt-3" : "mt-2.5 px-1")}>
          <div
            className={cn(
              "flex gap-2.5 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory scrollbar-thin",
              isModal && "py-1"
            )}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                className={cn(
                  "shrink-0 snap-start rounded-xl overflow-hidden transition-all",
                  isModal ? "w-[4.75rem] h-[3.5rem] sm:w-20 sm:h-[3.75rem]" : "w-20 h-16",
                  i === idx
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100"
                    : "opacity-55 hover:opacity-85"
                )}
              >
                <SmartImage src={img} alt="" className="w-full h-full" imgClassName="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Lightbox images={images} title={title} idx={idx} setIdx={go} lightbox={lightbox} setLightbox={setLightbox} gridView={gridView} setGridView={setGridView} prev={prev} next={next} direction={direction} variants={variants} />
    </>
  );
}

function Lightbox({ images, title, idx, setIdx, lightbox, setLightbox, gridView, setGridView, prev, next, direction, variants }) {
  return (
    <AnimatePresence>
      {lightbox && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10">
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[60vw]">{title}</p>
              <p className="text-white/40 text-xs">{idx + 1} de {images.length} · {ROOM_LABELS[idx] || "Foto"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setGridView(!gridView)} className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-colors", gridView ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10")}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setLightbox(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {gridView ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-5xl mx-auto">
                {images.map((img, i) => (
                  <button key={i} type="button" onClick={() => { setIdx(i); setGridView(false); }} className={cn("relative aspect-[4/3] rounded-xl overflow-hidden group", i === idx && "ring-2 ring-primary")}>
                    <SmartImage src={img} alt="" className="absolute inset-0" imgClassName="group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-bold">{ROOM_LABELS[i] || `Foto ${i + 1}`}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center relative px-14 min-h-0">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div key={idx} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="max-w-full max-h-full">
                  <img src={images[idx]} alt="" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
                </motion.div>
              </AnimatePresence>
              <button type="button" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-6 h-6 text-white" /></button>
              <button type="button" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-6 h-6 text-white" /></button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
