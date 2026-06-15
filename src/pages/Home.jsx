import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PROPERTY_LIST_QUERY } from "@/lib/queryOptions";
import HeroSection from "../components/home/HeroSection";
import FeaturedProperties from "../components/home/FeaturedProperties";
import MatchSteps from "../components/home/MatchSteps";
import OwnerCTA from "../components/home/OwnerCTA";

const startQuiz = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

export default function Home() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 12),
    ...PROPERTY_LIST_QUERY,
  });

  const stepProperties = properties.slice(0, 3);
  const featuredProperties = properties.slice(3);
  const hasFeaturedListings = isLoading || featuredProperties.length > 0;

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection onStartQuiz={startQuiz} />
      <MatchSteps
        onStartQuiz={startQuiz}
        properties={stepProperties}
        isLoading={isLoading}
        hasMoreListings={hasFeaturedListings}
      />
      {hasFeaturedListings && (
        <FeaturedProperties properties={featuredProperties} isLoading={isLoading} />
      )}
      <OwnerCTA />
    </div>
  );
}
