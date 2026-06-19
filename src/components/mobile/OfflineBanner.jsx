import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden shrink-0 overflow-hidden bg-foreground text-white"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            Sin conexión — algunos datos pueden estar desactualizados
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
