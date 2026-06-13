import React from "react";
import { motion } from "framer-motion";

function BuildingsIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[220px] mx-auto h-auto" aria-hidden="true">
      <polygon points="8,18 10,22 14,22 11,25 12,30 8,27 4,30 5,25 2,22 6,22" fill="hsl(32,95%,54%)" />
      <polygon points="168,14 170,18 174,18 171,21 172,26 168,23 164,26 165,21 162,18 166,18" fill="hsl(32,95%,54%)" />
      <rect x="20" y="70" width="36" height="50" rx="2" fill="hsl(200,90%,50%)" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="28" y="82" width="8" height="10" fill="#fff" /><rect x="40" y="82" width="8" height="10" fill="#fff" />
      <rect x="28" y="98" width="8" height="10" fill="#fff" /><rect x="40" y="98" width="8" height="10" fill="#fff" />
      <rect x="62" y="50" width="40" height="70" rx="2" fill="hsl(340,82%,52%)" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="72" y="62" width="10" height="12" fill="#fff" /><rect x="88" y="62" width="10" height="12" fill="#fff" />
      <rect x="72" y="80" width="10" height="12" fill="#fff" /><rect x="88" y="80" width="10" height="12" fill="#fff" />
      <rect x="72" y="98" width="10" height="12" fill="#fff" /><rect x="88" y="98" width="10" height="12" fill="#fff" />
      <rect x="110" y="58" width="32" height="62" rx="2" fill="hsl(32,95%,54%)" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="118" y="70" width="8" height="10" fill="#fff" /><rect x="130" y="70" width="8" height="10" fill="#fff" />
      <rect x="118" y="88" width="8" height="10" fill="#fff" /><rect x="130" y="88" width="8" height="10" fill="#fff" />
      <rect x="148" y="78" width="34" height="42" rx="2" fill="hsl(265,75%,58%)" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="156" y="90" width="8" height="10" fill="#fff" /><rect x="168" y="90" width="8" height="10" fill="#fff" />
      <polygon points="148,78 165,58 182,78" fill="hsl(168,72%,40%)" stroke="#1e293b" strokeWidth="1.2" />
      <circle cx="175" cy="28" r="3" fill="hsl(32,95%,54%)" opacity="0.9" />
      <circle cx="30" cy="35" r="2.5" fill="hsl(32,95%,54%)" opacity="0.8" />
      <circle cx="155" cy="22" r="2" fill="hsl(32,95%,54%)" opacity="0.7" />
    </svg>
  );
}

function ResourcesIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[220px] mx-auto h-auto" aria-hidden="true">
      <rect x="30" y="30" width="70" height="80" rx="6" fill="#fff" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="65" cy="58" r="22" fill="none" stroke="hsl(340,82%,52%)" strokeWidth="8" strokeDasharray="40 100" />
      <circle cx="65" cy="58" r="22" fill="none" stroke="hsl(200,90%,50%)" strokeWidth="8" strokeDasharray="30 100" strokeDashoffset="-40" />
      <circle cx="65" cy="58" r="22" fill="none" stroke="hsl(32,95%,54%)" strokeWidth="8" strokeDasharray="20 100" strokeDashoffset="-70" />
      <rect x="115" y="40" width="60" height="70" rx="6" fill="#fff" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="128" y="88" width="10" height="14" fill="hsl(200,90%,50%)" rx="1" />
      <rect x="142" y="78" width="10" height="24" fill="hsl(340,82%,52%)" rx="1" />
      <rect x="156" y="68" width="10" height="34" fill="hsl(168,72%,40%)" rx="1" />
      <polyline points="125,55 135,48 148,52 162,38 175,42" fill="none" stroke="hsl(265,75%,58%)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="25" r="2.5" fill="hsl(32,95%,54%)" />
      <circle cx="170" cy="28" r="2" fill="hsl(32,95%,54%)" />
      <circle cx="100" cy="18" r="2" fill="hsl(32,95%,54%)" />
    </svg>
  );
}

function PeaceIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[220px] mx-auto h-auto" aria-hidden="true">
      <ellipse cx="100" cy="118" rx="42" ry="8" fill="#e2e8f0" opacity="0.6" />
      <circle cx="100" cy="52" r="16" fill="#1e293b" />
      <path d="M72 78 Q100 62 128 78 L122 108 Q100 98 78 108 Z" fill="hsl(340,82%,52%)" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M78 108 L72 118 M122 108 L128 118" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <path d="M88 118 L88 128 M112 118 L112 128" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <path d="M82 95 L78 108 M118 95 L122 108" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="55" cy="30" r="2.5" fill="hsl(32,95%,54%)" />
      <circle cx="145" cy="25" r="2" fill="hsl(32,95%,54%)" />
      <circle cx="165" cy="45" r="2" fill="hsl(32,95%,54%)" />
      <circle cx="35" cy="50" r="2" fill="hsl(32,95%,54%)" />
    </svg>
  );
}

const features = [
  {
    Illustration: BuildingsIllustration,
    title: "Inventario verificado",
    desc: "Explora inmuebles en arriendo en Bogotá y Barranquilla. Nosotros gestionamos cada consulta y visita por ti.",
  },
  {
    Illustration: ResourcesIllustration,
    title: "Recursos útiles",
    desc: "Match inteligente, filtros avanzados y guías para tomar mejores decisiones al arrendar en Colombia.",
  },
  {
    Illustration: PeaceIllustration,
    title: "Tranquilidad de espíritu",
    desc: "Siéntete seguro en tu proceso de arriendo. Anuncios verificados y un equipo real que te acompaña en cada paso.",
  },
];

export default function RentEasySection() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
            Arrendar nunca fue tan fácil.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Ayudamos a inquilinos en Bogotá y Barranquilla a encontrar su hogar con confianza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {features.map(({ Illustration, title, desc }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="relative mb-6 sm:mb-8 flex justify-center items-center min-h-[140px]">
                <Illustration />
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-foreground mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
