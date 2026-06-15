import React, { lazy, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PROPERTY_LIST_QUERY } from "@/lib/queryOptions";
import HeroSection from "../components/home/HeroSection";
import DeferredMount from "../components/ui/DeferredMount";
import HomeSectionSkeleton from "../components/home/HomeSectionSkeleton";

const RentEasySection = lazy(() => import("../components/home/RentEasySection"));
const MatchSteps = lazy(() => import("../components/home/MatchSteps"));
const FeaturedProperties = lazy(() => import("../components/home/FeaturedProperties"));

const startQuiz = () => window.dispatchEvent(new CustomEvent("open-match-quiz"));

export default function Home() {
  const [featuredReady, setFeaturedReady] = useState(false);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-featured"],
    queryFn: () => base44.entities.Property.filter({ status: "disponible" }, "-created_date", 8),
    enabled: featuredReady,
    ...PROPERTY_LIST_QUERY,
  });

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection onStartQuiz={startQuiz} />

      <DeferredMount
        rootMargin="280px 0px"
        minHeight="720px"
        fallback={<HomeSectionSkeleton minHeight="720px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="420px" />}>
          <RentEasySection />
        </Suspense>
        <Suspense fallback={<HomeSectionSkeleton minHeight="480px" />}>
          <MatchSteps onStartQuiz={startQuiz} />
        </Suspense>
      </DeferredMount>

      <DeferredMount
        onMount={() => setFeaturedReady(true)}
        rootMargin="360px 0px"
        minHeight="480px"
        fallback={<HomeSectionSkeleton minHeight="480px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="480px" />}>
          <FeaturedProperties properties={properties} isLoading={isLoading} />
        </Suspense>
      </DeferredMount>
    </div>
  );
}
