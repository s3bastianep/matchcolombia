import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import MatchSteps from "../components/home/MatchSteps";
import WhyMatchSection from "../components/home/WhyMatchSection";
import FeaturedProperties from "../components/home/FeaturedProperties";
import RentEasySection from "../components/home/RentEasySection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import ValuePropsSection from "../components/home/ValuePropsSection";
import MapExploreSection from "../components/home/MapExploreSection";

const startQuiz = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

export default function Home() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 12),
  });

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection onStartQuiz={startQuiz} />
      <StatsBar />
      <MatchSteps onStartQuiz={startQuiz} />
      <WhyMatchSection />
      <FeaturedProperties properties={properties} isLoading={isLoading} />
      <RentEasySection />
      <ValuePropsSection onStartQuiz={startQuiz} />
      <TestimonialsSection />
      <MapExploreSection />
    </div>
  );
}
