import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MatchQuiz from "../match/MatchQuiz";
import WhatsAppFab from "./WhatsAppFab";
import { cn } from "@/lib/utils";

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
      {!isExplore && <Footer />}
      <WhatsAppFab />
      <MatchQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
}
