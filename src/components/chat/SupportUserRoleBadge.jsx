import React from "react";
import { cn } from "@/lib/utils";
import { formatSupportUserRoleLabel, supportRoleBadgeClass } from "@/lib/supportChat";

export default function SupportUserRoleBadge({ role, className }) {
  const label = formatSupportUserRoleLabel(role);
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize",
        supportRoleBadgeClass(role),
        className
      )}
    >
      {label}
    </span>
  );
}
