import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import MobileAppHeader from "./MobileAppHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileAccountSheet from "./MobileAccountSheet";
import AppOnboarding, { hasCompletedOnboarding, shouldShowAppOnboarding } from "../mobile/AppOnboarding";
import OfflineBanner from "../mobile/OfflineBanner";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";
import { useIsApp } from "@/hooks/use-mobile";
import { isExplorePath } from "@/lib/explorePaths";
import { cn } from "@/lib/utils";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

const Footer = lazyWithRetry(() => import("./Footer"));
const MatchQuiz = lazyWithRetry(() => import("../match/MatchQuiz"));

export default function AppLayout() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => shouldShowAppOnboarding());
  const location = useLocation();
  const isApp = useIsApp();
  const { isOpen: propertyOpen } = usePropertyPanel();
  const isExplore = isExplorePath(location.pathname);
  const isHome = location.pathname === "/";
  const scrollLocked = isExplore || (isApp && isHome);
  const hideChrome = propertyOpen || location.pathname === "/publicar/nuevo";

  const openQuiz = useCallback(() => setQuizOpen(true), []);

  useEffect(() => {
    if (isApp && !hasCompletedOnboarding()) {
      setShowOnboarding(true);
    } else if (!isApp) {
      setShowOnboarding(false);
    }
  }, [isApp]);

  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener("open-habibar-quiz", handler);
    return () => window.removeEventListener("open-habibar-quiz", handler);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isExplore) return undefined;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      document.documentElement.classList.toggle("explore-desktop-lock", mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.documentElement.classList.remove("explore-desktop-lock");
    };
  }, [isExplore]);

  return (
    <div className={cn("flex flex-col overflow-x-hidden", scrollLocked ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]")}>
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
          {!isHome && (
            <div className="lg:hidden">
              <Footer />
            </div>
          )}
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
