import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ElevatorIcon({ muted = false, className, ...props }) {
  return (
    <ArrowUpDown
      className={cn(
        "w-3 h-3 shrink-0",
        muted ? "text-foreground/35" : "text-brand-magenta",
        className
      )}
      strokeWidth={2.25}
      aria-hidden
      {...props}
    />
  );
}
