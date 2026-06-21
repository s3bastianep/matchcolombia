import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, ExternalLink, Home, Search, Heart, User, Sparkles, Building2 } from "lucide-react";

const SCREENS = [
  { id: "home", label: "Inicio", path: "/", icon: Home, desc: "Pantalla principal con búsqueda rápida" },
  { id: "explore", label: "Explorar", path: "/explorar", icon: Search, desc: "Listado y mapa de inmuebles" },
  { id: "favorites", label: "Guardados", path: "/favoritos", icon: Heart, desc: "Tus favoritos y comparador" },
  { id: "advertise", label: "Anunciar", path: "/anunciar", icon: Building2, desc: "Publica tu inmueble en arriendo" },
  { id: "login", label: "Cuenta", path: "/login", icon: User, desc: "Inicio de sesión y registro" },
];

export default function AppMobilePreview() {
  const [activeScreen, setActiveScreen] = useState(SCREENS[0]);
  const [iframeKey, setIframeKey] = useState(0);

  const loadScreen = (screen) => {
    setActiveScreen(screen);
    setIframeKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#0c0b14] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-violet/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-brand-magenta/15 blur-[100px]" />
      </div>

      <header className="relative border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-200 mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              Vista previa Android
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">HABIBAR App</h1>
            <p className="text-sm text-white/55 mt-1 max-w-lg">
              Navega como en el teléfono. Barra inferior, gestos y pantallas reales antes de publicar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={activeScreen.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Pantalla completa
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl gradient-cta px-4 py-2.5 text-sm font-bold shadow-lg"
            >
              Sitio web
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-6 lg:py-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,280px)_1fr] gap-6 lg:gap-10 items-start">
          <aside className="w-full lg:sticky lg:top-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Pantallas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {SCREENS.map((screen) => {
                const Icon = screen.icon;
                const active = activeScreen.id === screen.id;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => loadScreen(screen)}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-violet-400/50 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "gradient-cta" : "bg-white/10"}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{screen.label}</span>
                      <span className="hidden lg:block text-[11px] text-white/45 leading-snug mt-0.5">{screen.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60 space-y-2">
              <p className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-300" />
                Novedades del diseño
              </p>
              <ul className="space-y-1.5 text-[13px] leading-relaxed">
                <li>Barra de navegación inferior tipo app nativa</li>
                <li>Accesos rápidos en inicio (Arrendar, Comprar, Publicar)</li>
                <li>Menú de cuenta con deslizamiento desde abajo</li>
                <li>Botones más grandes y fáciles de tocar</li>
              </ul>
            </div>
          </aside>

          <section className="w-full flex flex-col items-center">
            <div className="relative w-full max-w-[390px]">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-violet-500/25 to-transparent blur-2xl" />
              <div className="relative rounded-[2.75rem] border-[11px] border-[#1a1a24] bg-[#1a1a24] shadow-2xl shadow-black/60">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[34%] h-7 bg-[#1a1a24] rounded-b-2xl z-20" />
                <div className="relative w-full aspect-[9/19.5] rounded-[2rem] overflow-hidden bg-white">
                  <iframe
                    key={iframeKey}
                    title={`Vista previa ${activeScreen.label}`}
                    src={activeScreen.path}
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[28%] h-1 rounded-full bg-white/20 z-20" />
              </div>
            </div>

            <div className="mt-5 text-center space-y-1">
              <p className="text-sm font-semibold">{activeScreen.label}</p>
              <p className="text-xs text-white/45 max-w-sm">{activeScreen.desc}</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
