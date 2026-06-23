import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";
import BrandLogo from "@/components/brand/BrandLogo";

const SocialX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const SocialIG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const SocialTikTok = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const footerLinks = {
  Plataforma: [
    { to: "/explorar", label: "Arriendos" },
    { to: "/explorar?intent=compra", label: "Compra" },
    { to: "/favoritos", label: "Guardados" },
  ],
  Propietarios: [
    { to: "/anunciar", label: "Anunciar" },
    { to: "/publicar", label: "Vender" },
    { to: "/publicar/nuevo", label: "Registrar" },
  ],
  Zonas: [
    { to: "/explorar?city=Bogotá&q=Chapinero", label: "Chapinero" },
    { to: "/explorar?city=Bogotá&q=Usaquén", label: "Usaquén" },
    { to: "/explorar?city=Bogotá&q=Suba", label: "Suba" },
  ],
};

const socials = [
  { Icon: SocialIG, href: BRAND.social?.instagram, label: "Instagram" },
  { Icon: SocialX, href: BRAND.social?.x, label: "X" },
  { Icon: SocialTikTok, href: BRAND.social?.tiktok, label: "TikTok" },
];

function FooterMobile() {
  return (
    <footer className="bg-brand-dark lg:hidden">
      <div className="color-bar w-full" />
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <BrandLogo size="nav" layout="lockup" variant="onDark" link={false} />
            <p className="text-white/30 text-[9px] font-medium mt-1 truncate">{BRAND.tagline}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-7 h-7 rounded-md bg-white/6 border border-white/8 flex items-center justify-center text-white/40"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-3 gap-x-2 gap-y-3">
          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <p className="text-white/25 text-[9px] font-bold uppercase tracking-wider mb-1">{title}</p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-white/50 text-[11px] leading-tight">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <span className="inline-flex items-center gap-1 text-white/40">
            <MapPin className="w-3 h-3 shrink-0" />
            Bogotá
          </span>
          <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-1 text-white/50">
            <Mail className="w-3 h-3 text-brand-magenta shrink-0" />
            {BRAND.email}
          </a>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-[10px] text-white/20">
          <span>
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <a href={`mailto:${BRAND.email}?subject=Consulta%20legal`} className="hover:text-white/40">
            Contacto legal
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterDesktop() {
  return (
    <footer className="bg-brand-dark hidden lg:block">
      <div className="color-bar w-full" />

      <div className="site-container py-8 lg:py-9">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-7 lg:gap-y-0">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <BrandLogo size="sm" layout="lockup" variant="onDark" link={false} />
            <p className="text-white/35 text-[10px] font-medium mt-2">{BRAND.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/6 hover:bg-white/12 border border-white/8 flex items-center justify-center transition-colors text-white/45 hover:text-white/80"
                >
                  <Icon />
                </a>
              ))}
              <span className="text-[10px] text-white/25 font-medium ml-0.5">App · Próximamente</span>
            </div>
          </div>

          {Object.entries({
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
            Zonas: footerLinks.Zonas,
          }).map(([title, items]) => (
            <div key={title}>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.14em] mb-2.5">{title}</p>
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
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.14em] mb-2.5">Contacto</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/45 text-xs">
                <MapPin className="w-3 h-3 text-white/35 shrink-0" />
                Bogotá, Colombia
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2 text-white/45 hover:text-white text-xs transition-colors"
                >
                  <Mail className="w-3 h-3 text-brand-magenta shrink-0" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center gap-2 text-white/45 hover:text-white text-xs transition-colors"
                >
                  <Phone className="w-3 h-3 text-white/35 shrink-0" />
                  {BRAND.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="site-container py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-[11px]">
            © {new Date().getFullYear()} {BRAND.name} · Bogotá, Colombia
          </p>
          <a
            href={`mailto:${BRAND.email}?subject=Consulta%20legal`}
            className="text-white/20 hover:text-white/45 text-[11px] transition-colors"
          >
            Contacto legal
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <>
      <FooterMobile />
      <FooterDesktop />
    </>
  );
}
