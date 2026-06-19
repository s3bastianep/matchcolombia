import React from "react";
import { cn } from "@/lib/utils";

export default function AppEmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-foreground/35" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-extrabold text-lg tracking-tight text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        {action}
        {secondaryAction}
      </div>
    </div>
  );
}
