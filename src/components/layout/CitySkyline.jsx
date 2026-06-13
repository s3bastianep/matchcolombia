import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const STROKE = "#2c3e50";
const CORAL = "#e85d4c";
const TEAL = "#3aaf9e";
const VIOLET = "#7c6cf0";
const CREAM = "#f7f6f2";

const SEGMENT_WIDTH = 1400;

function Building({ x, w, h, children, onClick, className }) {
  return (
    <g
      className={cn("skyline-building", onClick && "cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <rect x={x} y={140 - h} width={w} height={h} fill="#fff" stroke={STROKE} strokeWidth="1.4" />
      {children}
    </g>
  );
}

function Tree({ x }) {
  return (
    <g>
      <rect x={x - 1.5} y={128} width={3} height={12} fill={STROKE} />
      <circle cx={x} cy={118} r="11" fill={TEAL} stroke={STROKE} strokeWidth="1" />
    </g>
  );
}

function Window({ x, y, w, h, color = "#eef2f6" }) {
  return <rect x={x} y={y} width={w} height={h} fill={color} stroke={STROKE} strokeWidth="0.7" rx="0.5" />;
}

function SkylineArt({ onNavigate }) {
  const go = (path) => () => onNavigate?.(path);
  const base = 140;

  return (
    <svg
      viewBox={`0 0 ${SEGMENT_WIDTH} 160`}
      className="block h-full w-[1400px] shrink-0"
      preserveAspectRatio="xMinYMax meet"
      aria-hidden="true"
    >
      <rect width={SEGMENT_WIDTH} height={160} fill={CREAM} />

      {/* Edificios lejanos (parallax visual — más planos) */}
      <g opacity="0.35">
        {[80, 260, 480, 720, 980, 1180].map((x, i) => (
          <rect key={i} x={x} y={base - 55 - (i % 3) * 12} width={90 + (i % 2) * 20} height={55 + (i % 3) * 12} fill="#e8e6e0" stroke={STROKE} strokeWidth="1" />
        ))}
      </g>

      <line x1="0" y1={base} x2={SEGMENT_WIDTH} y2={base} stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />

      <Tree x={55} />
      <Tree x={320} />
      <Tree x={590} />
      <Tree x={860} />
      <Tree x={1120} />
      <Tree x={1340} />

      {/* Casa con techo coral */}
      <Building x={20} w={58} h={52} onClick={go("/explorar?city=Bogotá&q=Chapinero")}>
        <polygon points="20,88 49,68 78,88" fill={CORAL} stroke={STROKE} strokeWidth="1.2" />
        <Window x={32} y={96} w={12} h={14} color={TEAL} />
        <Window x={54} y={96} w={12} h={14} />
        <rect x={44} y={114} width={14} height={26} fill={CORAL} stroke={STROKE} strokeWidth="0.8" rx="1" />
      </Building>

      {/* Amsterdam gable row */}
      <Building x={88} w={36} h={68} onClick={go("/explorar?city=Bogotá")}>
        <path d="M88 72 L106 52 L124 72 Z" fill={VIOLET} stroke={STROKE} strokeWidth="1" />
        <Window x={96} y={78} w={10} h={12} /><Window x={110} y={78} w={10} h={12} />
        <Window x={96} y={96} w={10} h={12} /><Window x={110} y={96} w={10} h={12} />
        <Window x={96} y={114} w={10} h={12} /><Window x={110} y={114} w={10} h={12} />
      </Building>
      <Building x={128} w={34} h={74}>
        <path d="M128 66 L145 48 L162 66 Z" fill={CORAL} stroke={STROKE} strokeWidth="1" />
        <Window x={136} y={72} w={9} h={11} /><Window x={149} y={72} w={9} h={11} />
        <Window x={136} y={88} w={9} h={11} /><Window x={149} y={88} w={9} h={11} />
        <Window x={136} y={104} w={9} h={11} /><Window x={149} y={104} w={9} h={11} />
      </Building>
      <Building x={166} w={32} h={62}>
        <path d="M166 78 L182 62 L198 78 Z" fill={TEAL} stroke={STROKE} strokeWidth="1" />
        <Window x={173} y={84} w={9} h={11} /><Window x={186} y={84} w={9} h={11} />
        <Window x={173} y={100} w={9} h={11} /><Window x={186} y={100} w={9} h={11} />
      </Building>

      {/* Apartamento con fire escape */}
      <Building x={210} w={64} h={82} onClick={go("/explorar?type=apartamento")}>
        <Window x={220} y={68} w={14} h={16} color={CORAL} /><Window x={242} y={68} w={14} h={16} />
        <Window x={220} y={90} w={14} h={16} color={TEAL} /><Window x={242} y={90} w={14} h={16} />
        <Window x={220} y={112} w={14} h={16} /><Window x={242} y={112} w={14} h={16} />
        <path d="M278 58 L278 140 M278 72 L268 72 M278 88 L268 88 M278 104 L268 104" stroke={STROKE} strokeWidth="1.2" fill="none" />
        <rect x={264} y={70} width={14} height={3} fill={STROKE} /><rect x={264} y={86} width={14} height={3} fill={STROKE} />
      </Building>

      {/* Tienda con toldo */}
      <Building x={284} w={72} h={48} onClick={go("/explorar?city=Barranquilla")}>
        <path d="M284 92 Q320 78 356 92" fill={CORAL} stroke={STROKE} strokeWidth="1" />
        <rect x={304} y={98} width={32} height={42} fill="#fff" stroke={STROKE} strokeWidth="1" />
        <Window x={312} y={106} w={16} h={20} color={TEAL} />
      </Building>

      {/* Torre Kennedy */}
      <Building x={368} w={52} h={88} onClick={go("/explorar?city=Bogotá&q=Kennedy")}>
        <Window x={378} y={62} w={12} h={14} color={VIOLET} /><Window x={398} y={62} w={12} h={14} />
        <Window x={378} y={82} w={12} h={14} /><Window x={398} y={82} w={12} h={14} />
        <Window x={378} y={102} w={12} h={14} color={CORAL} /><Window x={398} y={102} w={12} h={14} />
        <rect x={388} y={118} width={12} height={22} fill={TEAL} stroke={STROKE} strokeWidth="0.7" />
      </Building>

      {/* Casa Usaquén */}
      <Building x={432} w={60} h={56} onClick={go("/explorar?city=Bogotá&q=Usaquén")}>
        <polygon points="432,84 462,64 492,84" fill={TEAL} stroke={STROKE} strokeWidth="1.2" />
        <Window x={444} y={92} w={12} h={14} /><Window x={468} y={92} w={12} h={14} />
        <rect x={454} y={112} width={16} height={28} fill={CORAL} stroke={STROKE} strokeWidth="0.8" />
        <rect x={478} y={72} width={8} height={16} fill="#fff" stroke={STROKE} strokeWidth="0.8" />
        <ellipse cx={482} cy={68} rx="4" ry="2.5" fill="#cbd5e1" className="skyline-smoke" />
      </Building>

      {/* Conjunto */}
      <Building x={502} w={78} h={76} onClick={go("/explorar")}>
        <Window x={514} y={72} w={14} h={14} /><Window x={536} y={72} w={14} h={14} /><Window x={558} y={72} w={14} h={14} />
        <Window x={514} y={92} w={14} h={14} color={TEAL} /><Window x={536} y={92} w={14} h={14} /><Window x={558} y={92} w={14} h={14} />
        <Window x={514} y={112} w={14} h={14} /><Window x={536} y={112} w={14} h={14} /><Window x={558} y={112} w={14} h={14} />
        <rect x={518} y={128} width={46} height={4} fill="none" stroke={STROKE} strokeWidth="1" />
      </Building>

      {/* Teusaquillo */}
      <Building x={590} w={48} h={64} onClick={go("/explorar?city=Bogotá&q=Teusaquillo")}>
        <polygon points="590,76 614,58 638,76" fill={VIOLET} stroke={STROKE} strokeWidth="1" />
        <Window x={600} y={82} w={11} h={13} /><Window x={618} y={82} w={11} h={13} />
        <Window x={600} y={100} w={11} h={13} color={CORAL} /><Window x={618} y={100} w={11} h={13} />
      </Building>

      {/* Publicar */}
      <Building x={648} w={56} h={70} onClick={go("/publicar")}>
        <Window x={658} y={78} w={14} h={14} color={TEAL} /><Window x={680} y={78} w={14} h={14} />
        <Window x={658} y={98} w={14} h={14} /><Window x={680} y={98} w={14} h={14} />
        <rect x={668} y={118} width={16} height={22} fill={VIOLET} stroke={STROKE} strokeWidth="0.7" />
      </Building>

      {/* Barranquilla block */}
      <Building x={714} w={70} h={80} onClick={go("/explorar?city=Barranquilla")}>
        <Window x={726} y={68} w={13} h={15} /><Window x={748} y={68} w={13} h={15} /><Window x={770} y={68} w={13} h={15} />
        <Window x={726} y={88} w={13} h={15} color={CORAL} /><Window x={748} y={88} w={13} h={15} /><Window x={770} y={88} w={13} h={15} />
        <Window x={726} y={108} w={13} h={15} /><Window x={748} y={108} w={13} h={15} />
      </Building>

      {/* Suba */}
      <Building x={796} w={54} h={58} onClick={go("/explorar?q=Suba")}>
        <polygon points="796,82 823,62 850,82" fill={CORAL} stroke={STROKE} strokeWidth="1" />
        <Window x={806} y={90} w={12} h={14} /><Window x={828} y={90} w={12} h={14} />
        <Window x={806} y={110} w={12} h={14} color={TEAL} /><Window x={828} y={110} w={12} h={14} />
      </Building>

      {/* Candelaria */}
      <Building x={860} w={62} h={72} onClick={go("/explorar?city=Bogotá&q=La Candelaria")}>
        <Window x={872} y={76} w={14} h={14} color={VIOLET} /><Window x={896} y={76} w={14} h={14} />
        <Window x={872} y={96} w={14} h={14} /><Window x={896} y={96} w={14} h={14} />
        <Window x={872} y={116} w={14} h={14} color={CORAL} /><Window x={896} y={116} w={14} h={14} />
      </Building>

      {/* Estudio pequeño */}
      <Building x={934} w={42} h={44} onClick={go("/explorar?type=estudio")}>
        <polygon points="934,96 955,80 976,96" fill={TEAL} stroke={STROKE} strokeWidth="1" />
        <Window x={944} y={102} w={12} h={14} color={CORAL} />
        <rect x={952} y={118} width={10} height={22} fill={VIOLET} stroke={STROKE} strokeWidth="0.7" />
      </Building>

      {/* Más casas para cerrar el loop visual */}
      <Building x={986} w={50} h={60}>
        <Window x={996} y={88} w={12} h={14} /><Window x={1016} y={88} w={12} h={14} />
        <Window x={996} y={108} w={12} h={14} /><Window x={1016} y={108} w={12} h={14} />
      </Building>
      <Building x={1046} w={44} h={66}>
        <path d="M1046 74 L1068 54 L1090 74 Z" fill={CORAL} stroke={STROKE} strokeWidth="1" />
        <Window x={1056} y={80} w={10} h={12} /><Window x={1074} y={80} w={10} h={12} />
        <Window x={1056} y={98} w={10} h={12} /><Window x={1074} y={98} w={10} h={12} />
      </Building>
      <Building x={1098} w={58} h={54}>
        <Window x={1110} y={94} w={14} h={14} color={TEAL} /><Window x={1132} y={94} w={14} h={14} />
        <rect x={1120} y={112} width={14} height={28} fill={CORAL} stroke={STROKE} strokeWidth="0.8" />
      </Building>
      <Building x={1164} w={48} h={70}>
        <Window x={1174} y={78} w={12} h={14} /><Window x={1192} y={78} w={12} h={14} />
        <Window x={1174} y={98} w={12} h={14} color={VIOLET} /><Window x={1192} y={98} w={12} h={14} />
        <Window x={1174} y={118} w={12} h={14} /><Window x={1192} y={118} w={12} h={14} />
      </Building>
      <Building x={1220} w={52} h={58}>
        <polygon points="1220,82 1246,64 1272,82" fill={TEAL} stroke={STROKE} strokeWidth="1" />
        <Window x={1232} y={90} w={12} h={14} /><Window x={1254} y={90} w={12} h={14} />
      </Building>
      <Building x={1280} w={46} h={64}>
        <Window x={1290} y={84} w={12} h={14} /><Window x={1308} y={84} w={12} h={14} />
        <Window x={1290} y={104} w={12} h={14} color={CORAL} /><Window x={1308} y={104} w={12} h={14} />
      </Building>
      <Building x={1334} w={40} h={50}>
        <polygon points="1334,90 1354,74 1374,90" fill={VIOLET} stroke={STROKE} strokeWidth="1" />
        <Window x={1344} y={96} w={10} h={12} /><Window x={1360} y={96} w={10} h={12} />
      </Building>

      {/* Pájaros */}
      <g className="skyline-birds">
        <path d="M520 34 Q525 28 530 34 Q535 28 540 34" fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M560 26 Q564 21 568 26 Q572 21 576 26" fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M600 38 Q603 33 606 38 Q609 33 612 38" fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Dirigible */}
      <g className="skyline-blimp cursor-pointer" onClick={go("/explorar")}>
        <ellipse cx={1280} cy={28} rx={32} ry={13} fill="#fff" stroke={STROKE} strokeWidth="1.4" />
        <ellipse cx={1280} cy={28} rx={20} ry={7} fill={CORAL} opacity="0.3" />
        <line x1={1280} y1={41} x2={1280} y2={54} stroke={STROKE} strokeWidth="1" />
        <rect x={1271} y={54} width={18} height={9} fill={CORAL} stroke={STROKE} strokeWidth="1" rx="1" />
      </g>

      {/* Farola */}
      <g>
        <rect x={400} y={108} width={3} height={32} fill={STROKE} />
        <circle cx={401.5} cy={104} r={5} fill="#fff" stroke={STROKE} strokeWidth="1" />
        <circle cx={401.5} cy={104} r={2} fill={CORAL} opacity="0.6" className="skyline-lamp" />
      </g>
    </svg>
  );
}

export default function CitySkyline() {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const isPaused = paused || reduceMotion;

  return (
    <div className="hotpads-skyline relative overflow-hidden select-none" style={{ backgroundColor: CREAM }}>
      <div className="hotpads-skyline-viewport h-[148px] sm:h-[168px] md:h-[188px] overflow-hidden">
        <div
          className={cn("hotpads-skyline-track flex w-max items-end", isPaused && "hotpads-skyline-paused")}
          aria-hidden={isPaused}
        >
          <SkylineArt onNavigate={handleNavigate} />
          <SkylineArt onNavigate={handleNavigate} />
        </div>
      </div>

      <div className="flex justify-center py-3 border-t border-[#e8e6e0]/80">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="text-[13px] font-medium text-[#6b7280] hover:text-[#374151] transition-colors tracking-wide"
          aria-pressed={isPaused}
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
