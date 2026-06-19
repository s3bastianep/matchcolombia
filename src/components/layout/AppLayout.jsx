import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import MobileAppHeader from "./MobileAppHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileAccountSheet from "./MobileAccountSheet";
import AppOnboarding, { hasCompletedOnboarding } from "../mobile/AppOnboarding";
import OfflineBanner from "../mobile/OfflineBanner";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { useIsApp } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

const Footer = lazyWithRetry(() => import("./Footer"));
const MatchQuiz = lazyWithRetry(() => import("../match/MatchQuiz"));

export default function AppLayout() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  const isApp = useIsApp();
  const { isOpen: propertyOpen } = usePropertyPanel();
  const isExplore = location.pathname === "/explorar";
  const isHome = location.pathname === "/";
  const scrollLocked = isExplore || isHome;
  const hideChrome = propertyOpen || location.pathname === "/publicar/nuevo";

  const openQuiz = useCallback(() => setQuizOpen(true), []);

  useEffect(() => {
    if (isApp && !hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, [isApp]);

  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener("open-match-quiz", handler);
    return () => window.removeEventListener("open-match-quiz", handler);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  return (
    <div className={cn("flex flex-col overflow-x-hidden", scrollLocked ? "h-[100dvh]" : "min-h-[100dvh]")}>
      <div className="hidden lg:block">
        <Navbar onAccountClick={() => setAccountOpen(true)} />
      </div>
      {!hideChrome && <MobileAppHeader />}
      {!hideChrome && <OfflineBanner />}

      <main
        className={cn(
          "w-full overflow-x-hidden flex-1",
          scrollLocked ? "min-h-0 overflow-hidden flex flex-col" : "pb-mobile-nav lg:pb-0",
          hideChrome && "pb-0"
        )}
      >
        <Outlet />
      </main>

      {!isExplore && (
        <Suspense fallback={null}>
          <div className="hidden lg:block">
            <Footer />
          </div>
        </Suspense>
      )}

      {!hideChrome && (
        <MobileBottomNav
          onMatchClick={openQuiz}
          onAccountClick={() => setAccountOpen(true)}
          accountActive={accountOpen}
        />
      )}
      <MobileAccountSheet
        open={accountOpen}
        onOpenChange={setAccountOpen}
        onMatchClick={openQuiz}
      />
      {quizOpen && (
        <Suspense fallback={null}>
          <MatchQuiz open={quizOpen} onOpenChange={setQuizOpen} />
        </Suspense>
      )}
      {showOnboarding && <AppOnboarding onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
}
