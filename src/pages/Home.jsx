import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HeroSection from "../components/home/HeroSection";
import MatchSteps from "../components/home/MatchSteps";
import TestimonialsSection from "../components/home/TestimonialsSection";
import ValuePropsSection from "../components/home/ValuePropsSection";
import FeaturedProperties from "../components/home/FeaturedProperties";
import ZonesSection from "../components/home/ZonesSection";
import OwnerCTA from "../components/home/OwnerCTA";
import MapExploreSection from "../components/home/MapExploreSection";

const startQuiz = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

export default function Home() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 6),
  });

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection onStartQuiz={startQuiz} />
      <MatchSteps onStartQuiz={startQuiz} />
      <TestimonialsSection />
      <FeaturedProperties properties={properties} isLoading={isLoading} />
      <ValuePropsSection onStartQuiz={startQuiz} />
      <MapExploreSection />
      <ZonesSection />
      <OwnerCTA />
    </div>
  );
}
