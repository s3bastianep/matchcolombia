import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyGallery from "./PropertyGallery";
import VisitBookingForm from "./VisitBookingForm";
import PropertyLocationMap from "./PropertyLocationMap";
import SimilarProperties from "./SimilarProperties";
import { getPropertyImages } from "@/lib/colombiaImages";
import {
  DirectContactOptions,
  BrandCallout,
  ProcessStepperCard,
  ExpertCredibility,
  PropertyCharacteristicsSection,
  PropertyEssentialsSection,
  PersonalSearchSection,
  PropertyDetailHeader,
} from "./propertyDetailShared";

function ContactSidebar({ property, id, bookingRef }) {
  return (
    <div id="agenda-visita" ref={bookingRef} className="space-y-6 scroll-mt-20">
      <BrandCallout />
      <VisitBookingForm property={property} propertyId={id} propertyTitle={property.title} />
      <DirectContactOptions property={property} />
      <ProcessStepperCard />
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

  return (
    <div>
      <div className={isModal ? "" : ""}>
        <PropertyGallery images={images} title={property.title} variant={isModal ? "modal" : "immersive"} />
      </div>

      <div className={isModal ? "px-4 sm:px-6 pb-24 sm:pb-6" : ""}>
      <motion.div
        initial={isModal ? false : { opacity: 0, y: 12 }}
        animate={isModal ? false : { opacity: 1, y: 0 }}
        className={isModal ? "mt-4" : "mt-8"}
      >
        <PropertyDetailHeader property={property} />
      </motion.div>

      <div className={isModal ? "py-4" : "py-6"}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="flex flex-col gap-8 sm:gap-12">
            <PropertyEssentialsSection property={property} />
            <PropertyCharacteristicsSection property={property} />

            {isModal && (
              <div className="lg:hidden">
                <ContactSidebar property={property} id={property.id} bookingRef={bookingRef} />
              </div>
            )}

            {property.description && (
              <section className="detail-section">
                <h2 className="detail-section-title">Sobre este inmueble</h2>
                <ExpertCredibility property={property} />
                <p className="detail-prose">{property.description}</p>
              </section>
            )}

            <PropertyLocationMap property={property} />

            <PersonalSearchSection />

            {isModal ? null : (
              <div className="lg:hidden">
                <ContactSidebar property={property} id={property.id} bookingRef={bookingRef} />
              </div>
            )}
          </div>

          <div className="hidden lg:block self-start">
            <div className="sticky top-4 z-10">
              <ContactSidebar property={property} id={property.id} bookingRef={bookingRef} />
            </div>
          </div>
        </div>

        {showSimilar && <SimilarProperties property={property} />}
      </div>
      </div>
    </div>
  );
}
