import { useState, useEffect } from "react";
import { getUnreadCount } from "@/lib/processNotifications";

export function useProcessNotifications() {
  const [count, setCount] = useState(getUnreadCount);

  useEffect(() => {
    const refresh = () => setCount(getUnreadCount());
    window.addEventListener("process-notifications-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("process-notifications-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return count;
}
