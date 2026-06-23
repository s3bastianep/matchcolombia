import React, { lazy, Suspense } from "react";
import HeroSection from "../components/home/HeroSection";
import DeferredMount from "../components/ui/DeferredMount";
import HomeSectionSkeleton from "../components/home/HomeSectionSkeleton";
import Footer from "../components/layout/Footer";
import { cn } from "@/lib/utils";

const RentEasySection = lazy(() => import("../components/home/RentEasySection"));
const HomeRenterPromo = lazy(() => import("../components/home/HomeRenterPromo"));
const MatchSteps = lazy(() => import("../components/home/MatchSteps"));
const FeaturedProperties = lazy(() => import("../components/home/FeaturedProperties"));
const HomeSeoContent = lazy(() => import("../components/home/HomeSeoContent"));
const OwnerCTA = lazy(() => import("../components/home/OwnerCTA"));

const startQuiz = () => window.dispatchEvent(new CustomEvent("open-habibar-quiz"));

export default function Home() {
  return (
    <div
      className={cn(
        "w-full overflow-x-hidden",
        "flex-1 min-h-0 flex flex-col",
        "native-scroll-y lg:overflow-visible lg:flex-none lg:min-h-0",
        "pb-mobile-nav lg:pb-0"
      )}
    >
      <HeroSection onStartQuiz={startQuiz} />

      <DeferredMount
        rootMargin="200px 0px"
        minHeight="480px"
        fallback={<HomeSectionSkeleton minHeight="480px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="420px" />}>
          <RentEasySection />
        </Suspense>
        <Suspense fallback={<HomeSectionSkeleton minHeight="360px" />}>
          <HomeRenterPromo />
        </Suspense>
        <Suspense fallback={<HomeSectionSkeleton minHeight="520px" />}>
          <MatchSteps onStartQuiz={startQuiz} />
        </Suspense>
      </DeferredMount>

      <DeferredMount
        rootMargin="200px 0px"
        minHeight="360px"
        fallback={<HomeSectionSkeleton minHeight="360px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="360px" />}>
          <FeaturedProperties />
        </Suspense>
      </DeferredMount>

      <DeferredMount
        rootMargin="120px 0px"
        minHeight="280px"
        fallback={<HomeSectionSkeleton minHeight="280px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="280px" />}>
          <HomeSeoContent />
        </Suspense>
      </DeferredMount>

      <DeferredMount
        rootMargin="160px 0px"
        minHeight="320px"
        fallback={<HomeSectionSkeleton minHeight="320px" />}
      >
        <Suspense fallback={<HomeSectionSkeleton minHeight="320px" />}>
          <OwnerCTA />
        </Suspense>
      </DeferredMount>

      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
}
