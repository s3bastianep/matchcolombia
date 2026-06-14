import React, { useState, useEffect, lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";
import { usePropertyPanel } from "@/lib/PropertyPanelContext";

const MatchQuiz = lazy(() => import("../match/MatchQuiz"));

export default function AppLayout() {
  const [quizOpen, setQuizOpen] = useState(false);
  const { isOpen: propertyPanelOpen } = usePropertyPanel();

  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener("open-match-quiz", handler);
    return () => window.removeEventListener("open-match-quiz", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      {!propertyPanelOpen && <WhatsAppFab />}
      {quizOpen && (
        <Suspense fallback={null}>
          <MatchQuiz open={quizOpen} onOpenChange={setQuizOpen} />
        </Suspense>
      )}
    </div>
  );
}
