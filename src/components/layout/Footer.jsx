import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";

const SocialX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const SocialIG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const SocialTikTok = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
  </svg>
);

const footerLinks = {
  Plataforma: [
    { to: "/explorar", label: "Buscar arriendos" },
    { to: "/anunciar", label: "Anunciar inmueble" },
    { to: "/publicar", label: "Publicar gratis" },
    { to: "/favoritos", label: "Mis guardados" },
  ],
  Ciudades: [
    { to: "/explorar?city=Bogotá", label: "Bogotá" },
    { to: "/explorar?city=Barranquilla", label: "Barranquilla" },
  ],
  Empresa: [
    { to: "#", label: "Acerca de" },
    { to: "#", label: "Blog" },
    { to: "#", label: "Prensa" },
    { to: "#", label: "Trabaja con nosotros" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0f0e17]">
      <div className="color-bar h-0.5 w-full" />
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-8 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 gradient-cta rounded-xl flex items-center justify-center shrink-0 font-extrabold text-white text-sm">
                M
              </div>
              <div>
                <span className="font-bold text-base text-white block leading-tight">MatchColombia</span>
                <p className="text-white/35 text-[10px] font-medium">{BRAND.tagline}</p>
              </div>
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-[220px] mb-3">
              Arriendos en Bogotá y Barranquilla. Match perfecto, sin comisiones.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {[SocialIG, SocialX, SocialTikTok].map((Icon, i) => (
                <button key={i} className="w-7 h-7 rounded-md bg-white/6 hover:bg-white/12 border border-white/8 flex items-center justify-center transition-all text-white/40 hover:text-white/80">
                  <Icon />
                </button>
              ))}
              <span className="hidden sm:inline w-px h-4 bg-white/10 mx-0.5" />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/6 border border-white/8 text-[10px] text-white/50">
                <span>App Store</span>
                <span className="text-white/25">·</span>
                <span>Google Play</span>
                <span className="text-[9px] text-white/30 uppercase">pronto</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2.5">{title}</p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-white/45 hover:text-white text-xs transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2.5">Contacto</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary/70 shrink-0" />
                <span className="text-white/45 text-xs">Colombia</span>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-white/45 hover:text-white text-xs transition-colors">
                  <Mail className="w-3 h-3 text-brand-magenta shrink-0" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-white/45 hover:text-white text-xs transition-colors">
                  <Phone className="w-3 h-3 text-primary/70 shrink-0" />
                  {BRAND.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-[11px]">
            © {new Date().getFullYear()} {BRAND.name} · Colombia
          </p>
          <div className="flex items-center gap-4">
            {["Términos de uso", "Privacidad", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-white/20 hover:text-white/45 text-[11px] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
