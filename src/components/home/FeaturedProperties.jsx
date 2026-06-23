import React from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { ArrowRight, Building2, MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { exploreInviteSubtitle } from "@/lib/siteCopy";

import VerifiedBadge from "@/components/brand/VerifiedBadge";

import SectionHeader from "@/components/ui/SectionHeader";

import { EXPLORE_PATHS, POPULAR_ZONES } from "@/lib/homeExplore";

import { cn } from "@/lib/utils";



function ExplorePathCard({ path, index }) {

  const Icon = path.icon;



  return (

    <motion.div

      initial={{ opacity: 0, y: 14 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true }}

      transition={{ delay: index * 0.06 }}

    >

      <Link

        to={path.to}

        className={cn(

          "group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm card-hover min-h-[280px] sm:min-h-[300px]",

          "ring-1 ring-transparent hover:ring-2",

          path.ring

        )}

      >

        <div className="relative h-40 sm:h-44 overflow-hidden">

          <img

            src={path.image}

            alt=""

            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"

            loading="lazy"

          />

          <div className={cn("absolute inset-0 bg-gradient-to-t", path.accent)} />

          <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />

          <span

            className={cn(

              "absolute top-4 left-4 inline-flex size-11 items-center justify-center rounded-2xl backdrop-blur-sm bg-white/95 shadow-sm",

              path.iconBg

            )}

          >

            <Icon className="size-5" strokeWidth={2.25} />

          </span>

        </div>



        <div className="flex flex-1 flex-col p-5 sm:p-6">

          <h3 className="text-xl font-extrabold tracking-tight text-foreground">{path.title}</h3>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{path.subtitle}</p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-violet group-hover:gap-2.5 transition-all">

            {path.cta}

            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />

          </span>

        </div>

      </Link>

    </motion.div>

  );

}



export default function FeaturedProperties() {

  return (

    <section id="explorar-inmuebles" className="section-pad section-pad-tight-top bg-[hsl(0,0%,98%)] border-y border-border/40">

      <div className="site-container">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

          <div className="flex flex-col gap-3 max-w-2xl">

            <SectionHeader

              eyebrow="Inventario verificado"

              title="Explora inmuebles en Bogotá"

              subtitle={exploreInviteSubtitle(BRAND.name)}

            />

            <VerifiedBadge size="sm" className="w-fit" />

          </div>



          <Link

            to="/explorar"

            className="hidden lg:inline-flex items-center gap-2 gradient-cta text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity shrink-0"

          >

            <Building2 className="size-4" strokeWidth={2.25} />

            Ver todo el inventario

            <ArrowRight className="size-4" strokeWidth={2.5} />

          </Link>

        </div>



        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">

          {EXPLORE_PATHS.map((path, i) => (

            <ExplorePathCard key={path.to} path={path} index={i} />

          ))}

        </div>



        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground mr-1">

              <MapPin className="size-3.5 text-brand-violet" strokeWidth={2.5} />

              Zonas populares

            </span>

            {POPULAR_ZONES.map((zone) => (

              <Link

                key={zone.label}

                to={zone.to}

                className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-border/60 bg-white text-foreground/80 hover:border-brand-violet/35 hover:text-brand-violet transition-colors"

              >

                {zone.label}

              </Link>

            ))}

          </div>



          <Link

            to="/explorar"

            className="lg:hidden inline-flex items-center justify-center gap-2 gradient-cta text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity"

          >

            Ver todo el inventario

            <ArrowRight className="size-4" strokeWidth={2.5} />

          </Link>

        </div>

      </div>

    </section>

  );

}


