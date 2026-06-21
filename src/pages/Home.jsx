import React, { lazy, Suspense, useState } from "react";

import HomeMobile from "./mobile/HomeMobile";
import HeroSection from "../components/home/HeroSection";

import DeferredMount from "../components/ui/DeferredMount";

import HomeSectionSkeleton from "../components/home/HomeSectionSkeleton";



const RentEasySection = lazy(() => import("../components/home/RentEasySection"));

const MatchSteps = lazy(() => import("../components/home/MatchSteps"));

const FeaturedProperties = lazy(() => import("../components/home/FeaturedProperties"));

const OwnerCTA = lazy(() => import("../components/home/OwnerCTA"));



const startQuiz = () => window.dispatchEvent(new CustomEvent("open-habibar-quiz"));



export default function Home() {

  const [featuredReady, setFeaturedReady] = useState(false);



  return (

    <>

      <div className="lg:hidden flex-1 min-h-0 flex flex-col">
        <HomeMobile />
      </div>


      <div className="hidden lg:block w-full overflow-x-hidden">

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

          {featuredReady && (

            <Suspense fallback={<HomeSectionSkeleton minHeight="480px" />}>

              <FeaturedProperties />

            </Suspense>

          )}

        </DeferredMount>

        <DeferredMount
          rootMargin="200px 0px"
          minHeight="320px"
          fallback={<HomeSectionSkeleton minHeight="320px" />}
        >
          <Suspense fallback={<HomeSectionSkeleton minHeight="320px" />}>
            <OwnerCTA />
          </Suspense>
        </DeferredMount>

      </div>

    </>

  );

}

