import React from "react";
import { BRAND } from "@/lib/brand";
import { ADVERTISE_FREE_SUBTITLE, ADVERTISE_FREE_TITLE } from "@/lib/siteCopy";

export default function AdvertiseFreeStrip() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="site-container py-8 sm:py-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold leading-[1.15] tracking-tight">
          {ADVERTISE_FREE_TITLE.replace("HABIBAR", BRAND.name)}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
          {ADVERTISE_FREE_SUBTITLE.replace(/HABIBAR/g, BRAND.name)}
        </p>
      </div>
    </section>
  );
}
