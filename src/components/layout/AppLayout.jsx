import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import WhatsAppFab from "./WhatsAppFab";
import { cn } from "@/lib/utils";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

const Footer = lazyWithRetry(() => import("./Footer"));
const MatchQuiz = lazyWithRetry(() => import("../match/MatchQuiz"));

export default function AppLayout() {
  const [quizOpen, setQuizOpen] = useState(false);
  const location = useLocation();
  const isExplore = location.pathname === "/explorar";

  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener("open-match-quiz", handler);
    return () => window.removeEventListener("open-match-quiz", handler);
  }, []);

  return (
    <div className={cn("flex flex-col overflow-x-hidden", isExplore ? "h-[100dvh]" : "min-h-screen")}>
      <Navbar />
      <main className={cn("w-full overflow-x-hidden", isExplore ? "flex-1 min-h-0 overflow-hidden" : "flex-1")}>
        <Outlet />
      </main>
      {!isExplore && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      <WhatsAppFab />
      {quizOpen && (
        <Suspense fallback={null}>
          <MatchQuiz open={quizOpen} onOpenChange={setQuizOpen} />
        </Suspense>
      )}
    </div>
  );
}
