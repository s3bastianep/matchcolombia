import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const STROKE = "#1e293b";
const CORAL = "hsl(340,82%,52%)";
const TEAL = "hsl(168,72%,42%)";
const VIOLET = "hsl(265,75%,58%)";

/** Un segmento del skyline — se duplica para loop infinito */
function SkylineSegment({ onBuildingClick }) {
  const building = (id, x, w, h, opts = {}) => (
    <g
      key={id}
      className="skyline-building cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onClick={() => opts.link && onBuildingClick?.(opts.link)}
      role={opts.link ? "button" : undefined}
      tabIndex={opts.link ? 0 : undefined}
      onKeyDown={(e) => opts.link && (e.key === "Enter" || e.key === " ") && onBuildingClick?.(opts.link)}
    >
      <rect x={x} y={120 - h} width={w} height={h} fill="#fff" stroke={STROKE} strokeWidth="1.5" rx="1" />
      {opts.roof === "peak" && (
        <polygon
          points={`${x},${120 - h} ${x + w / 2},${120 - h - 14} ${x + w},${120 - h}`}
          fill={opts.roofColor || CORAL}
          stroke={STROKE}
          strokeWidth="1.2"
        />
      )}
      {opts.windows?.map(([wx, wy, ww, wh], i) => (
        <rect
          key={i}
          x={x + wx}
          y={120 - h + wy}
          width={ww}
          height={wh}
          fill={i % 3 === 0 ? TEAL : i % 3 === 1 ? CORAL : "#f1f5f9"}
          stroke={STROKE}
          strokeWidth="0.8"
          opacity="0.9"
          className="skyline-window transition-opacity group-hover:opacity-100"
        />
      ))}
      {opts.door && (
        <rect x={x + opts.door[0]} y={120 - opts.door[2]} width={opts.door[1]} height={opts.door[2]} fill={CORAL} stroke={STROKE} strokeWidth="0.8" rx="1" />
      )}
      {opts.balcony && (
        <rect x={x + 4} y={120 - h + 28} width={w - 8} height={6} fill="none" stroke={STROKE} strokeWidth="1" />
      )}
      {opts.chimney && (
        <>
          <rect x={x + w - 12} y={120 - h - 18} width={8} height={18} fill="#fff" stroke={STROKE} strokeWidth="1" />
          <ellipse cx={x + w - 8} cy={120 - h - 22} rx="5" ry="3" fill="#cbd5e1" opacity="0.6" className="animate-pulse" />
        </>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 900 130" className="h-full w-[900px] shrink-0" aria-hidden="true">
      {/* Suelo */}
      <line x1="0" y1="120" x2="900" y2="120" stroke={STROKE} strokeWidth="2" />

      {/* Árboles */}
      {[
        [45, 108], [195, 108], [420, 108], [580, 108], [750, 108],
      ].map(([tx, ty], i) => (
        <g key={`tree-${i}`}>
          <rect x={tx - 2} y={ty - 4} width={4} height={16} fill={STROKE} />
          <ellipse cx={tx} cy={ty - 10} rx="10" ry="12" fill={TEAL} opacity="0.85" stroke={STROKE} strokeWidth="1" />
        </g>
      ))}

      {building("h1", 12, 52, 48, {
        roof: "peak",
        roofColor: CORAL,
        link: "/explorar?city=Bogotá&q=Chapinero",
        windows: [[8, 14, 10, 12], [28, 14, 10, 12], [8, 30, 10, 12], [28, 30, 10, 12]],
        door: [20, 12, 18],
      })}

      {building("h2", 68, 38, 62, {
        link: "/explorar?city=Bogotá",
        windows: [[6, 10, 8, 10], [20, 10, 8, 10], [6, 24, 8, 10], [20, 24, 8, 10], [6, 38, 8, 10], [20, 38, 8, 10]],
        balcony: true,
      })}

      {building("h3", 110, 44, 72, {
        roof: "peak",
        roofColor: VIOLET,
        link: "/explorar?city=Bogotá&q=Usaquén",
        windows: [[8, 12, 12, 14], [26, 12, 12, 14], [8, 32, 12, 14], [26, 32, 12, 14], [8, 52, 12, 14]],
        chimney: true,
      })}

      {building("h4", 158, 56, 55, {
        link: "/explorar?type=apartamento",
        windows: [[8, 10, 14, 12], [30, 10, 14, 12], [8, 28, 14, 12], [30, 28, 14, 12]],
        door: [22, 14, 20],
      })}

      {building("h5", 218, 48, 78, {
        link: "/explorar?city=Barranquilla",
        windows: [[6, 8, 10, 12], [22, 8, 10, 12], [38, 8, 10, 12], [6, 26, 10, 12], [22, 26, 10, 12], [38, 26, 10, 12], [6, 44, 10, 12], [22, 44, 10, 12]],
      })}

      {building("h6", 270, 62, 58, {
        roof: "peak",
        roofColor: TEAL,
        link: "/explorar?city=Bogotá&q=Kennedy",
        windows: [[10, 12, 16, 14], [34, 12, 16, 14], [10, 32, 16, 14]],
        balcony: true,
      })}

      {building("h7", 336, 40, 68, {
        link: "/explorar",
        windows: [[6, 10, 8, 10], [20, 10, 8, 10], [6, 26, 8, 10], [20, 26, 8, 10], [6, 42, 8, 10], [20, 42, 8, 10]],
      })}

      {building("h8", 380, 50, 52, {
        roof: "peak",
        roofColor: CORAL,
        link: "/explorar?city=Bogotá&q=Teusaquillo",
        windows: [[8, 14, 12, 12], [28, 14, 12, 12], [8, 32, 12, 12]],
        door: [18, 12, 16],
      })}

      {building("h9", 434, 58, 70, {
        link: "/publicar",
        windows: [[8, 10, 14, 12], [30, 10, 14, 12], [8, 28, 14, 12], [30, 28, 14, 12], [8, 46, 14, 12]],
        chimney: true,
      })}

      {building("h10", 496, 46, 60, {
        roof: "peak",
        roofColor: VIOLET,
        link: "/explorar?city=Barranquilla",
        windows: [[8, 12, 10, 12], [26, 12, 10, 12], [8, 28, 10, 12], [26, 28, 10, 12]],
      })}

      {building("h11", 546, 54, 64, {
        link: "/explorar?type=casa",
        windows: [[8, 10, 12, 14], [28, 10, 12, 14], [8, 30, 12, 14], [28, 30, 12, 14]],
        door: [22, 14, 18],
      })}

      {building("h12", 604, 42, 76, {
        link: "/explorar?city=Bogotá",
        windows: [[6, 8, 10, 12], [22, 8, 10, 12], [38, 8, 10, 12], [6, 24, 10, 12], [22, 24, 10, 12], [38, 24, 10, 12], [6, 40, 10, 12], [22, 40, 10, 12]],
        balcony: true,
      })}

      {building("h13", 652, 48, 58, {
        roof: "peak",
        roofColor: TEAL,
        link: "/explorar?q=Suba",
        windows: [[8, 14, 12, 12], [28, 14, 12, 12], [8, 32, 12, 12]],
      })}

      {building("h14", 704, 52, 66, {
        link: "/explorar",
        windows: [[8, 10, 14, 12], [30, 10, 14, 12], [8, 28, 14, 12], [30, 28, 14, 12]],
        door: [20, 12, 18],
      })}

      {building("h15", 760, 44, 72, {
        roof: "peak",
        roofColor: CORAL,
        link: "/explorar?city=Bogotá&q=La Candelaria",
        windows: [[6, 10, 10, 12], [22, 10, 10, 12], [38, 10, 10, 12], [6, 28, 10, 12], [22, 28, 10, 12]],
      })}

      {building("h16", 808, 50, 56, {
        link: "/explorar?type=estudio",
        windows: [[8, 12, 12, 14], [28, 12, 12, 14], [8, 32, 12, 14]],
        balcony: true,
      })}

      {building("h17", 860, 38, 38, {
        roof: "peak",
        roofColor: VIOLET,
        windows: [[8, 14, 10, 12], [20, 14, 10, 12]],
        door: [13, 10, 14],
      })}

      {/* Pájaros */}
      <g className="skyline-birds animate-birds">
        <path d="M680 28 Q685 22 690 28 Q695 22 700 28" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M710 22 Q714 17 718 22 Q722 17 726 22" fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M730 32 Q733 27 736 32 Q739 27 742 32" fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Dirigible */}
      <g className="skyline-blimp animate-blimp cursor-pointer" onClick={() => onBuildingClick?.("/explorar")}>
        <ellipse cx="820" cy="24" rx="28" ry="12" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
        <path d="M820 36 L820 48" stroke={STROKE} strokeWidth="1" />
        <rect x="812" y="48" width="16" height="8" fill={CORAL} stroke={STROKE} strokeWidth="1" rx="1" />
        <ellipse cx="820" cy="24" rx="18" ry="6" fill={CORAL} opacity="0.25" />
      </g>
    </svg>
  );
}

export default function CitySkyline() {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handleBuildingClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <div className="relative bg-[hsl(240,40%,98%)] border-t border-border/40 overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/80 via-transparent to-[hsl(240,40%,96%)]" />

      <div className="h-36 sm:h-40 overflow-hidden flex items-end">
        <div
          className={cn("flex w-max skyline-track items-end", paused && "skyline-track-paused")}
          style={{ animationDuration: `${90 / speed}s` }}
          onMouseEnter={() => setSpeed(0.35)}
          onMouseLeave={() => setSpeed(1)}
        >
        <SkylineSegment onBuildingClick={handleBuildingClick} />
        <SkylineSegment onBuildingClick={handleBuildingClick} />
        </div>
      </div>

      <div className="relative flex flex-col items-center pb-4 pt-1 gap-2">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border/60 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-border shadow-sm transition-all"
          aria-pressed={paused}
        >
          {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          {paused ? "Reanudar" : "Pausar"}
        </button>
        <p className="text-[10px] font-semibold text-muted-foreground/70 tracking-wide">
          Toca un edificio para explorar · Bogotá y Barranquilla
        </p>
      </div>
    </div>
  );
}
