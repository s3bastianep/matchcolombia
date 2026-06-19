import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PropertyGallery from "./PropertyGallery";
import VisitBookingForm from "./VisitBookingForm";
import PropertyLocationMap from "./PropertyLocationMap";
import SimilarProperties from "./SimilarProperties";
import { getPropertyImages } from "@/lib/colombiaImages";
import {
  DirectContactOptions,
  ExpertCredibility,
  PropertyCharacteristicsSection,
  PropertyEssentialsSection,
  PropertyDetailHeader,
} from "./propertyDetailShared";

function MobileSection({ title, children, className }) {
  return (
    <section className={cn("px-4 py-5 border-t border-border/30", className)}>
      {title && <h2 className="text-base font-bold tracking-tight mb-3">{title}</h2>}
      {children}
    </section>
  );
}

function ContactBlock({ property, id, bookingRef, mobile = false }) {
  return (
    <div id="agenda-visita" ref={bookingRef} className="scroll-mt-24 space-y-4">
      <VisitBookingForm
        property={property}
        propertyId={id}
        propertyTitle={property.title}
        variant={mobile ? "mobile" : "default"}
      />
      <DirectContactOptions property={property} />
    </div>
  );
}

export default function PropertyDetailView({
  property,
  variant = "page",
  focusBooking = false,
  showSimilar = false,
}) {
  const bookingRef = useRef(null);
  const images = getPropertyImages(property);
  const isModal = variant === "modal";

  useEffect(() => {
    if (!focusBooking || !bookingRef.current) return;
    const timer = setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 280);
    return () => clearTimeout(timer);
  }, [focusBooking, property?.id]);

  if (isModal) {
    return (
      <div className="pb-28 bg-white">
        <PropertyGallery images={images} title={property.title} variant="modal" />
        <PropertyDetailHeader property={property} compact />
        <div className="px-4 pb-5">
          <PropertyEssentialsSection property={property} compact />
        </div>
        <MobileSection>
          <PropertyCharacteristicsSection property={property} />
        </MobileSection>
        {property.description && (
          <MobileSection title="Sobre este inmueble">
            <p className="text-sm text-foreground/80 leading-relaxed">{property.description}</p>
          </MobileSection>
        )}
        <MobileSection title="Ubicación">
          <PropertyLocationMap property={property} />
        </MobileSection>
        <MobileSection title="Agenda tu visita">
          <ContactBlock property={property} id={property.id} bookingRef={bookingRef} mobile />
        </MobileSection>
        {showSimilar && (
          <div className="border-t border-border/30">
            <SimilarProperties property={property} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PropertyGallery images={images} title={property.title} variant="immersive" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <PropertyDetailHeader property={property} />
      </motion.div>
      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="flex flex-col gap-6 sm:gap-12">
            <PropertyEssentialsSection property={property} />
            <PropertyCharacteristicsSection property={property} />
            {property.description && (
              <section className="detail-section">
                <h2 className="detail-section-title">Sobre este inmueble</h2>
                <ExpertCredibility property={property} />
                <p className="detail-prose">{property.description}</p>
              </section>
            )}
            <PropertyLocationMap property={property} />
            <div className="lg:hidden">
              <ContactBlock property={property} id={property.id} bookingRef={bookingRef} />
            </div>
          </div>
          <div className="hidden lg:block self-start">
            <div className="sticky top-4 z-10">
              <ContactBlock property={property} id={property.id} bookingRef={bookingRef} />
            </div>
          </div>
        </div>
        {showSimilar && <SimilarProperties property={property} />}
      </div>
    </div>
  );
}
