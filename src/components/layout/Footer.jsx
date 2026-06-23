import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";
import BrandLogo from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

const SocialX = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const SocialIG = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const SocialTikTok = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const primaryLinks = [
  { to: "/explorar", label: "Arriendos" },
  { to: "/explorar?intent=compra", label: "Compra" },
  { to: "/favoritos", label: "Guardados" },
  { to: "/anunciar", label: "Anunciar" },
  { to: "/publicar", label: "Vender" },
];

const socials = [
  { Icon: SocialIG, href: BRAND.social?.instagram, label: "Instagram" },
  { Icon: SocialX, href: BRAND.social?.x, label: "X" },
  { Icon: SocialTikTok, href: BRAND.social?.tiktok, label: "TikTok" },
];

const linkBase = "text-muted-foreground hover:text-brand-violet transition-colors";
const dot = "text-brand-violet/30 select-none";

function InlineLinks({ items, className }) {
  return (
    <p className={className}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <span className={dot}> · </span>}
          <Link to={item.to} className={linkBase}>
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </p>
  );
}

function SocialRow({ className, iconSize = 15 }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {socials.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground/80 hover:text-brand-violet transition-colors"
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  );
}

function FooterShell({ children, className, mobile = false }) {
  return (
    <footer
      className={cn(
        "relative border-t border-border/70 bg-background",
        mobile && "bg-gradient-to-b from-background via-secondary/40 to-secondary/60",
        className
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-magenta/45 via-brand-violet/35 to-brand-magenta/45"
        aria-hidden="true"
      />
      <div className={cn("site-container", mobile ? "px-5 py-5" : "py-4 sm:py-5")}>{children}</div>
    </footer>
  );
}

function FooterMeta({ className, centered = false }) {
  return (
    <p className={cn("text-[11px] text-muted-foreground/75 leading-relaxed", centered && "text-center", className)}>
      <span>© {new Date().getFullYear()} {BRAND.name}</span>
      <span className={dot}> · </span>
      <span>Bogotá</span>
      <span className={dot}> · </span>
      <a href={`mailto:${BRAND.email}`} className={linkBase}>
        {BRAND.email}
      </a>
      <span className={dot}> · </span>
      <a href={`mailto:${BRAND.email}?subject=Consulta%20legal`} className={linkBase}>
        Legal
      </a>
    </p>
  );
}

function FooterMobile() {
  return (
    <FooterShell mobile className="lg:hidden">
      <div className="flex flex-col items-center text-center">
        <BrandLogo
          size="nav"
          layout="lockup"
          variant="color"
          link
          className="[&_img]:h-7 [&_img]:max-w-[7.5rem]"
        />
        <p className="mt-1.5 text-[10px] text-muted-foreground/80">{BRAND.tagline}</p>
        <SocialRow iconSize={15} className="mt-3 justify-center" />

        <nav
          aria-label="Enlaces del sitio"
          className="mt-4 w-full max-w-[280px] grid grid-cols-2 gap-2"
        >
          {primaryLinks.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "rounded-xl border border-border/60 bg-card/80 px-3 py-2.5 text-[12px] font-medium text-foreground/75 hover:text-brand-violet hover:border-brand-violet/25 transition-colors",
                index === primaryLinks.length - 1 && "col-span-2"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <FooterMeta centered className="mt-4 max-w-[320px]" />
      </div>
    </FooterShell>
  );
}

function FooterDesktop() {
  return (
    <FooterShell className="hidden lg:block bg-[hsl(265_38%_96.5%)] border-brand-violet/12">
      <div className="flex items-center justify-between gap-8">
        <BrandLogo size="nav" layout="lockup" variant="color" link />
        <InlineLinks items={primaryLinks} className="text-[13px] leading-none" />
        <SocialRow />
      </div>

      <FooterMeta className="mt-3 flex justify-end" />
    </FooterShell>
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
