import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MatchQuiz from "../match/MatchQuiz";
import WhatsAppFab from "./WhatsAppFab";

export default function AppLayout() {
  const [quizOpen, setQuizOpen] = useState(false);

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
      <WhatsAppFab />
      <MatchQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
}
