import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";

const SocialX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const SocialIG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const SocialTikTok = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
  </svg>
);

const footerLinks = {
  Plataforma: [
    { to: "/explorar", label: "Buscar arriendos" },
    { to: "/explorar?intent=compra", label: "Buscar compra" },
    { to: "/favoritos", label: "Mis guardados" },
  ],
  Propietarios: [
    { to: "/anunciar", label: "Anunciar (arriendo)" },
    { to: "/publicar", label: "Vender inmueble" },
    { to: "/publicar/nuevo", label: "Registrar inmueble" },
  ],
  Zonas: [
    { to: "/explorar?city=Bogotá&q=Chapinero", label: "Chapinero" },
    { to: "/explorar?city=Bogotá&q=Usaquén", label: "Usaquén" },
    { to: "/explorar?city=Bogotá&q=Suba", label: "Suba" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark">
      <div className="color-bar w-full" />
      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 gradient-cta rounded-2xl flex items-center justify-center shrink-0 shadow-lg font-extrabold text-white">
                L
              </div>
              <div>
                <span className="font-extrabold text-xl text-white block leading-tight">{BRAND.name}</span>
                <p className="text-white/35 text-[10px] font-semibold">{BRAND.tagline}</p>
              </div>
            </Link>
            <div className="flex gap-2 mb-8">
              {[
                { Icon: SocialIG, href: BRAND.social?.instagram, label: "Instagram" },
                { Icon: SocialX, href: BRAND.social?.x, label: "X" },
                { Icon: SocialTikTok, href: BRAND.social?.tiktok, label: "TikTok" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/6 hover:bg-white/12 border border-white/8 flex items-center justify-center transition-all text-white/40 hover:text-white/80"
                >
                  <Icon />
                </a>
              ))}
            </div>
            {/* App badge placeholder */}
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/6 border border-white/8 hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                </svg>
                <div className="text-left">
                  <p className="text-white/30 text-[9px] leading-none uppercase tracking-wider">Próximamente</p>
                  <p className="text-white/70 text-xs font-semibold leading-tight mt-0.5">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/6 border border-white/8 hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.37.2.8.22 1.2.04l12.45-6.96-2.69-2.7-10.96 9.62zM20.1 10.24L17.31 8.6 14.35 11.5l2.96 2.95 2.82-1.63c.8-.46.8-1.64-.03-2.08zM1.16.39C1.06.6 1 .85 1 1.12V22.9c0 .26.06.51.16.71l.09.08L13.45 11.5v-.3L1.25.31l-.09.08z"/>
                </svg>
                <div className="text-left">
                  <p className="text-white/30 text-[9px] leading-none uppercase tracking-wider">Próximamente</p>
                  <p className="text-white/70 text-xs font-semibold leading-tight mt-0.5">Google Play</p>
                </div>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <p className="text-white/30 text-xs font-bold uppercase tracking-[0.15em] mb-5">{title}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-white/45 hover:text-white text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.15em] mb-5">Contacto</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-primary/70 mt-0.5 shrink-0" />
                <span className="text-white/45 text-sm leading-tight">Colombia</span>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5 text-brand-magenta shrink-0" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors">
                  <Phone className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  {BRAND.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider + bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} {BRAND.name} · Colombia
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${BRAND.email}?subject=Consulta%20legal`} className="text-white/20 hover:text-white/45 text-xs transition-colors">
              Contacto legal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}